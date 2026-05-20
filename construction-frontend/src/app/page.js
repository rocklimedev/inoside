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
  const { authInitialized, authResolved, isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Wait for initialization AND resolution
    if (!authInitialized || !authResolved) return;

    // Not authenticated → Login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Wait for role data
    if (!user?.role) return;

    // Redirect to role dashboard
    const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();
    router.replace(roleRoutes[roleKey] || "/dashboard");
  }, [authInitialized, authResolved, isAuthenticated, user?.role, router]);

  // Always show loader - this page never stays visible
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
