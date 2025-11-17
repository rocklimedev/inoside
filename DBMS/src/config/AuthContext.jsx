// src/context/AuthContext.js
import { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetProfileQuery } from "../api/authApi";
import { setCredentials, logout } from "../api/authSlice";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  const { data, error } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data && !user) {
      dispatch(setCredentials({ user: data, token }));
    }
    if (error && error.status === 401) {
      dispatch(logout());
    }
  }, [data, error, user, token, dispatch]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
