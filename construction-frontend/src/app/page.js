// app/page.jsx
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
  const { authInitialized, isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!authInitialized) return;

    // Not authenticated → Login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Wait for user role to load
    if (!user?.role) return;

    // Authenticated → Redirect to role dashboard
    const roleKey = user.role.toLowerCase().replace(/\s+/g, "_").trim();

    router.replace(roleRoutes[roleKey] || "/dashboard");
  }, [authInitialized, isAuthenticated, user?.role, router]);

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
