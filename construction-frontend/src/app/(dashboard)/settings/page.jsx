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
    <div className="min-h-screen bg-muted/30 p-6 animate-fadeIn">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security, and preferences
        </p>
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 max-w-6xl mx-auto">
        {/* SIDEBAR */}
        <Card className="p-3 rounded-2xl shadow-soft border border-border/60 bg-background animate-slideInRight">
          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;

              const active = tab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                    ${
                      active
                        ? "bg-brand-orange text-white shadow-glow"
                        : "hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* CONTENT */}
        <Card className="rounded-2xl shadow-soft border border-border/60 bg-background animate-fadeInUp">
          <div className="p-6">
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
