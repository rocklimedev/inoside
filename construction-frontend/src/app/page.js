"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, authInitialized, authResolved, isAuthenticated } = useAuth();

  const roleRoutes = {
    architect: "/dashboard/architect",
    client: "/dashboard/client",
    builder: "/dashboard/builder",
    site_supervisor: "/dashboard/site-supervisor",
    team_member: "/dashboard/team",
    admin: "/dashboard/admin",
    super_admin: "/dashboard/admin",
  };

  useEffect(() => {
    // Wait for auth to resolve
    if (!authInitialized || !authResolved) return;

    // Not logged in → login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Logged in → role-based redirect
    const roleKey = user?.role?.toLowerCase?.();
    const targetRoute = roleRoutes[roleKey] || "/dashboard/architect";
    router.replace(targetRoute);
  }, [authInitialized, authResolved, isAuthenticated, user, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-gray-500">Initializing workspace...</p>
      </div>
    </div>
  );
}
