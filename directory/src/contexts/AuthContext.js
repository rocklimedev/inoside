"use client";

import { createContext, useContext, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useLoginUserMutation, useGetProfileQuery } from "@/api/authApi";

import { setCredentials, logout as logoutAction } from "@/api/authSlice";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  const [loginUser] = useLoginUserMutation();

  const { data, error } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  // Auto fetch profile
  useEffect(() => {
    if (data && token) {
      dispatch(
        setCredentials({
          user: data,
          token,
        }),
      );
    }

    // Auto logout on invalid token
    if (error?.status === 401) {
      dispatch(logoutAction());
    }
  }, [data, error, token, dispatch]);

  // LOGIN
  const login = async (email, password, role) => {
    const res = await loginUser({
      email,
      password,
    }).unwrap();

    dispatch(
      setCredentials({
        user: {
          ...res.user,
          role,
        },
        token: res.token,
      }),
    );

    return {
      ...res.user,
      role,
    };
  };

  // LOGOUT
  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
