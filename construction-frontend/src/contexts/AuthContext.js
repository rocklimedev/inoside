"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} from "@/api/authApi";

const AuthContext = createContext(null);

/**
 * Normalize backend user → frontend-safe shape
 * KEEP IMPORTANT STATUS FIELDS
 */
const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: typeof user.role === "string" ? user.role : user.role?.name || null,

    // ← ADD THESE FIELDS
    is_active: user.is_active ?? user.isActive ?? false,
    is_email_verified: user.is_email_verified ?? user.isEmailVerified ?? false,
    isActive: user.is_active ?? user.isActive ?? false, // for backward compatibility
    isEmailVerified: user.is_email_verified ?? user.isEmailVerified ?? false,
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
  } = useGetProfileQuery(undefined, { skip: !token });

  // Hydrate token
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) setToken(savedToken);
    setAuthReady(true);
  }, []);

  // Hydrate user from profile
  useEffect(() => {
    if (profileData?.user) {
      setUser(normalizeUser(profileData.user));
    }
  }, [profileData]);

  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res.access_token || res.accessToken;
    if (!accessToken) throw new Error("No access token received");

    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);

    // Use normalized user
    const normalized = normalizeUser(res.user);
    if (normalized) setUser(normalized);

    return { ...res, user: normalized };
  };

  const register = async (data) => {
    return await registerMutation(data).unwrap();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const refreshUser = async () => {
    if (token) {
      const res = await refetchProfile();
      if (res?.data?.user) {
        setUser(normalizeUser(res.data.user));
      }
    }
  };

  const isUserActive = () => {
    if (!user) return false;
    return user.is_active === true || user.isActive === true;
  };

  const isEmailVerified = () => {
    if (!user) return false;
    return user.is_email_verified === true || user.isEmailVerified === true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userMeta: user,

        login,
        register,
        logout,
        refreshUser,

        isAuthenticated: Boolean(token),
        isActive: isUserActive(),
        isEmailVerified: isEmailVerified(),
        isLoading: !authReady || profileLoading,

        hasRole: (roleName) => user?.role === roleName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
