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

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (profileData?.user) {
      setUser(profileData.user);
    }
  }, [profileData]);

  const login = async (credentials) => {
    try {
      const res = await loginMutation(credentials).unwrap();

      const accessToken = res.access_token;

      setToken(accessToken);
      localStorage.setItem("access_token", accessToken);

      setUser(res.user);

      return res;
    } catch (err) {
      throw err?.data?.message || "Login failed";
    }
  };

  const register = async (data) => {
    try {
      const res = await registerMutation(data).unwrap();
      return res;
    } catch (err) {
      throw err?.data?.message || "Registration failed";
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

  const value = {
    token,
    user,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!token,
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
