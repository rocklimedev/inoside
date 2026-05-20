"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} from "@/api/authApi";

const AuthContext = createContext(null);

/**
 * ======================================================
 * DEBUG LOGGER
 * ======================================================
 */

const AUTH_DEBUG = true;

const authLog = (...args) => {
  if (AUTH_DEBUG) {
    console.log("%c[AUTH]", "color:#22c55e;font-weight:bold;", ...args);
  }
};

const authWarn = (...args) => {
  if (AUTH_DEBUG) {
    console.warn(
      "%c[AUTH WARNING]",
      "color:#f59e0b;font-weight:bold;",
      ...args,
    );
  }
};

const authError = (...args) => {
  if (AUTH_DEBUG) {
    console.error("%c[AUTH ERROR]", "color:#ef4444;font-weight:bold;", ...args);
  }
};

/**
 * Normalize backend user → frontend-safe shape
 * Handles Sequelize nested models safely
 */
const normalizeUser = (user) => {
  if (!user) {
    authWarn("normalizeUser called with null user");
    return null;
  }

  authLog("Raw user before normalization:", user);

  const rawUser = user?.dataValues || user;

  let role = rawUser.role;

  if (role && typeof role === "object") {
    const roleData = role?.dataValues || role;

    authLog("Nested role detected:", roleData);

    role = roleData?.name || roleData?.role_name || null;
  }

  const normalized = {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    phone: rawUser.phone,

    // Always normalized string
    role: typeof role === "string" ? role : null,

    // Account flags
    is_active: Boolean(rawUser.is_active),
    is_email_verified: Boolean(rawUser.is_email_verified),

    // Backward compatibility
    isActive: Boolean(rawUser.is_active),
    isEmailVerified: Boolean(rawUser.is_email_verified),

    // Metadata
    last_login: rawUser.last_login,
    created_at: rawUser.created_at,
  };

  authLog("Normalized user:", normalized);

  return normalized;
};

