"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} from "@/api/authApi";

const AuthContext = createContext(null);

// ======================================================
// USER NORMALIZER
// Handles both snake_case (backend) and camelCase formats
// ======================================================
const normalizeUser = (user) => {
  if (!user) return null;

  const rawUser = user?.dataValues || user;

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

    role: typeof role === "string" ? role : null,

    is_active: Boolean(rawUser.is_active),
    is_email_verified: Boolean(rawUser.is_email_verified),

    // backward compatibility
    isActive: Boolean(rawUser.is_active),
    isEmailVerified: Boolean(rawUser.is_email_verified),

    last_login: rawUser.last_login,
    created_at: rawUser.created_at,
  };
};

// ======================================================
// PROVIDER
// ======================================================
export const AuthProvider = ({ children }) => {
  // ====================================================
  // STATE
  // ====================================================
  const [token, setToken] = useState(null);

  const [user, setUser] = useState(null);

  // localStorage bootstrap completed
  const [authInitialized, setAuthInitialized] = useState(false);

  // auth fully resolved (profile fetch complete)
  const [authResolved, setAuthResolved] = useState(false);

  // ====================================================
  // MUTATIONS
  // ====================================================
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  // ====================================================
  // BOOTSTRAP TOKEN FROM LOCALSTORAGE
  // Runs once on mount to hydrate token
  // ====================================================
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("access_token");

      if (storedToken) {
        setToken(storedToken);
      }
    } finally {
      // Mark bootstrap as complete regardless of token presence
      setAuthInitialized(true);
    }
  }, []);

  // ====================================================
  // PROFILE QUERY
  // Refetch on route changes when token is present
  // CRITICAL: refetchOnMountOrArgChange ensures profile
  // is re-verified when navigating to new routes
  // ====================================================
  const {
    data: profileData,
    error: profileError,
    isFetching: profileFetching,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: !authInitialized || !token,

    // Re-verify profile when token changes
    refetchOnMountOrArgChange: true,

    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // ====================================================
  // SYNC PROFILE TO STATE
  // Handles: success, errors, and stale tokens
  // ====================================================
  useEffect(() => {
    // Wait for token bootstrap
    if (!authInitialized) return;

    // No token available
    if (!token) {
      setUser(null);
      setAuthResolved(true);
      return;
    }

    // Profile fetch still in progress
    if (profileFetching) {
      return;
    }

    // Profile fetch successful
    if (profileData?.user) {
      setUser(normalizeUser(profileData.user));
      setAuthResolved(true);
      return;
    }

    // Profile fetch failed (invalid token, server error, etc.)
    if (profileError) {
      // Clear stale token from storage
      localStorage.removeItem("access_token");

      // Clear token from cookies
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Reset auth state
      setToken(null);
      setUser(null);
      setAuthResolved(true);
      return;
    }

    // No data and no error = still loading
    // Keep authResolved as false until we get a definitive response
  }, [authInitialized, token, profileData, profileError, profileFetching]);

  // ====================================================
  // LOGIN
  // Authenticates user and fetches profile
  // ====================================================
  const login = async (credentials) => {
    const res = await loginMutation(credentials).unwrap();

    const accessToken = res?.access_token;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Reset auth state to wait for profile fetch
    setAuthResolved(false);

    // Persist token to localStorage
    localStorage.setItem("access_token", accessToken);

    // Persist token to cookies for server-side access
    document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

    // Update token in state
    setToken(accessToken);

    // Backend returned user directly in login response
    if (res?.user) {
      const normalized = normalizeUser(res.user);

      setUser(normalized);
      setAuthResolved(true);

      return {
        ...res,
        user: normalized,
      };
    }

    // Fallback: Fetch profile if not included in login response
    const profileRes = await refetchProfile();

    if (profileRes?.data?.user) {
      const normalized = normalizeUser(profileRes.data.user);

      setUser(normalized);
      setAuthResolved(true);

      return {
        ...res,
        user: normalized,
      };
    }

    throw new Error("Failed to fetch authenticated user");
  };

  // ====================================================
  // REGISTER
  // ====================================================
  const register = async (data) => {
    return await registerMutation(data).unwrap();
  };

  // ====================================================
  // LOGOUT
  // Clears token and user from state and storage
  // ====================================================
  const logout = useCallback(() => {
    // Clear from localStorage
    localStorage.removeItem("access_token");

    // Clear from cookies
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Reset state
    setToken(null);
    setUser(null);
    setAuthResolved(true);
  }, []);

  // ====================================================
  // REFRESH USER
  // Re-fetches profile from server
  // Useful for updating user data after changes
  // ====================================================
  const refreshUser = useCallback(async () => {
    if (!token) return null;

    try {
      const res = await refetchProfile();

      if (res?.data?.user) {
        const normalized = normalizeUser(res.data.user);

        setUser(normalized);

        return normalized;
      }

      return null;
    } catch {
      return null;
    }
  }, [token, refetchProfile]);

  // ====================================================
  // DERIVED STATE
  // ====================================================
  const isAuthenticated = Boolean(user);

  // Loading while bootstrap or profile fetch in progress
  const isLoading = !authInitialized || !authResolved;

  const isActive = useMemo(
    () => Boolean(user?.is_active ?? user?.isActive),
    [user],
  );

  const isEmailVerified = useMemo(
    () => Boolean(user?.is_email_verified ?? user?.isEmailVerified),
    [user],
  );

  // ====================================================
  // CONTEXT VALUE
  // ====================================================
  const value = {
    // Auth data
    token,
    user,
    userMeta: user,

    // Auth methods
    login,
    register,
    logout,
    refreshUser,

    // Auth state flags
    authInitialized,
    authResolved,

    // Derived state
    isAuthenticated,
    isLoading,

    // Profile query state
    profileFetching,

    // User properties
    isActive,
    isEmailVerified,

    // Role checking utility
    hasRole: (roleName) =>
      user?.role?.toLowerCase() === roleName?.toLowerCase(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ======================================================
// HOOK
// ======================================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
