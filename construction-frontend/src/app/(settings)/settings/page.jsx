"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import ProfileTab from "@/components/settings/ProfileTab";
import SecurityTab from "@/components/settings/SecurityTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import AppearanceTab from "@/components/settings/AppearanceTab";

const VALID_TABS = ["profile", "security", "notifications", "appearance"];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get("tab");
  const initialTab = VALID_TABS.includes(urlTab) ? urlTab : "profile";

  const [tab, setTab] = useState(initialTab);

  // sync URL -> state
  useEffect(() => {
    if (urlTab && VALID_TABS.includes(urlTab)) {
      setTab(urlTab);
    }
  }, [urlTab]);

  // sync state -> URL
  const handleTabChange = (value) => {
    setTab(value);
    router.replace(`?tab=${value}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b bg-white">
        <h1 className="text-xl font-black">Settings</h1>

        <p className="text-xs text-gray-400 mt-1">
          Manage your account and system preferences
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-4 mt-4 w-fit bg-gray-100">
          <TabsTrigger value="profile">Profile</TabsTrigger>

          <TabsTrigger value="security">Security</TabsTrigger>

          <TabsTrigger value="notifications">Notifications</TabsTrigger>

          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
      </Tabs>
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
