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
  useLogoutMutation,
} from "@/api/authApi";

const AuthContext = createContext(null);

// ======================================================
// USER NORMALIZER
// Backend now returns consistent format
// ======================================================
const normalizeUser = (user) => {
  if (!user) return null;

  // Handle nested role object from backend
  let role = user.role;
  if (role && typeof role === "object") {
    role = role?.name || role?.display_name || null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,

    role: typeof role === "string" ? role : null,

    is_active: Boolean(user.is_active),
    is_email_verified: Boolean(user.is_email_verified),

    // Backward compatibility
    isActive: Boolean(user.is_active),
    isEmailVerified: Boolean(user.is_email_verified),

    last_login: user.last_login || null,
    created_at: user.created_at || null,
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
  const [logoutMutation] = useLogoutMutation();

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
    } catch (error) {
      console.error("Failed to read token from localStorage:", error);
    } finally {
      setAuthInitialized(true);
    }
  }, []);

  // ====================================================
  // PROFILE QUERY
  // Skip until we have a token AND bootstrap is complete
  // CRITICAL: refetchOnMountOrArgChange ensures profile
  // is re-verified on EVERY route change
  // ====================================================
  const {
    data: profileData,
    error: profileError,
    isFetching: profileFetching,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: !authInitialized || !token,

    // Re-verify on mount or when auth changes
    refetchOnMountOrArgChange: true,

    // Don't refetch on focus/reconnect (backend does validation)
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // ====================================================
  // SYNC PROFILE TO STATE
  // Backend validates token on every request
  // We just handle the response/error
  // ====================================================
  useEffect(() => {
    // Wait for token bootstrap
    if (!authInitialized) return;

    // No token = not authenticated
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
      const normalized = normalizeUser(profileData.user);
      setUser(normalized);
      setAuthResolved(true);
      return;
    }

    // Profile fetch failed (401, 403, etc.)
    if (profileError) {
      console.error("Profile fetch error:", profileError);

      // Clear stale token from storage
      localStorage.removeItem("access_token");

      // Clear from cookies
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Reset auth state
      setToken(null);
      setUser(null);
      setAuthResolved(true);
      return;
    }

    // Loading state - don't mark as resolved yet
  }, [authInitialized, token, profileData, profileError, profileFetching]);

  // ====================================================
  // LOGIN
  // Authenticates user and sets token
  // ====================================================
  const login = async (credentials) => {
    try {
      // Reset auth state
      setAuthResolved(false);

      const res = await loginMutation(credentials).unwrap();

      const accessToken = res?.access_token;

      if (!accessToken) {
        throw new Error("No access token received");
      }

      // Persist token to localStorage
      localStorage.setItem("access_token", accessToken);

      // Persist token to cookies (server will set httpOnly cookie)
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
    } catch (error) {
      // Reset state on error
      localStorage.removeItem("access_token");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setToken(null);
      setUser(null);
      setAuthResolved(true);

      throw error;
    }
  };

  // ====================================================
  // REGISTER
  // ====================================================
  const register = async (data) => {
    return await registerMutation(data).unwrap();
  };

  // ====================================================
  // LOGOUT
  // Calls backend logout and clears local state
  // ====================================================
  const logout = useCallback(async () => {
    try {
      // Call backend logout (optional, for cleanup)
      await logoutMutation({}).unwrap();
    } catch (error) {
      // Continue logout even if backend call fails
      console.error("Logout API error:", error);
    } finally {
      // Clear from localStorage
      localStorage.removeItem("access_token");

      // Clear from cookies
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Reset state
      setToken(null);
      setUser(null);
      setAuthResolved(true);
    }
  }, [logoutMutation]);

  // ====================================================
  // REFRESH USER
  // Re-fetches profile from server
  // Use after user data changes
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
    } catch (error) {
      console.error("Failed to refresh user:", error);
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
