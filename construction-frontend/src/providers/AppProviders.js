"use client";

import { usePathname } from "next/navigation";
import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

export default function AppProviders({ children }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/404") ||
    pathname.startsWith("/no-access") ||
    pathname === "/not-found";

  return (
    <ReduxProvider>
      <AuthProvider>
        {isAuthPage ? children : <DashboardLayout>{children}</DashboardLayout>}
      </AuthProvider>
    </ReduxProvider>
  );
}
