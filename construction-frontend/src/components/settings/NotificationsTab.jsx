import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsTab() {
  return (
    <div className="p-4">
      <Card className="p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-bold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Alerts</p>
              <p className="text-xs text-gray-400">Receive updates via email</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Project Updates</p>
              <p className="text-xs text-gray-400">Task and project changes</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">System Alerts</p>
              <p className="text-xs text-gray-400">
                Critical system notifications
              </p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => toast.success("Notification settings saved")}
            className="bg-[#ef7f1b] hover:bg-[#d66e15]"
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
