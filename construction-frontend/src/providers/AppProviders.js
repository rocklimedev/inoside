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

  const { authInitialized, isAuthenticated, user } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = pathname === "/";

  // ====================================================
  // AUTH / ROOT REDIRECTS
  // ====================================================
  useEffect(() => {
    if (!authInitialized) return;

    // ROOT ROUTE
    if (onRootPage) {
      // Not logged in
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      // Wait for user hydration
      if (!user?.role) return;

      const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();

      router.replace(roleRoutes[roleKey] || "/dashboard");

      return;
    }

    // PUBLIC ROUTES
    if (onPublicPage) return;

    // PROTECTED ROUTES
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [
    authInitialized,
    isAuthenticated,
    user?.role,
    onRootPage,
    onPublicPage,
    router,
  ]);

  // ====================================================
  // INITIAL BOOTSTRAP
  // ====================================================
  if (!authInitialized) {
    return <FullScreenLoader text="Initializing application..." />;
  }

  // ====================================================
  // ROOT ROUTE
  // IMPORTANT:
  // Never render children on "/"
  // because this page only exists to redirect
  // ====================================================
  if (onRootPage) {
    return <FullScreenLoader text="Redirecting..." />;
  }

  // ====================================================
  // PUBLIC ROUTES
  // ====================================================
  if (onPublicPage) {
    return <>{children}</>;
  }

  // ====================================================
  // PROTECTED ROUTES
  // ====================================================
  if (!isAuthenticated) {
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
