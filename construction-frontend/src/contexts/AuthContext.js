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
const AUTH_DEBUG = process.env.NODE_ENV === "development";

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

  const rawUser = user?.dataValues || user;

  // Handle nested Sequelize role object
  let role = rawUser.role;
  if (role && typeof role === "object") {
    const roleData = role?.dataValues || role;
    role = roleData?.name || roleData?.role_name || null;
  }

  const normalized = {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    phone: rawUser.phone,
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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  /**
   * BOOTSTRAP TOKEN FROM LOCALSTORAGE
   */
  useEffect(() => {
    authLog("Auth bootstrap started");

    try {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        authLog("Token found in localStorage");
        setToken(storedToken);
      } else {
        authLog("No token found in localStorage");
      }
    } catch (err) {
      authError("Failed to read token from localStorage:", err);
    } finally {
      setAuthReady(true);
      authLog("Auth hydration complete → authReady = true");
    }
  }, []);

  /**
   * PROFILE QUERY
   */
  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: !authReady || !token,
    refetchOnMountOrArgChange: false, // Changed to false to reduce noise
  });

  /**
   * SYNC USER FROM PROFILE
   */
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    if (profileData?.user) {
      authLog("Profile data received");
      const normalized = normalizeUser(profileData.user);
      setUser(normalized);
      return;
    }

    if (profileError) {
      authError("Profile fetch failed:", profileError);
      localStorage.removeItem("access_token");
      setToken(null);
      setUser(null);
      authWarn("Invalid token removed");
    }
  }, [profileData, profileError, token]);

  /**
   * LOGIN
   */
  const login = async (credentials) => {
    try {
      authLog("Login attempt started", { email: credentials?.email });

      const res = await loginMutation(credentials).unwrap();
      const accessToken = res.access_token || res.accessToken;

      if (!accessToken) throw new Error("No access token received");

      localStorage.setItem("access_token", accessToken);
      setToken(accessToken);

      if (res.user) {
        const normalized = normalizeUser(res.user);
        setUser(normalized);
        return { ...res, user: normalized };
      }

      // Fallback: fetch profile
      const profileRes = await refetchProfile();
      if (profileRes?.data?.user) {
        const normalized = normalizeUser(profileRes.data.user);
        setUser(normalized);
        return { ...res, user: normalized };
      }

      return res;
    } catch (err) {
      authError("Login failed:", err);
      throw err;
    }
  };

  /**
   * REGISTER
   */
  const register = async (data) => {
    try {
      authLog("Register attempt:", data?.email);
      const res = await registerMutation(data).unwrap();
      authLog("Register success");
      return res;
    } catch (err) {
      authError("Register failed:", err);
      throw err;
    }
  };

  /**
   * LOGOUT
   */
  const logout = useCallback(() => {
    authLog("Logout started");
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    authLog("Auth state cleared");
  }, []);

  /**
   * REFRESH USER
   */
  const refreshUser = useCallback(async () => {
    if (!token) return null;

    try {
      const res = await refetchProfile();
      if (res?.data?.user) {
        const normalized = normalizeUser(res.data.user);
        setUser(normalized);
        return normalized;
      }
      return null;
    } catch (err) {
      authError("refreshUser failed:", err);
      return null;
    }
  }, [token, refetchProfile]);

  /**
   * HELPERS
   */
  const isUserActive = useMemo(
    () => Boolean(user?.is_active ?? user?.isActive),
    [user],
  );
  const isEmailVerified = useMemo(
    () => Boolean(user?.is_email_verified ?? user?.isEmailVerified),
    [user],
  );

  const isAuthenticated = Boolean(token && user);

  const isLoading =
    !authReady ||
    (Boolean(token) && (profileLoading || !user) && !profileError);

  /**
   * GLOBAL STATE LOGGER (Optimized)
   */
  useEffect(() => {
    authLog("GLOBAL AUTH STATE:", {
      authReady,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
      userRole: user?.role,
      isAuthenticated,
      isLoading,
      isActive: isUserActive,
      isEmailVerified,
    });
  }, [
    authReady,
    token,
    user?.role,
    isAuthenticated,
    isLoading,
    isUserActive,
    isEmailVerified,
  ]);

  /**
   * VALUE
   */
  const value = {
    token,
    user,
    userMeta: user,

    login,
    register,
    logout,
    refreshUser,

    authReady,
    isAuthenticated,
    isLoading,

    isActive: isUserActive,
    isEmailVerified,

    hasRole: (roleName) =>
      user?.role?.toLowerCase() === roleName?.toLowerCase(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  if (AUTH_DEBUG) {
    authLog("useAuth hook accessed");
  }

  return ctx;
};
