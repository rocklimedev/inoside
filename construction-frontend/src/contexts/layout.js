"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function DashboardGroupLayout({ children }) {
  const router = useRouter();

  const { authInitialized, authResolved, isAuthenticated, profileFetching } =
    useAuth();

  const isLoading = !authInitialized || !authResolved || profileFetching;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // 🔵 Block UI until auth is fully stable
  if (isLoading) {
    return <FullScreenLoader />;
  }

  // 🔴 Prevent flash of protected layout
  if (!isAuthenticated) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
