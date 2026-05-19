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
  const [isLoading, setIsLoading] = useState(true); // ← Critical for production

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
    setIsLoading(false); // Important: Mark loading as done
  }, []);

  // Update user when profile data comes back
  useEffect(() => {
    if (profileData?.user) {
      setUser(profileData.user);
    }
  }, [profileData]);

  const login = async (credentials) => {
    try {
      const res = await loginMutation(credentials).unwrap();

      const accessToken = res.access_token || res.token;

      // Save to localStorage and state
      localStorage.setItem("access_token", accessToken);
      setToken(accessToken);

      // Set user if available in login response
      if (res.user) {
        setUser(res.user);
      }

      return res;
    } catch (err) {
      console.error("Login error:", err);
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
    isLoading,
    profileLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
