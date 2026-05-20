// app/providers.tsx
"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

const PUBLIC_PATHS = [
  "/",
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
  const { authInitialized, authResolved, isAuthenticated } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = pathname === "/";

  // ============================================
  // PROTECTED ROUTE GUARD (NOT root)
  // ============================================
  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    // Root page handles its own redirect
    if (onRootPage) return;

    // Public pages don't need auth
    if (onPublicPage) return;

    // Protected routes require auth
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
  // INITIAL BOOTSTRAP
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
