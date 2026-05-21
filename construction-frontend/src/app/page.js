"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, authInitialized, isAuthenticated } = useAuth();

  // same mapping style as SidebarContent
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
    if (!authInitialized) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // 👇 ADD IT HERE
    console.log("USER ROLE RAW:", user?.role, typeof user?.role);

    const roleKey =
      typeof user?.role === "string"
        ? user.role.toLowerCase()
        : Array.isArray(user?.role)
          ? user.role[0]?.toLowerCase?.()
          : user?.role?.name?.toLowerCase?.();

    const targetRoute = roleRoutes[roleKey] || "/dashboard/architect";

    router.replace(targetRoute);
  }, [authInitialized, isAuthenticated, user, router]);
  // minimal UX while deciding route
  return (
    <div className="h-screen flex items-center justify-center text-sm text-gray-400">
      Initializing workspace...
    </div>
  );
}
