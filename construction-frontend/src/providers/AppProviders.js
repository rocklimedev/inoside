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
// ======================================================
function AppContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { authInitialized, authResolved, isAuthenticated, user } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = pathname === "/";

  // ====================================================
  // AUTH / ROOT REDIRECTS
  // CRITICAL: Include authResolved in dependencies
  // to prevent redirects before auth state is ready
  // ====================================================
  useEffect(() => {
    // Wait for bootstrap from localStorage
    if (!authInitialized) return;

    // Wait for auth to fully resolve (profile fetch complete)
    if (!authResolved) return;

    // ROOT ROUTE - Redirect to role-based dashboard
    if (onRootPage) {
      // Not logged in
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      // Wait for user role to be available
      if (!user?.role) return;

      const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();

      router.replace(roleRoutes[roleKey] || "/dashboard");

      return;
    }

    // PUBLIC ROUTES - No redirect needed
    if (onPublicPage) return;

    // PROTECTED ROUTES - Redirect unauthenticated users to login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
  }, [
    authInitialized,
    authResolved, // CRITICAL: Added this dependency
    isAuthenticated,
    user?.role,
    onRootPage,
    onPublicPage,
    router,
  ]);

  // ====================================================
  // INITIAL BOOTSTRAP
  // Bootstrap from localStorage
  // ====================================================
  if (!authInitialized) {
    return <FullScreenLoader text="Initializing application..." />;
  }

  // ====================================================
  // AUTH RESOLUTION IN PROGRESS
  // Waiting for profile query to complete
  // CRITICAL: Block rendering until auth is fully resolved
  // to prevent premature redirects on route changes
  // ====================================================
  if (!authResolved) {
    return <FullScreenLoader text="Verifying authentication..." />;
  }

  // ====================================================
  // ROOT ROUTE
  // IMPORTANT: Never render children on "/"
  // because this page only exists to redirect
  // ====================================================
  if (onRootPage) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ====================================================
  // PUBLIC ROUTES (login, register, etc.)
  // ====================================================
  if (onPublicPage) {
    return <>{children}</>;
  }

  // ====================================================
  // PROTECTED ROUTES - User not authenticated
  // Redirect to login
  // ====================================================
  if (!isAuthenticated) {
    return <FullScreenLoader text="Redirecting to login..." />;
  }

  // ====================================================
  // AUTHENTICATED APP
  // Render dashboard with layout for all protected routes
  // including dynamic routes like /dashboard/projects/[uuid]
  // ====================================================
  return <DashboardLayout>{children}</DashboardLayout>;
}

// ======================================================
// MAIN PROVIDER
// Wraps entire app with Redux and Auth providers
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
