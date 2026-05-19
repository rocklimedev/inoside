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
  const [authReady, setAuthReady] = useState(false);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileLoading,
  } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  // hydrate token
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) setToken(savedToken);
    setAuthReady(true);
  }, []);

  // hydrate user
  useEffect(() => {
    if (profileData?.user) {
      setUser(profileData.user);
    }
  }, [profileData?.user]);

  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res.access_token || res.token;

    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);

    if (res.user) {
      setUser(res.user);
    }

    return res;
  };

  const register = async (data) => {
    const res = await registerMutation(data).unwrap();
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const refreshUser = async () => {
    if (token) await refetchProfile();
  };

  const isUserActive = () => {
    if (!user) return false;
    return user.is_active === true || user.isActive === true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        refreshUser,

        // IMPORTANT FIX
        isAuthenticated: !!token,

        isActive: isUserActive(),
        isLoading: !authReady,
        profileLoading,
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
