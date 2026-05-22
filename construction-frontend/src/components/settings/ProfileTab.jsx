"use client";

import React, { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User, Save, Shield, Upload } from "lucide-react";

import { toast } from "sonner";

import { useUpdateUserMutation } from "@/api/usersApi";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileTab() {
  const { user, refreshUser } = useAuth();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");

  // ================= HYDRATE =================
  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "",
      });

      setPreview(user?.avatar_thumbnail || "");
    }
  }, [user]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("phone", form.phone);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await updateUser({
        id: user.id,
        body: formData,
      }).unwrap();

      await refreshUser();

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-4">
      <Card className="p-5 max-w-3xl">
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-bold">Profile Information</h2>
        </div>

        {/* ================= AVATAR UPLOAD ================= */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-sm font-bold">
                {form.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>

          <div className="flex-1">
            <Label className="text-xs text-gray-500 mb-1 block">
              Upload Avatar
            </Label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Choose image file</span>

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NAME */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Full Name
            </Label>

            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Email Address
            </Label>

            <Input value={form.email} readOnly className="bg-muted" />
          </div>

          {/* PHONE */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Phone</Label>

            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone"
            />
          </div>

          {/* ROLE */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Role</Label>

            <div className="relative">
              <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <Input
                className="pl-9 bg-muted capitalize"
                value={form.role || "N/A"}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* ================= SAVE ================= */}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={isUpdating}
            className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
