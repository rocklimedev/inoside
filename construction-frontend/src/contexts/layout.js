"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

export default function DashboardGroupLayout({ children }) {
  const router = useRouter();
  const { authInitialized, authResolved, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authInitialized || !authResolved) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [authInitialized, authResolved, isAuthenticated, router]);

  if (!authInitialized || !authResolved) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return null; // 👈 IMPORTANT (not loader)
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
