// app/page.jsx  (or pages/index.jsx)
"use client";
import { Loader2 } from "lucide-react";

export default function Home() {
  // AppContent in AppProviders handles the redirect.
  // This component simply never stays visible.
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
