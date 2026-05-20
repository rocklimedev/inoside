"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

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

  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    /**
     * IMPORTANT:
     * Wait until auth hydration fully completes
     */
    if (isLoading) return;

    /**
     * No token → login
     */
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    /**
     * Token exists but profile still syncing
     */
    if (!user) return;

    /**
     * Redirect based on role
     */
    const roleKey = user?.role?.toLowerCase?.() || "";

    const targetRoute = roleRoutes[roleKey] || "/dashboard";

    router.replace(targetRoute);
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />

        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
