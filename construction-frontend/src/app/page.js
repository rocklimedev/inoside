"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname(); // ← Added this
  const { isLoading, isAuthenticated, user } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only run redirect logic on the exact root path "/"
    if (pathname !== "/") return;

    if (isLoading || hasRedirected.current) return;

    if (!isAuthenticated) {
      hasRedirected.current = true;
      router.replace("/login");
      return;
    }

    if (!user?.role) return; // Wait for profile to load

    const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();
    const targetRoute = roleRoutes[roleKey] || "/dashboard";

    console.log("[HOME] Redirecting from root to:", targetRoute);
    hasRedirected.current = true;
    router.replace(targetRoute);
  }, [pathname, isLoading, isAuthenticated, user?.role, router]);

  // Only show loader on root path
  if (pathname === "/") {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // If somehow rendered on other pages, just show children (safety)
  return null;
}
