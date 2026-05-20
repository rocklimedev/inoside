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
 * Handles both plain objects and Sequelize nested models
 */
const normalizeUser = (user) => {
  if (!user) return null;

  // Handle Sequelize model (has dataValues)
  const rawUser = user?.dataValues || user;

  // Safely extract role (it can be string, object, or nested dataValues)
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
    role: typeof role === "string" ? role : null, // Always string or null

    // Critical fields
    is_active: Boolean(rawUser.is_active),
    is_email_verified: Boolean(rawUser.is_email_verified),

    // Backward compatibility
    isActive: Boolean(rawUser.is_active),
    isEmailVerified: Boolean(rawUser.is_email_verified),

    last_login: rawUser.last_login,
    created_at: rawUser.created_at,
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
    refetchOnMountOrArgChange: true,
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

  // Optional: Remove console.log in production
  // console.log(user);

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
        hasRole: (roleName) =>
          user?.role?.toLowerCase() === roleName?.toLowerCase(),
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
