"use client";

import { usePathname } from "next/navigation";
import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

export default function AppProviders({ children }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <ReduxProvider>
      <AuthProvider>
        {isAuthPage ? children : <DashboardLayout>{children}</DashboardLayout>}
      </AuthProvider>
    </ReduxProvider>
  );
}