export const AuthProvider = ({ children }) => {
  /**
   * IMPORTANT:
   * Initialize token immediately from localStorage
   * to avoid hydration race conditions in production
   */
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access_token");

      authLog(
        "Initial token from localStorage:",
        storedToken ? "FOUND" : "NOT FOUND",
      );

      return storedToken;
    }

    authWarn("Window undefined during token init");

    return null;
  });

  const [user, setUser] = useState(null);

  /**
   * Tracks whether auth system has fully booted
   */
  const [authReady, setAuthReady] = useState(false);

  // ======================================================
  // MUTATIONS
  // ======================================================

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  // ======================================================
  // PROFILE QUERY
  // ======================================================

  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    /**
     * Prevent query before hydration completes
     */
    skip: !authReady || !token,

    /**
     * Always refresh profile when mounting
     */
    refetchOnMountOrArgChange: true,
  });

  // ======================================================
  // AUTH BOOTSTRAP
  // ======================================================

  useEffect(() => {
    authLog("Auth bootstrap started");

    /**
     * Mark auth as initialized
     * token already restored synchronously
     */
    setAuthReady(true);

    authLog("Auth ready set to TRUE");
  }, []);

  // ======================================================
  // PROFILE QUERY LOGGING
  // ======================================================

  useEffect(() => {
    authLog("Profile query state:", {
      authReady,
      hasToken: Boolean(token),
      profileLoading,
      hasProfileData: Boolean(profileData),
      profileError,
    });
  }, [authReady, token, profileLoading, profileData, profileError]);

  // ======================================================
  // SYNC USER FROM PROFILE
  // ======================================================

  useEffect(() => {
    if (profileData?.user) {
      authLog("Profile data received:", profileData);

      const normalized = normalizeUser(profileData.user);

      setUser(normalized);

      authLog("User synced from profile");
    } else {
      authWarn("No user in profileData");
    }
  }, [profileData]);

  // ======================================================
  // LOGIN
  // ======================================================

  const login = async (credentials) => {
    try {
      authLog("Login attempt started", {
        email: credentials?.email,
      });

      const res = await loginMutation(credentials).unwrap();

      authLog("Login response:", res);

      const accessToken = res.access_token || res.accessToken;

      if (!accessToken) {
        authError("No access token received");

        throw new Error("No access token received from server");
      }

      authLog("Access token received");

      // Save token
      localStorage.setItem("access_token", accessToken);

      authLog("Token saved to localStorage");

      // Update state immediately
      setToken(accessToken);

      authLog("Token state updated");

      /**
       * PRIORITY:
       * Use login response user directly
       * avoids extra race condition
       */
      if (res.user) {
        authLog("Using user directly from login response");

        const normalized = normalizeUser(res.user);

        setUser(normalized);

        authLog("User state updated from login response");

        return {
          ...res,
          user: normalized,
        };
      }

      authWarn("No user in login response, refetching profile");

      /**
       * FALLBACK:
       * Refetch profile manually
       */
      const profileRes = await refetchProfile();

      authLog("Profile refetch response:", profileRes);

      if (profileRes?.data?.user) {
        setUser(normalizeUser(profileRes.data.user));

        authLog("User updated from profile refetch");
      }

      return res;
    } catch (err) {
      authError("Login failed:", err);

      throw err;
    }
  };

  // ======================================================
  // REGISTER
  // ======================================================

  const register = async (data) => {
    try {
      authLog("Register attempt:", data?.email);

      const res = await registerMutation(data).unwrap();

      authLog("Register success:", res);

      return res;
    } catch (err) {
      authError("Register failed:", err);

      throw err;
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    authLog("Logout started");

    localStorage.removeItem("access_token");

    authLog("Token removed from localStorage");

    setToken(null);
    setUser(null);

    authLog("Auth state cleared");
  };

  // ======================================================
  // REFRESH USER
  // ======================================================

  const refreshUser = useCallback(async () => {
    try {
      authLog("Manual refreshUser called");

      if (!token) {
        authWarn("refreshUser aborted — no token");
        return;
      }

      const res = await refetchProfile();

      authLog("refreshUser response:", res);

      if (res?.data?.user) {
        setUser(normalizeUser(res.data.user));

        authLog("User refreshed successfully");
      }
    } catch (err) {
      authError("refreshUser failed:", err);
    }
  }, [token, refetchProfile]);

  // ======================================================
  // COMPUTED HELPERS
  // ======================================================

  const isUserActive = useCallback(() => {
    const result = Boolean(user?.is_active ?? user?.isActive);

    authLog("isUserActive:", result);

    return result;
  }, [user]);

  const isEmailVerified = useCallback(() => {
    const result = Boolean(user?.is_email_verified ?? user?.isEmailVerified);

    authLog("isEmailVerified:", result);

    return result;
  }, [user]);

  /**
   * IMPORTANT:
   * Auth = token existence
   * NOT token + user
   */
  const isAuthenticated = Boolean(token);

  /**
   * IMPORTANT:
   * Wait for hydration and profile fetch
   */
  const isLoading = !authReady || (token && profileLoading);

  // ======================================================
  // GLOBAL STATE LOGGER
  // ======================================================

  useEffect(() => {
    authLog("GLOBAL AUTH STATE:", {
      authReady,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
      userRole: user?.role,
      isAuthenticated,
      isLoading,
    });
  }, [authReady, token, user, isAuthenticated, isLoading]);

  // ======================================================
  // PROVIDER
  // ======================================================

  return (
    <AuthContext.Provider
      value={{
        // State
        token,
        user,
        userMeta: user,

        // Methods
        login,
        register,
        logout,
        refreshUser,

        // Status
        isAuthenticated,
        isLoading,
        isActive: isUserActive(),
        isEmailVerified: isEmailVerified(),

        // Helpers
        hasRole: (roleName) => {
          const result = user?.role?.toLowerCase() === roleName?.toLowerCase();

          authLog("hasRole check:", {
            expected: roleName,
            actual: user?.role,
            result,
          });

          return result;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    authError("useAuth used outside AuthProvider");

    throw new Error("useAuth must be used within AuthProvider");
  }

  authLog("useAuth hook accessed");

  return ctx;
};
