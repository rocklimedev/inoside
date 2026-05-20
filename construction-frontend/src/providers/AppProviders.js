"use client";

import { useEffect } from "react";
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

function isRootPath(pathname) {
  return pathname === "/";
}

// ======================================================
// LOADER
// ======================================================
function FullScreenLoader({ text = "Initializing application..." }) {
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
// INNER APP CONTENT
// ======================================================
function AppContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { authInitialized, isAuthenticated } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = isRootPath(pathname);

  // Public routes don't require auth
  const skipAuthGate = onPublicPage || onRootPage;

  // ====================================================
  // AUTH GUARD
  // ====================================================
  useEffect(() => {
    // Wait ONLY for initial auth bootstrap
    if (!authInitialized) return;

    // Public routes bypass auth
    if (skipAuthGate) return;

    // Redirect unauthenticated users
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [authInitialized, isAuthenticated, skipAuthGate, router]);

  // ====================================================
  // INITIAL APP BOOTSTRAP
  // ====================================================
  if (!authInitialized) {
    return <FullScreenLoader />;
  }

  // ====================================================
  // PUBLIC / ROOT ROUTES
  // ====================================================
  if (skipAuthGate) {
    return <>{children}</>;
  }

  // ====================================================
  // REDIRECT STATE
  // ====================================================
  if (authInitialized && !isAuthenticated) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ====================================================
  // AUTHENTICATED APP
  // ====================================================
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
