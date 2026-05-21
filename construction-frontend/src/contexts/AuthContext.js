"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";

import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} from "@/api/authApi";

const AuthContext = createContext(null);

// ======================================================
// USER NORMALIZER
// ======================================================
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
    role: typeof role === "string" ? role : null,
    is_active: Boolean(rawUser.is_active),
    is_email_verified: Boolean(rawUser.is_email_verified),
    last_login: rawUser.last_login,
    created_at: rawUser.created_at,
  };
};

// ======================================================
// PROVIDER
// ======================================================
export const AuthProvider = ({ children }) => {
  const pathname = usePathname();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [authInitialized, setAuthInitialized] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  // ======================================================
  // BOOTSTRAP TOKEN
  // ======================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (storedToken) {
      setToken(storedToken);
    }

    setAuthInitialized(true);
  }, []);

  // ======================================================
  // PROFILE QUERY
  // ======================================================
  const {
    data: profileData,
    error: profileError,
    isFetching: profileFetching,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: !authInitialized || !token,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
  });

  // ======================================================
  // AUTH SYNC (IMPORTANT FIX)
  // ======================================================
  useEffect(() => {
    if (!authInitialized) return;

    // no token → logged out (but resolved)
    if (!token) {
      setUser(null);
      setAuthResolved(true);
      return;
    }

    // still loading profile → DO NOTHING (critical fix)
    if (profileFetching) return;

    // success
    if (profileData?.user) {
      setUser(normalizeUser(profileData.user));
      setAuthResolved(true);
      return;
    }

    // invalid token
    if (profileError) {
      localStorage.removeItem("access_token");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      setToken(null);
      setUser(null);
      setAuthResolved(true);
    }
  }, [authInitialized, token, profileData, profileError, profileFetching]);

  // ======================================================
  // LOGIN
  // ======================================================
  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res?.access_token;
    if (!accessToken) throw new Error("No access token");

    setAuthResolved(false);

    localStorage.setItem("access_token", accessToken);
    document.cookie = `access_token=${accessToken}; path=/; max-age=86400`;

    setToken(accessToken);

    // allow profile query to resolve auth properly
    const profileRes = await refetchProfile();

    if (profileRes?.data?.user) {
      setUser(normalizeUser(profileRes.data.user));
    }

    setAuthResolved(true);

    return res;
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setToken(null);
    setUser(null);
    setAuthResolved(true);
  }, []);

  // ======================================================
  // DERIVED STATE (🔥 FIX HERE)
  // ======================================================

  // IMPORTANT: not just user-based
  const isAuthenticated = useMemo(() => {
    return Boolean(token && user);
  }, [token, user]);

  const isLoading = !authInitialized || !authResolved;

  // ======================================================
  // CONTEXT VALUE
  // ======================================================
  const value = {
    token,
    user,

    login,
    register: registerMutation,
    logout,

    authInitialized,
    authResolved,

    isAuthenticated,
    isLoading,
    profileFetching,

    hasRole: (role) => user?.role?.toLowerCase?.() === role?.toLowerCase?.(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ======================================================
// HOOK
// ======================================================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
