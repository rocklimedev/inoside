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
// PUBLIC PATH MATCHER
// These paths render without DashboardLayout and without
// requiring authentication.
// ======================================================
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/no-access",
  "/not-found",
  "/404",
];

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

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

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = isRootPath(pathname);
  // Any page that doesn't need the auth gate
  const skipAuthGate = onPublicPage || onRootPage;

  // Redirect unauthenticated users away from protected pages
  useEffect(() => {
    if (isLoading) return; // wait until auth resolves
    if (skipAuthGate) return; // public or root — no guard needed
    if (!isAuthenticated) {
      appLog("Not authenticated → /login");
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, skipAuthGate, router]);

  appLog("APP STATE", {
    pathname,
    onPublicPage,
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

  // ── Public / root pages ───────────────────────────────
  if (skipAuthGate) {
    appLog("Rendering public/root page:", pathname);
    return <>{children}</>;
  }

  // ── Not authenticated — spinner while redirect fires ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#ef7f1b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Authenticated protected page ──────────────────────
  appLog("Rendering protected page:", pathname, "| role:", user?.role);
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
