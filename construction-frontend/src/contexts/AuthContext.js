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

    // backward compatibility
    isActive: Boolean(rawUser.is_active),
    isEmailVerified: Boolean(rawUser.is_email_verified),

    last_login: rawUser.last_login,
    created_at: rawUser.created_at,
  };
};

// ======================================================
// PROVIDER
// ======================================================
export const AuthProvider = ({ children }) => {
  // ====================================================
  // STATE
  // ====================================================
  const [token, setToken] = useState(null);

  // Persist user during refetches
  const [user, setUser] = useState(null);

  // Only for initial bootstrap
  const [authInitialized, setAuthInitialized] = useState(false);

  // ====================================================
  // MUTATIONS
  // ====================================================
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  // ====================================================
  // BOOTSTRAP TOKEN
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
  // PROFILE QUERY
  // ====================================================
  const {
    data: profileData,
    error: profileError,
    isFetching: profileFetching,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: !token,

    // IMPORTANT
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // ====================================================
  // SYNC PROFILE
  // ====================================================
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    // SUCCESS
    if (profileData?.user) {
      setUser(normalizeUser(profileData.user));
      return;
    }

    // INVALID TOKEN
    if (profileError) {
      localStorage.removeItem("access_token");

      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      setToken(null);
      setUser(null);
    }
  }, [profileData, profileError, token]);

  // ====================================================
  // LOGIN
  // ====================================================
  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res?.access_token || res?.accessToken;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Persist token
    localStorage.setItem("access_token", accessToken);

    document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

    setToken(accessToken);

    // Backend returned user
    if (res?.user) {
      const normalized = normalizeUser(res.user);

      setUser(normalized);

      return {
        ...res,
        user: normalized,
      };
    }

    // Fallback profile fetch
    const profileRes = await refetchProfile();

    if (profileRes?.data?.user) {
      const normalized = normalizeUser(profileRes.data.user);

      setUser(normalized);

      return {
        ...res,
        user: normalized,
      };
    }

    return res;
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
  const isAuthenticated = Boolean(token);

  // ONLY initial bootstrap loading
  // NOT background refetches
  const isLoading = !authInitialized;

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
    userMeta: user,

    login,
    register,
    logout,
    refreshUser,

    authInitialized,

    isAuthenticated,
    isLoading,

    profileFetching,

    isActive,
    isEmailVerified,

    hasRole: (roleName) =>
      user?.role?.toLowerCase() === roleName?.toLowerCase(),
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
