"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card } from "@/components/ui/card";

import { User, Shield, Bell, Palette } from "lucide-react";

import ProfileTab from "@/components/settings/ProfileTab";
import SecurityTab from "@/components/settings/SecurityTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import AppearanceTab from "@/components/settings/AppearanceTab";

const VALID_TABS = ["profile", "security", "notifications", "appearance"];

const menu = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Palette },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get("tab");
  const initialTab = VALID_TABS.includes(urlTab) ? urlTab : "profile";

  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    if (urlTab && VALID_TABS.includes(urlTab)) {
      setTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (value) => {
    setTab(value);
    router.replace(`?tab=${value}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      {/* HEADER */}
      <div className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security, and preferences
        </p>
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 max-w-7xl mx-auto">
        {/* ================= SIDEBAR ================= */}
        <Card className="h-fit lg:sticky lg:top-6 rounded-3xl border bg-background shadow-sm overflow-hidden">
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b bg-muted/20">
            <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Settings Menu
            </h2>
          </div>

          {/* Sidebar Nav */}
          <div className="p-3">
            <nav className="space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = tab === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabChange(item.key)}
                    className={`
                      relative flex items-center w-full gap-3
                      rounded-xl px-4 py-3 text-sm font-medium
                      transition-all duration-200
                      ${
                        active
                          ? "bg-brand-orange/10 text-brand-orange"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-orange" />
                    )}

                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </Card>

        {/* ================= CONTENT ================= */}
        <Card className="rounded-3xl border bg-background shadow-sm">
          <div className="p-8">
            {tab === "profile" && <ProfileTab />}
            {tab === "security" && <SecurityTab />}
            {tab === "notifications" && <NotificationsTab />}
            {tab === "appearance" && <AppearanceTab />}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
