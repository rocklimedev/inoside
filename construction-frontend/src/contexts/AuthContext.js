"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} from "@/api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileLoading,
  } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Update user when profile is fetched
  useEffect(() => {
    if (profileData?.user) {
      setUser(profileData.user);
    }
  }, [profileData]);

  const login = async (credentials) => {
    try {
      const res = await loginMutation(credentials).unwrap();

      const accessToken = res.access_token;

      // Save token
      setToken(accessToken);
      localStorage.setItem("access_token", accessToken);

      // Set user immediately from login response
      const loggedInUser = res.user || profileData?.user;
      setUser(loggedInUser);

      return res;
    } catch (err) {
      throw err?.data?.message || err?.data?.detail || "Login failed";
    }
  };

  const register = async (data) => {
    try {
      const res = await registerMutation(data).unwrap();
      return res;
    } catch (err) {
      throw err?.data?.message || err?.data?.detail || "Registration failed";
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const refreshUser = async () => {
    if (token) {
      await refetchProfile();
    }
  };

  // Helper to check if user is active
  const isUserActive = () => {
    if (!user) return false;
    return user.is_active === true || user.isActive === true;
  };

  const value = {
    token,
    user,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!token && !!user,
    isActive: isUserActive(),
    profileLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
