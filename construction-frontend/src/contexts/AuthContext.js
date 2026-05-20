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
 * Based on your users table schema
 */
const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role:
      typeof user.role === "string"
        ? user.role
        : user.role?.name || user.role?.role_name || null,

    // Critical fields from your DB schema
    is_active: Boolean(user.is_active), // TINYINT(1)
    is_email_verified: Boolean(user.is_email_verified), // TINYINT(1)

    // Backward compatibility
    isActive: Boolean(user.is_active),
    isEmailVerified: Boolean(user.is_email_verified),

    last_login: user.last_login,
    created_at: user.created_at,
  };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileLoading,
  } = useGetProfileQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true, // Important for freshness
  });

  // Hydrate token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
    setAuthReady(true);
  }, []);

  // Sync user when profile data changes
  useEffect(() => {
    if (profileData?.user) {
      setUser(normalizeUser(profileData.user));
    }
  }, [profileData]);

  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res.access_token || res.accessToken;
    if (!accessToken) throw new Error("No access token received from server");

    // Save token
    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);

    // Prioritize user data from login response
    if (res.user) {
      const normalized = normalizeUser(res.user);
      setUser(normalized);
      return { ...res, user: normalized };
    }

    // Fallback: force fetch latest profile
    const profileRes = await refetchProfile();
    if (profileRes?.data?.user) {
      const normalized = normalizeUser(profileRes.data.user);
      setUser(normalized);
    }

    return res;
  };

  const register = async (data) => {
    return await registerMutation(data).unwrap();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const res = await refetchProfile();
    if (res?.data?.user) {
      setUser(normalizeUser(res.data.user));
    }
  }, [token, refetchProfile]);

  // Computed values
  const isUserActive = useCallback(() => {
    return Boolean(user?.is_active ?? user?.isActive);
  }, [user]);

  const isEmailVerified = useCallback(() => {
    return Boolean(user?.is_email_verified ?? user?.isEmailVerified);
  }, [user]);

  const isAuthenticated = Boolean(token && user);
  console.log(user);
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
        isActive: isUserActive(),
        isEmailVerified: isEmailVerified(),
        isLoading: !authReady || profileLoading,

        // Helpers
        hasRole: (roleName) => user?.role === roleName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
