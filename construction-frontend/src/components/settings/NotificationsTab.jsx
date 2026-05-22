"use client";

import React, { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { Bell } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsTab() {
  const [settings, setSettings] = useState({
    email: false,
    projects: false,
    system: false,
  });

  // ================= LOAD =================
  useEffect(() => {
    const saved = localStorage.getItem("notifications");

    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // ================= TOGGLE =================
  const handleToggle = (key, value) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      localStorage.setItem("notifications", JSON.stringify(updated));

      return updated;
    });
  };

  // ================= SAVE =================
  const handleSave = () => {
    toast.success("Notification settings saved");

    // 👉 later: API call here
    // await updateNotifications(settings)
  };

  return (
    <div className="p-4 animate-fadeInUp">
      <Card className="p-5 max-w-2xl shadow-soft border border-border/60">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-brand-orange" />
          <h2 className="text-sm font-bold">Notifications</h2>
        </div>

        {/* SETTINGS */}
        <div className="space-y-5">
          {/* EMAIL ALERTS */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Alerts</p>

              <p className="text-xs text-muted-foreground">
                Receive updates via email
              </p>
            </div>

            <Switch
              checked={settings.email}
              onCheckedChange={(val) => handleToggle("email", val)}
            />
          </div>

          {/* PROJECT UPDATES */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Project Updates</p>

              <p className="text-xs text-muted-foreground">
                Task and project changes
              </p>
            </div>

            <Switch
              checked={settings.projects}
              onCheckedChange={(val) => handleToggle("projects", val)}
            />
          </div>

          {/* SYSTEM ALERTS */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">System Alerts</p>

              <p className="text-xs text-muted-foreground">
                Critical system notifications
              </p>
            </div>

            <Switch
              checked={settings.system}
              onCheckedChange={(val) => handleToggle("system", val)}
            />
          </div>
        </div>

        {/* SAVE */}
        <div className="mt-6 flex justify-end">
          <Button
            className="bg-brand-orange hover:bg-[#d66e15] shadow-glow"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
