// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

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
  const { authInitialized, isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Only run this effect on the root page
    // This page should NEVER render, only redirect

    if (!authInitialized) return;

    // Not authenticated → Login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Wait for user role to load
    if (!user?.role) {
      console.log("[ROOT] Waiting for user role...");
      return;
    }

    // Authenticated with role → Redirect to dashboard
    console.log("[ROOT] Redirecting to role dashboard:", user.role);

    const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();
    const redirectTo = roleRoutes[roleKey] || "/dashboard";

    router.replace(redirectTo);
  }, [authInitialized, isAuthenticated, user?.role, router]);

  // This page never stays visible - just show loading
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
