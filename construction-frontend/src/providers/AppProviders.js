"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import ReduxProvider from "./ReduxProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

// ======================================================
// DEBUG LOGGER
// ======================================================

const APP_DEBUG = process.env.NODE_ENV === "development";

const appLog = (...args) => {
  if (APP_DEBUG) {
    console.log("%c[APP]", "color:#3b82f6;font-weight:bold;", ...args);
  }
};

const appWarn = (...args) => {
  if (APP_DEBUG) {
    console.warn("%c[APP WARNING]", "color:#f59e0b;font-weight:bold;", ...args);
  }
};

// ======================================================
// INNER APP CONTENT
// ======================================================

function AppContent({ children, pathname }) {
  const { isLoading, isAuthenticated, user, token, isActive, isEmailVerified } =
    useAuth();

  // ======================================================
  // ROUTE FLAGS
  // ======================================================

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/404") ||
    pathname.startsWith("/no-access") ||
    pathname === "/not-found";

  // ======================================================
  // GLOBAL APP LOGGER (Optimized)
  // ======================================================

  useEffect(() => {
    appLog("APP STATE UPDATE", {
      pathname,
      isAuthPage,
      isLoading,
      isAuthenticated,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
      role: user?.role,
      email: user?.email,
      isActive,
      isEmailVerified,
    });
  }, [
    pathname,
    isAuthPage,
    isLoading,
    isAuthenticated,
    token,
    user?.role, // ← Changed from `user` to `user?.role`
    isActive,
    isEmailVerified,
  ]);

  // ======================================================
  // PAGE TYPE LOGGER
  // ======================================================

  useEffect(() => {
    if (isAuthPage) {
      appLog("AUTH PAGE DETECTED:", pathname);
    } else {
      appLog("PROTECTED PAGE DETECTED:", pathname);
    }
  }, [pathname, isAuthPage]);

  // ======================================================
  // LOADING SCREEN
  // ======================================================

  if (isLoading) {
    appWarn("Application waiting for auth hydration...", {
      pathname,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#ef7f1b] border-t-transparent rounded-full animate-spin" />

          <p className="text-sm text-muted-foreground">
            Initializing application...
          </p>

          {/* DEBUG PANEL */}
          <div className="mt-4 text-xs text-gray-500 space-y-1 text-center">
            <p>Path: {pathname}</p>
            <p>Loading: {String(isLoading)}</p>
            <p>Authenticated: {String(isAuthenticated)}</p>
            <p>Token: {token ? "YES" : "NO"}</p>
            <p>User: {user ? "YES" : "NO"}</p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // AUTH PAGES (No Dashboard Layout)
  // ======================================================

  if (isAuthPage) {
    appLog("Rendering AUTH PAGE without DashboardLayout");
    return children;
  }

  // ======================================================
  // PROTECTED PAGES
  // ======================================================

  appLog("Rendering PROTECTED PAGE with DashboardLayout", {
    role: user?.role,
    user: user?.email,
  });

  return <DashboardLayout>{children}</DashboardLayout>;
}

// ======================================================
// MAIN PROVIDER
// ======================================================

export default function AppProviders({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    appLog("AppProviders mounted");
    appLog("Current pathname:", pathname);
  }, [pathname]);

  return (
    <ReduxProvider>
      <AuthProvider>
        <AppContent pathname={pathname}>{children}</AppContent>
      </AuthProvider>
    </ReduxProvider>
  );
}
