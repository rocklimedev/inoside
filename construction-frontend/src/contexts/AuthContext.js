"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";

import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} from "@/api/authApi";

const AuthContext = createContext(null);

// ======================================================
// DEBUG LOGGER
// ======================================================
const AUTH_DEBUG = process.env.NODE_ENV === "development";
const authLog = (...args) =>
  AUTH_DEBUG &&
  console.log("%c[AUTH]", "color:#22c55e;font-weight:bold;", ...args);
const authWarn = (...args) =>
  AUTH_DEBUG &&
  console.warn("%c[AUTH WARNING]", "color:#f59e0b;font-weight:bold;", ...args);
const authError = (...args) =>
  AUTH_DEBUG &&
  console.error("%c[AUTH ERROR]", "color:#ef4444;font-weight:bold;", ...args);

// ======================================================
// USER NORMALIZER
// ======================================================
const normalizeUser = (user) => {
  if (!user) {
    authWarn("normalizeUser called with null user");
    return null;
  }

  const rawUser = user?.dataValues || user;

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
    is_active: Boolean(rawUser.is_active),
    is_email_verified: Boolean(rawUser.is_email_verified),
    // Backward compat
    isActive: Boolean(rawUser.is_active),
    isEmailVerified: Boolean(rawUser.is_email_verified),
    last_login: rawUser.last_login,
    created_at: rawUser.created_at,
  };

  authLog("Normalized user:", normalized);
  return normalized;
};

// ======================================================
// PROVIDER
// ======================================================
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  // Safety escape: if profile fetch takes > 6s, stop blocking the UI
  const [profileTimedOut, setProfileTimedOut] = useState(false);
  const profileTimeoutRef = useRef(null);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  // ── Bootstrap token ──────────────────────────────────
  useEffect(() => {
    authLog("Auth bootstrap started");
    try {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        authLog("Token found in localStorage");
        setToken(storedToken);
      } else {
        authLog("No token in localStorage");
      }
    } catch (err) {
      authError("Failed to read token:", err);
    } finally {
      setAuthReady(true);
      authLog("authReady = true");
    }
  }, []);

  // ── Profile fetch ────────────────────────────────────
  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: !authReady || !token,
    refetchOnMountOrArgChange: false,
  });

  // Start a safety timeout whenever a profile fetch begins
  useEffect(() => {
    if (!token || !authReady || profileTimedOut) return;

    profileTimeoutRef.current = setTimeout(() => {
      if (!user) {
        authWarn("Profile fetch timed out after 6s — releasing loading state");
        setProfileTimedOut(true);
      }
    }, 6000);

    return () => clearTimeout(profileTimeoutRef.current);
  }, [token, authReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear timeout once user loads successfully
  useEffect(() => {
    if (user) {
      clearTimeout(profileTimeoutRef.current);
      setProfileTimedOut(false);
    }
  }, [user]);

  // ── Sync user from profile ───────────────────────────
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    if (profileData?.user) {
      authLog("Profile data received");
      setUser(normalizeUser(profileData.user));
      return;
    }

    if (profileError) {
      authError("Profile fetch failed:", profileError);
      localStorage.removeItem("access_token");
      // Also clear the cookie set during login
      document.cookie = "access_token=; path=/; max-age=0";
      setToken(null);
      setUser(null);
      authWarn("Invalid token removed");
    }
  }, [profileData, profileError, token]);

  // ── Login ────────────────────────────────────────────
  const login = async (credentials) => {
    try {
      authLog("Login attempt:", credentials?.email);
      const res = await loginMutation(credentials).unwrap();
      const accessToken = res.access_token || res.accessToken;

      if (!accessToken) throw new Error("No access token received");

      // Store in both localStorage AND a cookie so middleware can read it
      localStorage.setItem("access_token", accessToken);
      document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      setToken(accessToken);
      setProfileTimedOut(false); // reset timeout on fresh login

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

  // ── Register ─────────────────────────────────────────
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

  // ── Logout ───────────────────────────────────────────
  const logout = useCallback(() => {
    authLog("Logout");
    localStorage.removeItem("access_token");
    document.cookie = "access_token=; path=/; max-age=0";
    setToken(null);
    setUser(null);
  }, []);

  // ── Refresh user ─────────────────────────────────────
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

  // ── Derived state ────────────────────────────────────
  const isUserActive = useMemo(
    () => Boolean(user?.is_active ?? user?.isActive),
    [user],
  );
  const isEmailVerified = useMemo(
    () => Boolean(user?.is_email_verified ?? user?.isEmailVerified),
    [user],
  );
  const isAuthenticated = Boolean(token && user);

  // isLoading is true only while we genuinely don't know yet.
  // profileTimedOut is the safety escape hatch.
  const isLoading =
    !profileTimedOut &&
    (!authReady ||
      (Boolean(token) && (profileLoading || !user) && !profileError));

  // ── Debug logger ─────────────────────────────────────
  useEffect(() => {
    authLog("AUTH STATE:", {
      authReady,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
      userRole: user?.role,
      isAuthenticated,
      isLoading,
      isActive: isUserActive,
      isEmailVerified,
      profileTimedOut,
    });
  }, [
    authReady,
    token,
    user?.role,
    isAuthenticated,
    isLoading,
    isUserActive,
    isEmailVerified,
    profileTimedOut,
  ]);

  // ── Context value ────────────────────────────────────
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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  if (AUTH_DEBUG) authLog("useAuth accessed");
  return ctx;
};
