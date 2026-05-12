"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, profileLoading } = useAuth();

  useEffect(() => {
    if (profileLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const role = user?.role?.name; // 👈 IMPORTANT (from backend Role model)

    switch (role) {
      case "architect":
        router.replace("/architect");
        break;

      case "admin":
        router.replace("/admin");
        break;

      case "vendor":
        router.replace("/vendor");
        break;

      case "client":
        router.replace("/client");
        break;

      default:
        router.replace("/login");
    }
  }, [user, isAuthenticated, profileLoading, router]);

  return (
    <div className="flex h-screen items-center justify-center">Loading...</div>
  );
}
