"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

// ======================================================
// DEBUG LOGGER
// ======================================================

const HOME_DEBUG = true;

const homeLog = (...args) => {
  if (HOME_DEBUG) {
    console.log("%c[HOME]", "color:#8b5cf6;font-weight:bold;", ...args);
  }
};

const homeWarn = (...args) => {
  if (HOME_DEBUG) {
    console.warn(
      "%c[HOME WARNING]",
      "color:#f59e0b;font-weight:bold;",
      ...args,
    );
  }
};

const homeError = (...args) => {
  if (HOME_DEBUG) {
    console.error("%c[HOME ERROR]", "color:#ef4444;font-weight:bold;", ...args);
  }
};

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

export default function Home() {
  const router = useRouter();

  const { user, token, isAuthenticated, isLoading, isActive, isEmailVerified } =
    useAuth();

  // ======================================================
  // INITIAL MOUNT
  // ======================================================

  useEffect(() => {
    homeLog("Home page mounted");
  }, []);

  // ======================================================
  // GLOBAL AUTH STATE LOGGER
  // ======================================================

  useEffect(() => {
    homeLog("AUTH STATE CHANGED", {
      isLoading,
      isAuthenticated,

      hasToken: Boolean(token),
      hasUser: Boolean(user),

      role: user?.role,
      email: user?.email,

      isActive,
      isEmailVerified,
    });
  }, [isLoading, isAuthenticated, token, user, isActive, isEmailVerified]);

  // ======================================================
  // REDIRECT LOGIC
  // ======================================================

  useEffect(() => {
    homeLog("Redirect effect triggered");

    /**
     * IMPORTANT:
     * Wait until auth hydration fully completes
     */
    if (isLoading) {
      homeWarn("Auth still loading, redirect paused");

      return;
    }

    homeLog("Auth hydration complete");

    /**
     * No token → login
     */
    if (!isAuthenticated) {
      homeWarn("User NOT authenticated → redirecting to /login");

      router.replace("/login");

      return;
    }

    homeLog("User authenticated");

    /**
     * Token exists but profile still syncing
     */
    if (!user) {
      homeWarn(
        "Authenticated but user profile missing. Waiting for profile sync...",
      );

      return;
    }

    homeLog("User profile loaded", user);

    /**
     * Redirect based on role
     */
    const roleKey =
      user?.role?.toLowerCase?.()?.replace(/\s+/g, "_")?.trim?.() || "";

    homeLog("Normalized role key:", roleKey);

    const targetRoute = roleRoutes[roleKey] || "/dashboard";

    homeLog("Target route resolved:", {
      originalRole: user?.role,
      normalizedRole: roleKey,
      targetRoute,
    });

    if (!roleRoutes[roleKey]) {
      homeWarn("No matching role route found. Using fallback /dashboard");
    }

    homeLog("Executing router.replace()", targetRoute);

    router.replace(targetRoute);
  }, [isLoading, isAuthenticated, user, router]);

  // ======================================================
  // RENDER
  // ======================================================

  homeLog("Rendering Home component");

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />

        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>

        {/* DEBUG PANEL */}
        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 space-y-1 min-w-[280px]">
          <div className="flex justify-between">
            <span>Loading:</span>
            <span>{String(isLoading)}</span>
          </div>

          <div className="flex justify-between">
            <span>Authenticated:</span>
            <span>{String(isAuthenticated)}</span>
          </div>

          <div className="flex justify-between">
            <span>Token:</span>
            <span>{token ? "YES" : "NO"}</span>
          </div>

          <div className="flex justify-between">
            <span>User:</span>
            <span>{user ? "YES" : "NO"}</span>
          </div>

          <div className="flex justify-between">
            <span>Role:</span>
            <span>{user?.role || "NONE"}</span>
          </div>

          <div className="flex justify-between">
            <span>Active:</span>
            <span>{String(isActive)}</span>
          </div>

          <div className="flex justify-between">
            <span>Email Verified:</span>
            <span>{String(isEmailVerified)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
