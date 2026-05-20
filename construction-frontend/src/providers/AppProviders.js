"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import ReduxProvider from "./ReduxProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

// ======================================================
// PUBLIC PATHS
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

// ======================================================
// ROLE ROUTES
// ======================================================
const roleRoutes = {
  architect: "/dashboard/architect",
  client: "/dashboard/client",
  builder: "/dashboard/builder",
  site_supervisor: "/dashboard/site-supervisor",
  team_member: "/dashboard/team",
  admin: "/dashboard/admin",
  super_admin: "/dashboard/admin",
};

// ======================================================
// LOADER
// ======================================================
function FullScreenLoader({ text = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#ef7f1b] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

// ======================================================
// APP CONTENT
// Inner component that uses useAuth hook
// ======================================================
function AppContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { authInitialized, authResolved, isAuthenticated, user } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = pathname === "/";

  // ====================================================
  // ROOT ROUTE REDIRECT
  // Only handles "/" path
  // ====================================================
  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    // Only on root page
    if (!onRootPage) return;

    // Not authenticated → Go to login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Wait for role
    if (!user?.role) return;

    // Redirect to role dashboard
    const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();
    router.replace(roleRoutes[roleKey] || "/dashboard");
  }, [
    authInitialized,
    authResolved,
    isAuthenticated,
    user?.role,
    onRootPage,
    router,
  ]);

  // ====================================================
  // PROTECTED ROUTE REDIRECT
  // Guards access to non-public routes
  // ====================================================
  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    // Skip public routes
    if (onPublicPage || onRootPage) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [
    authInitialized,
    authResolved,
    isAuthenticated,
    onPublicPage,
    onRootPage,
    router,
  ]);

  // ====================================================
  // INITIAL BOOTSTRAP
  // ====================================================
  if (!authInitialized) {
    return <FullScreenLoader text="Initializing application..." />;
  }

  // ====================================================
  // ROOT ROUTE REDIRECT
  // Never render children on "/"
  // ====================================================
  if (onRootPage) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ====================================================
  // PUBLIC ROUTES
  // No auth required
  // ====================================================
  if (onPublicPage) {
    return <>{children}</>;
  }

  // ====================================================
  // PROTECTED ROUTES
  // Wait for full auth resolution
  // ====================================================
  if (!authResolved) {
    return <FullScreenLoader text="Verifying authentication..." />;
  }

  // Not authenticated (redirect will happen in effect)
  if (!isAuthenticated) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ====================================================
  // AUTHENTICATED APP
  // Render dashboard with layout
  // ====================================================
  return <DashboardLayout>{children}</DashboardLayout>;
}

// ======================================================
// MAIN PROVIDER
// Wraps Redux and Auth providers
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
