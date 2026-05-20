"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
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
 * ======================================================
 * USER NORMALIZER
 * ======================================================
 */

const normalizeUser = (user) => {
  if (!user) {
    authWarn("normalizeUser called with null user");
    return null;
  }

  authLog("Raw user before normalization:", user);

  const rawUser = user?.dataValues || user;

  let role = rawUser.role;

  /**
   * Sequelize nested model support
   */
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

    /**
     * ALWAYS normalized string role
     */
    role: typeof role === "string" ? role : null,

    // Flags
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
   * ======================================================
   * STATE
   * ======================================================
   */

  const [token, setToken] = useState(null);

  const [user, setUser] = useState(null);

  /**
   * authReady =
   * localStorage hydration finished
   */
  const [authReady, setAuthReady] = useState(false);

  /**
   * ======================================================
   * MUTATIONS
   * ======================================================
   */

  const [loginMutation] = useLoginMutation();

  const [registerMutation] = useRegisterMutation();

  /**
   * ======================================================
   * BOOTSTRAP TOKEN
   * ======================================================
   */

  useEffect(() => {
    authLog("Auth bootstrap started");

    try {
      const storedToken = localStorage.getItem("access_token");

      authLog(
        "Initial token from localStorage:",
        storedToken ? "FOUND" : "NOT FOUND",
      );

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (err) {
      authError("Failed to read localStorage token:", err);
    } finally {
      /**
       * VERY IMPORTANT:
       * hydration complete
       */
      setAuthReady(true);

      authLog("Auth ready set TRUE");
    }
  }, []);

  /**
   * ======================================================
   * PROFILE QUERY
   * ======================================================
   */

  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    /**
     * ONLY RUN AFTER:
     * - hydration finished
     * - token exists
     */
    skip: !authReady || !token,

    refetchOnMountOrArgChange: true,
  });

  /**
   * ======================================================
   * PROFILE QUERY LOGGER
   * ======================================================
   */

  useEffect(() => {
    authLog("Profile query state:", {
      authReady,
      hasToken: Boolean(token),
      profileLoading,
      hasProfileData: Boolean(profileData),
      profileError,
    });
  }, [authReady, token, profileLoading, profileData, profileError]);

  /**
   * ======================================================
   * SYNC USER FROM PROFILE
   * ======================================================
   */

  useEffect(() => {
    /**
     * No token
     */
    if (!token) {
      authLog("No token present — clearing user");

      setUser(null);

      return;
    }

    /**
     * Profile loaded successfully
     */
    if (profileData?.user) {
      authLog("Profile data received:", profileData);

      const normalized = normalizeUser(profileData.user);

      setUser(normalized);

      authLog("User synced from profile");

      return;
    }

    /**
     * Invalid token / unauthorized
     */
    if (profileError) {
      authError("Profile fetch failed:", profileError);

      localStorage.removeItem("access_token");

      setToken(null);
      setUser(null);

      authWarn("Invalid token removed");
    }
  }, [profileData, profileError, token]);

  /**
   * ======================================================
   * LOGIN
   * ======================================================
   */

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

      /**
       * Save token
       */
      localStorage.setItem("access_token", accessToken);

      setToken(accessToken);

      authLog("Token stored successfully");

      /**
       * BEST CASE:
       * login already returned user
       */
      if (res.user) {
        authLog("Using user from login response");

        const normalized = normalizeUser(res.user);

        setUser(normalized);

        return {
          ...res,
          user: normalized,
        };
      }

      /**
       * FALLBACK:
       * fetch profile
       */
      authWarn("No user in login response — refetching profile");

      const profileRes = await refetchProfile();

      authLog("Profile refetch response:", profileRes);

      if (profileRes?.data?.user) {
        const normalized = normalizeUser(profileRes.data.user);

        setUser(normalized);

        authLog("User synced from profile refetch");

        return {
          ...res,
          user: normalized,
        };
      }

      return res;
    } catch (err) {
      authError("Login failed:", err);

      throw err;
    }
  };

  /**
   * ======================================================
   * REGISTER
   * ======================================================
   */

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

  /**
   * ======================================================
   * LOGOUT
   * ======================================================
   */

  const logout = useCallback(() => {
    authLog("Logout started");

    localStorage.removeItem("access_token");

    setToken(null);
    setUser(null);

    authLog("Auth state cleared");
  }, []);

  /**
   * ======================================================
   * REFRESH USER
   * ======================================================
   */

  const refreshUser = useCallback(async () => {
    try {
      authLog("Manual refreshUser called");

      if (!token) {
        authWarn("refreshUser aborted — no token");
        return null;
      }

      const res = await refetchProfile();

      authLog("refreshUser response:", res);

      if (res?.data?.user) {
        const normalized = normalizeUser(res.data.user);

        setUser(normalized);

        authLog("User refreshed successfully");

        return normalized;
      }

      return null;
    } catch (err) {
      authError("refreshUser failed:", err);

      return null;
    }
  }, [token, refetchProfile]);

  /**
   * ======================================================
   * HELPERS
   * ======================================================
   */

  const isUserActive = useMemo(() => {
    return Boolean(user?.is_active ?? user?.isActive);
  }, [user]);

  const isEmailVerified = useMemo(() => {
    return Boolean(user?.is_email_verified ?? user?.isEmailVerified);
  }, [user]);

  /**
   * ======================================================
   * IMPORTANT FIX
   * ======================================================
   *
   * AUTHENTICATED ONLY WHEN:
   * token + user BOTH exist
   */

  const isAuthenticated = Boolean(token && user);

  /**
   * ======================================================
   * LOADING STATE
   * ======================================================
   */

  const isLoading =
    !authReady ||
    (Boolean(token) && profileLoading) ||
    (Boolean(token) && !user && !profileError);

  /**
   * ======================================================
   * DEBUG GLOBAL STATE
   * ======================================================
   */

  useEffect(() => {
    authLog("GLOBAL AUTH STATE:", {
      authReady,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
      userRole: user?.role,
      isAuthenticated,
      isLoading,
      isUserActive,
      isEmailVerified,
    });
  }, [
    authReady,
    token,
    user,
    isAuthenticated,
    isLoading,
    isUserActive,
    isEmailVerified,
  ]);

  /**
   * ======================================================
   * PROVIDER VALUE
   * ======================================================
   */

  const value = {
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
    authReady,
    isAuthenticated,
    isLoading,

    // Flags
    isActive: isUserActive,
    isEmailVerified,

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * ======================================================
 * HOOK
 * ======================================================
 */

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    authError("useAuth used outside AuthProvider");

    throw new Error("useAuth must be used within AuthProvider");
  }

  authLog("useAuth hook accessed");

  return ctx;
};
