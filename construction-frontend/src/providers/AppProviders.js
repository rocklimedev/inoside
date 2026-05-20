"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import ReduxProvider from "./ReduxProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

// ======================================================
// DEBUG LOGGER
// ======================================================
const APP_DEBUG = process.env.NODE_ENV === "development";
const appLog = (...args) =>
  APP_DEBUG &&
  console.log("%c[APP]", "color:#3b82f6;font-weight:bold;", ...args);

// ======================================================
// AUTH PAGE MATCHER
// Paths that should render WITHOUT DashboardLayout and
// WITHOUT requiring authentication.
// ======================================================
const AUTH_PATHS = ["/login", "/register", "/no-access", "/not-found", "/404"];

function isAuthPath(pathname) {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Root "/" is handled by the Home page component itself (redirects based on role)
function isRootPath(pathname) {
  return pathname === "/";
}

// ======================================================
// INNER APP CONTENT
// ======================================================
function AppContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();

  const onAuthPage = isAuthPath(pathname);
  const onRootPage = isRootPath(pathname);

  // Redirect unauthenticated users away from protected pages
  useEffect(() => {
    if (isLoading) return; // wait until auth resolves
    if (onAuthPage || onRootPage) return; // don't redirect on public pages
    if (!isAuthenticated) {
      appLog("Not authenticated on protected route — redirecting to /login");
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, onAuthPage, onRootPage, router]);

  appLog("APP STATE", {
    pathname,
    onAuthPage,
    isLoading,
    isAuthenticated,
    role: user?.role,
  });

  // ── Full-screen loader while auth resolves ───────────
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

  // ── Public pages (login, register, etc.) ─────────────
  if (onAuthPage || onRootPage) {
    appLog("Rendering public page:", pathname);
    return <>{children}</>;
  }

  // ── Not authenticated on a protected page ────────────
  // Render nothing while the redirect (above useEffect) fires.
  // This prevents protected page components from mounting with no user,
  // which is the root cause of crashes on dynamic routes.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#ef7f1b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Authenticated protected page ──────────────────────
  appLog("Rendering protected page:", pathname, "role:", user?.role);
  return <DashboardLayout>{children}</DashboardLayout>;
}

// ======================================================
// MAIN PROVIDER
// ======================================================
export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <AppContent>{children}</AppContent>
      </AuthProvider>
    </ReduxProvider>
  );
}
