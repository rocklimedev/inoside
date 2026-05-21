"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardGroupLayout({ children }) {
  const router = useRouter();
  const { authInitialized, authResolved, isAuthenticated, profileFetching } =
    useAuth();

  useEffect(() => {
    // 🔴 WAIT for auth to fully resolve before checking
    if (!authInitialized || !authResolved) return;

    // 🔴 WAIT for profile to finish fetching (CRITICAL for nested routes!)
    if (profileFetching) return;

    // Now it's safe to check
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [authInitialized, authResolved, isAuthenticated, profileFetching, router]);

  // Show loader while auth is resolving OR profile is fetching
  if (!authInitialized || !authResolved || profileFetching) {
    return <FullScreenLoader />;
  }

  // Not authenticated - return null (don't render content)
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Auth is valid and stable - render protected content
  return <DashboardLayout>{children}</DashboardLayout>;
}
