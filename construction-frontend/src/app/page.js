"use client";

import { useEffect, useRef } from "react";
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
  const { isLoading, isAuthenticated, user } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    if (!isAuthenticated) {
      hasRedirected.current = true;
      router.replace("/login");
      return;
    }

    // Wait until role is available
    if (!user?.role) return;

    const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();
    const targetRoute = roleRoutes[roleKey] || "/dashboard";

    hasRedirected.current = true;
    router.replace(targetRoute);
  }, [isLoading, isAuthenticated, user?.role, router]);

  // Always show spinner — this page only exists to redirect
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
