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
 * Normalize backend user → frontend-safe shape
 * Handles Sequelize nested models safely
 */
const normalizeUser = (user) => {
  if (!user) return null;

  const rawUser = user?.dataValues || user;

  let role = rawUser.role;

  if (role && typeof role === "object") {
    const roleData = role?.dataValues || role;
    role = roleData?.name || roleData?.role_name || null;
  }

  return {
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
};

export const AuthProvider = ({ children }) => {
  /**
   * IMPORTANT:
   * Initialize token immediately from localStorage
   * to avoid hydration race conditions in production
   */
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
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
    /**
     * Mark auth as initialized
     * token already restored synchronously
     */
    setAuthReady(true);
  }, []);

  // ======================================================
  // SYNC USER FROM PROFILE
  // ======================================================

  useEffect(() => {
    if (profileData?.user) {
      setUser(normalizeUser(profileData.user));
    }
  }, [profileData]);

  // ======================================================
  // LOGIN
  // ======================================================

  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res.access_token || res.accessToken;

    if (!accessToken) {
      throw new Error("No access token received from server");
    }

    // Save token
    localStorage.setItem("access_token", accessToken);

    // Update state immediately
    setToken(accessToken);

    /**
     * PRIORITY:
     * Use login response user directly
     * avoids extra race condition
     */
    if (res.user) {
      const normalized = normalizeUser(res.user);

      setUser(normalized);

      return {
        ...res,
        user: normalized,
      };
    }

    /**
     * FALLBACK:
     * Refetch profile manually
     */
    const profileRes = await refetchProfile();

    if (profileRes?.data?.user) {
      setUser(normalizeUser(profileRes.data.user));
    }

    return res;
  };

  // ======================================================
  // REGISTER
  // ======================================================

  const register = async (data) => {
    return await registerMutation(data).unwrap();
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    localStorage.removeItem("access_token");

    setToken(null);
    setUser(null);
  };

  // ======================================================
  // REFRESH USER
  // ======================================================

  const refreshUser = useCallback(async () => {
    if (!token) return;

    const res = await refetchProfile();

    if (res?.data?.user) {
      setUser(normalizeUser(res.data.user));
    }
  }, [token, refetchProfile]);

  // ======================================================
  // COMPUTED HELPERS
  // ======================================================

  const isUserActive = useCallback(() => {
    return Boolean(user?.is_active ?? user?.isActive);
  }, [user]);

  const isEmailVerified = useCallback(() => {
    return Boolean(user?.is_email_verified ?? user?.isEmailVerified);
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
        hasRole: (roleName) =>
          user?.role?.toLowerCase() === roleName?.toLowerCase(),
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
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};
