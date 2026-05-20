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

  const { authInitialized, authResolved, isAuthenticated } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = pathname === "/";

  // ============================================
  // ROOT PAGE REDIRECT (NO ROLE CHECK)
  // ============================================
  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    if (!onRootPage) return;

    if (!isAuthenticated) {
      console.log("[PROVIDERS] Root redirect → login");
      router.replace("/login");
      return;
    }

    console.log("[PROVIDERS] Root redirect → dashboard");
    router.replace("/dashboard");
  }, [authInitialized, authResolved, isAuthenticated, onRootPage, router]);

  // ============================================
  // PROTECTED ROUTE GUARD
  // ============================================
  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    // Skip public pages + root
    if (onPublicPage || onRootPage) return;

    // Protect everything else
    if (!isAuthenticated) {
      console.log("[PROVIDERS] Redirecting to login");
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
  // ROOT PAGE
  // ============================================
  if (onRootPage) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ============================================
  // WAIT FOR AUTH RESOLUTION
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
