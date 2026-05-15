import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Palette } from "lucide-react";
import { toast } from "sonner";

export default function AppearanceTab() {
  return (
    <div className="p-4">
      <Card className="p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-bold">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-gray-400">
                Switch between light and dark theme
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Compact Layout</p>
              <p className="text-xs text-gray-400">Reduce spacing across UI</p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            onClick={() => toast.success("Appearance updated")}
          >
            Apply
          </Button>
        </div>
      </Card>
    </div>
  );
}
