"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // define routes where dashboard layout should NOT apply
  const publicRoutes = ["/login", "/signup"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute) {
    return children; // ❌ no sidebar/header
  }

  return <DashboardLayout>{children}</DashboardLayout>; // ✅ dashboard UI
}
