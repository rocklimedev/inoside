"use client";

import { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginUserMutation, useGetProfileQuery } from "../api/authApi";
import { setCredentials, logout } from "../api/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [loginUser] = useLoginUserMutation();
  const { data, error } = useGetProfileQuery(undefined, { skip: !token });

  // Auto-fetch profile when token exists
  useEffect(() => {
    if (data && !user) {
      dispatch(setCredentials({ user: data, token }));
    }
    if (error && error.status === 401) {
      dispatch(logout());
    }
  }, [data, error, user, token, dispatch]);

  // Login Function
  const login = async (email, password, role) => {
    const res = await loginUser({ email, password }).unwrap();

    // You can pass role if your backend supports it, or handle it client-side
    dispatch(
      setCredentials({
        user: { ...res.user, role },
        token: res.token,
      }),
    );

    return { ...res.user, role };
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
