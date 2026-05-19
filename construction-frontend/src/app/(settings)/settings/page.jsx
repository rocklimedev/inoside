"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Card, CardContent } from "@/components/ui/card";

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
    <div className="flex flex-col h-full p-6 bg-muted/30">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security and preferences
        </p>
      </div>

      {/* CENTERED LAYOUT */}
      <div className="max-w-5xl w-full mx-auto">
        <Card className="shadow-soft border border-border/60 rounded-2xl overflow-hidden">
          {/* TABS HEADER */}
          <div className="border-b bg-background/60 px-4 py-3">
            <Tabs
              value={tab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList
                className="
                  grid grid-cols-4
                  w-full
                  bg-muted/40
                  p-1
                  rounded-xl
                "
              >
                <TabsTrigger
                  value="profile"
                  className="
                    rounded-lg
                    data-[state=active]:bg-background
                    data-[state=active]:shadow-sm
                  "
                >
                  Profile
                </TabsTrigger>

                <TabsTrigger
                  value="security"
                  className="
                    rounded-lg
                    data-[state=active]:bg-background
                    data-[state=active]:shadow-sm
                  "
                >
                  Security
                </TabsTrigger>

                <TabsTrigger
                  value="notifications"
                  className="
                    rounded-lg
                    data-[state=active]:bg-background
                    data-[state=active]:shadow-sm
                  "
                >
                  Notifications
                </TabsTrigger>

                <TabsTrigger
                  value="appearance"
                  className="
                    rounded-lg
                    data-[state=active]:bg-background
                    data-[state=active]:shadow-sm
                  "
                >
                  Appearance
                </TabsTrigger>
              </TabsList>

              {/* CONTENT AREA */}
              <CardContent className="p-6">
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
              </CardContent>
            </Tabs>
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
