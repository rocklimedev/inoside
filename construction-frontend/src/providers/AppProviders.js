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
  const { isLoading, isAuthenticated, user } = useAuth();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/404") ||
    pathname.startsWith("/no-access") ||
    pathname === "/not-found";

  // GLOBAL LOGGER (keep only important deps)
  useEffect(() => {
    appLog("APP STATE UPDATE", {
      pathname,
      isAuthPage,
      isLoading,
      isAuthenticated,
      role: user?.role,
    });
  }, [pathname, isAuthPage, isLoading, isAuthenticated, user?.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#ef7f1b] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  // For all protected pages, just wrap with DashboardLayout
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
