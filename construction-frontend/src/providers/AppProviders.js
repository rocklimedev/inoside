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

  // Debug log
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
          <p className="text-sm text-muted-foreground">
            Initializing application...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    appLog("Rendering AUTH PAGE");
    return <>{children}</>;
  }

  // PROTECTED PAGES (including dynamic routes)
  appLog("Rendering PROTECTED PAGE with DashboardLayout", {
    pathname,
    role: user?.role,
  });

  return <DashboardLayout>{children}</DashboardLayout>;
}

// ======================================================
// MAIN PROVIDER
// ======================================================

export default function AppProviders({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    appLog("AppProviders mounted →", pathname);
  }, [pathname]);

  return (
    <ReduxProvider>
      <AuthProvider>
        <AppContent pathname={pathname}>{children}</AppContent>
      </AuthProvider>
    </ReduxProvider>
  );
}
