"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, authInitialized, isAuthenticated, getDefaultRoute } = useAuth();

  useEffect(() => {
    if (!authInitialized) return;

    // Not logged in → go login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Logged in → go to role-based dashboard
    const targetRoute = getDefaultRoute?.() || "/dashboard/architect";
    router.replace(targetRoute);
  }, [authInitialized, isAuthenticated, getDefaultRoute, router]);

  return (
    <div className="h-screen flex items-center justify-center text-sm text-gray-400">
      Initializing workspace...
    </div>
  );
}
