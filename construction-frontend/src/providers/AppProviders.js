"use client";

import { usePathname } from "next/navigation";

import ReduxProvider from "./ReduxProvider";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import DashboardLayout from "@/components/DashboardLayout";

// ======================================================
// INNER APP CONTENT
// ======================================================

function AppContent({ children, pathname }) {
  const { isLoading } = useAuth();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/404") ||
    pathname.startsWith("/no-access") ||
    pathname === "/not-found";

  /**
   * IMPORTANT:
   * Prevent layout rendering before auth hydration finishes
   *
   * This fixes production redirect/logout flicker
   */
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

  /**
   * Auth pages should NOT use dashboard layout
   */
  if (isAuthPage) {
    return children;
  }

  /**
   * Protected pages
   */
  return <DashboardLayout>{children}</DashboardLayout>;
}

// ======================================================
// MAIN PROVIDER
// ======================================================

export default function AppProviders({ children }) {
  const pathname = usePathname();

  return (
    <ReduxProvider>
      <AuthProvider>
        <AppContent pathname={pathname}>{children}</AppContent>
      </AuthProvider>
    </ReduxProvider>
  );
}
