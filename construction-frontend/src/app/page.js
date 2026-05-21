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
    // 🔒 wait until auth is fully stable
    if (!authInitialized || !authResolved) return;

    // not logged in → login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // logged in → role-based redirect
    const roleKey = user?.role?.toLowerCase?.();
    const targetRoute = roleRoutes[roleKey] || "/dashboard/architect";

    router.replace(targetRoute);
  }, [authInitialized, authResolved, isAuthenticated, user, router]);

  return (
    <div className="h-screen flex items-center justify-center text-sm text-gray-400">
      Initializing workspace...
    </div>
  );
}
