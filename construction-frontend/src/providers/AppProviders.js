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
// Add this to your roleRoutes map (same as before)
const roleRoutes = {
  architect: "/dashboard/architect",
  client: "/dashboard/client",
  builder: "/dashboard/builder",
  site_supervisor: "/dashboard/site-supervisor",
  team_member: "/dashboard/team",
  admin: "/dashboard/admin",
  super_admin: "/dashboard/admin",
};

function AppContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authInitialized, isAuthenticated, user } = useAuth();

  const onPublicPage = isPublicPath(pathname);
  const onRootPage = isRootPath(pathname);
  const skipAuthGate = onPublicPage || onRootPage;

  useEffect(() => {
    if (!authInitialized) return;

    // ✅ Handle root redirect here — not in Home
    if (onRootPage) {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      if (user?.role) {
        const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();
        router.replace(roleRoutes[roleKey] || "/dashboard");
      }
      return; // wait for user.role to hydrate if not ready yet
    }

    if (skipAuthGate) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [
    authInitialized,
    isAuthenticated,
    user?.role,
    onRootPage,
    skipAuthGate,
    router,
  ]);

  if (!authInitialized) return <FullScreenLoader />;
  if (skipAuthGate) return <>{children}</>;
  if (!isAuthenticated) return <FullScreenLoader text="Redirecting..." />;

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
