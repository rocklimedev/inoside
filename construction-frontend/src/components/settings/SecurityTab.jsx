import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function SecurityTab() {
  return (
    <div className="p-4">
      <Card className="p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-bold">Security</h2>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">Current Password</Label>
            <Input type="password" />
          </div>

          <div>
            <Label className="text-xs text-gray-500">New Password</Label>
            <Input type="password" />
          </div>

          <div>
            <Label className="text-xs text-gray-500">Confirm Password</Label>
            <Input type="password" />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => toast.success("Password updated")}
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
}
