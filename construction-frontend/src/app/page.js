"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const roleRoutes = {
  architect: "/dashboard/architect",
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  client: "/dashboard/client",
  site_supervisor: "/dashboard/site-supervisor",
};

const normalizeRole = (role) => {
  if (!role) return null;
  if (typeof role === "string") return role.toLowerCase();
  return role.name?.toLowerCase();
};

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // 1. Not logged in → login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // 2. Get normalized role
    const role = normalizeRole(user?.role);

    const targetRoute = roleRoutes[role] || "/dashboard";

    router.replace(targetRoute);
  }, [isLoading, isAuthenticated, user?.role, router]);

  return (
    <div className="flex h-screen items-center justify-center">Loading...</div>
  );
}
