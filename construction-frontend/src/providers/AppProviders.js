"use client";

import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
}
