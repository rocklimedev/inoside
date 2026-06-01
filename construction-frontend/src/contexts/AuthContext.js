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
    isActive: Boolean(rawUser.is_active),
    isEmailVerified: Boolean(rawUser.is_email_verified),
    last_login: rawUser.last_login,
    created_at: rawUser.created_at, // Avatar
    avatar_url: rawUser.avatar_url || null,

    avatar_thumbnail: rawUser.avatar_thumbnail || null,
  };
};

// ======================================================
// PROVIDER
// ======================================================
export const AuthProvider = ({ children }) => {
  const pathname = usePathname();

  // ====================================================
  // STATE
  // ====================================================
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);

  // ====================================================
  // MUTATIONS
  // ====================================================
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  // inside AuthProvider (above return)

  const roleRoutes = useMemo(
    () => ({
      architect: "/dashboard/architect",
      client: "/dashboard/client",
      builder: "/dashboard/builder",
      site_supervisor: "/dashboard/site-supervisor",
      team_member: "/dashboard/team",
      admin: "/dashboard/admin",
      super_admin: "/dashboard/admin",
    }),
    [],
  );

  const getDefaultRoute = useCallback(() => {
    const roleKey = user?.role?.toLowerCase?.();
    return roleRoutes[roleKey] || "/dashboard/architect";
  }, [user, roleRoutes]);
  // ====================================================
  // BOOTSTRAP TOKEN FROM LOCALSTORAGE
  // ====================================================
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setToken(storedToken);
      }
    } finally {
      setAuthInitialized(true);
    }
  }, []);

  // ====================================================
  // PROFILE QUERY - WITH MANUAL REFETCH CONTROL
  // ====================================================
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
  // ====================================================
  // SYNC PROFILE TO STATE
  // ====================================================
  useEffect(() => {
    if (!authInitialized) return;

    // No token
    if (!token) {
      setUser(null);
      setAuthResolved(true);
      return;
    }

    // Still fetching
    if (profileFetching) {
      return;
    }

    // Success
    if (profileData?.user) {
      setUser(normalizeUser(profileData.user));
      setAuthResolved(true);
      return;
    }

    // Error - Invalid token
    if (profileError) {
      localStorage.removeItem("access_token");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setToken(null);
      setUser(null);
      setAuthResolved(true);
      return;
    }
  }, [authInitialized, token, profileData, profileError, profileFetching]);

  // ====================================================
  // LOGIN
  // ====================================================
  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res?.access_token;
    if (!accessToken) {
      throw new Error("No access token received");
    }

    setAuthResolved(false);
    localStorage.setItem("access_token", accessToken);
    document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    setToken(accessToken);

    if (res?.user) {
      const normalized = normalizeUser(res.user);
      setUser(normalized);
      setAuthResolved(true);
      return { ...res, user: normalized };
    }

    // Fallback: fetch profile
    const profileRes = await refetchProfile();
    if (profileRes?.data?.user) {
      const normalized = normalizeUser(profileRes.data.user);
      setUser(normalized);
      setAuthResolved(true);
      return { ...res, user: normalized };
    }

    throw new Error("Failed to fetch authenticated user");
  };

  // ====================================================
  // REGISTER
  // ====================================================
  const register = async (data) => {
    return await registerMutation(data).unwrap();
  };

  // ====================================================
  // LOGOUT
  // ====================================================
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setToken(null);
    setUser(null);
    setAuthResolved(true);
  }, []);

  // ====================================================
  // REFRESH USER
  // ====================================================
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
    } catch {
      return null;
    }
  }, [token, refetchProfile]);

  // ====================================================
  // DERIVED STATE
  // ====================================================
  const isAuthenticated = Boolean(user);
  const isLoading = !authInitialized || !authResolved;

  const isActive = useMemo(
    () => Boolean(user?.is_active ?? user?.isActive),
    [user],
  );

  const isEmailVerified = useMemo(
    () => Boolean(user?.is_email_verified ?? user?.isEmailVerified),
    [user],
  );

  // ====================================================
  // CONTEXT VALUE
  // ====================================================
  const value = {
    token,
    user,
    login,
    register,
    logout,
    refreshUser,
    authInitialized,
    authResolved,
    isAuthenticated,
    isLoading,
    profileFetching,
    isActive,
    isEmailVerified,
    hasRole: (roleName) =>
      user?.role?.toLowerCase() === roleName?.toLowerCase(),

    getDefaultRoute, // 👈 add this
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ======================================================
// HOOK
// ======================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
