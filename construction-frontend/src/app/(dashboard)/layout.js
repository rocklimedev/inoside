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
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // 🔵 Show loader while auth is resolving
  if (isLoading) {
    return <FullScreenLoader />;
  }

  // 🔴 Prevent rendering protected UI before redirect
  if (!isAuthenticated) {
    return null;
  }

  // 🟢 Auth OK → render dashboard layout
  return <DashboardLayout>{children}</DashboardLayout>;
}
