"use client";

import React, { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User, Save } from "lucide-react";
import { toast } from "sonner";

import { useUpdateUserMutation } from "@/api/usersApi";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileTab() {
  const { user, refreshUser } = useAuth();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // hydrate from AuthContext
  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
      });
    }
  }, [user]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser({
        id: user.id,
        ...form,
      }).unwrap();

      // IMPORTANT: refresh auth user after update
      await refreshUser();

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-4">
      <Card className="p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-bold">Profile Information</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500">Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="mt-3">
          <Label className="text-xs text-gray-500">Email</Label>
          <Input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            disabled={isUpdating}
            className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
