// app/providers.tsx
"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

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

function AppContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authInitialized, authResolved, isAuthenticated, user } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = pathname === "/";

  // ============================================
  // HANDLE ROOT PAGE REDIRECT
  // ============================================
  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    // Only redirect if on root page
    if (!onRootPage) return;

    // Not authenticated → Login
    if (!isAuthenticated) {
      console.log("[PROVIDERS] Root redirect to login");
      router.replace("/login");
      return;
    }

    // Wait for user role
    if (!user?.role) {
      console.log("[PROVIDERS] Waiting for user role");
      return;
    }

    // Authenticated → Redirect to dashboard
    console.log("[PROVIDERS] Root redirect to dashboard:", user.role);

    const roleRoutes = {
      architect: "/dashboard/architect",
      client: "/dashboard/client",
      builder: "/dashboard/builder",
      site_supervisor: "/dashboard/site-supervisor",
      team_member: "/dashboard/team",
      admin: "/dashboard/admin",
      super_admin: "/dashboard/admin",
    };

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

  // ============================================
  // PROTECTED ROUTE GUARD (NOT for root)
  // ============================================
  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    // Skip root and public pages
    if (onRootPage || onPublicPage) return;

    // Protect all other routes
    if (!isAuthenticated) {
      console.log("[PROVIDERS] Redirecting to login from protected route");
      router.replace("/login");
    }
  }, [
    authInitialized,
    authResolved,
    isAuthenticated,
    onRootPage,
    onPublicPage,
    router,
  ]);

  // ============================================
  // BOOTSTRAP
  // ============================================
  if (!authInitialized) {
    return <FullScreenLoader text="Initializing application..." />;
  }

  // ============================================
  // PUBLIC ROUTES
  // ============================================
  if (onPublicPage) {
    return <>{children}</>;
  }

  // ============================================
  // ROOT PAGE - Show loader while redirecting
  // ============================================
  if (onRootPage) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ============================================
  // PROTECTED ROUTES - Wait for full resolution
  // ============================================
  if (!authResolved) {
    return <FullScreenLoader text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ============================================
  // AUTHENTICATED APP
  // ============================================
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <AppContent>{children}</AppContent>
      </AuthProvider>
    </ReduxProvider>
  );
}
