"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Loader2, User, Mail, Lock, Shield } from "lucide-react";

const ROLES = [
  "Admin",
  "Manager",
  "Architect",
  "Engineer",
  "Designer",
  "Viewer",
];

export default function UserForm({
  onSubmit,
  isLoading,
  onCancel,
  initialData = null,
}) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "Viewer",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        username: initialData.username || "",
        email: initialData.email || "",
        password: "",
        role: initialData.role || "Viewer",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formData };

    // Don't send empty password in edit mode
    if (isEdit && !payload.password) {
      delete payload.password;
    }

    onSubmit(payload);
  };

  return (
    <div className="bg-white">
      <DialogHeader className="pb-2">
        <DialogTitle className="text-xl font-bold">
          {isEdit ? "Update User" : "New User"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5 py-4">
        {/* Name + Username */}
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name *</Label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <Input
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
                className="pl-10 bg-white border-gray-300 focus-visible:ring-[#ef7f1b]/20"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label>Username *</Label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <Input
                required
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    username: e.target.value,
                  }))
                }
                className="pl-10 bg-white border-gray-300 focus-visible:ring-[#ef7f1b]/20"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email *</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <Input
              type="email"
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  email: e.target.value,
                }))
              }
              className="pl-10 bg-white border-gray-300 focus-visible:ring-[#ef7f1b]/20"
            />
          </div>
        </div>

        {/* Password + Role */}
        <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-2">
            <Label>Password {isEdit ? "(optional)" : "*"}</Label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <Input
                type="password"
                required={!isEdit}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    password: e.target.value,
                  }))
                }
                className="pl-10 bg-white border-gray-300 focus-visible:ring-[#ef7f1b]/20"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>

            <Select
              value={formData.role}
              onValueChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  role: v,
                }))
              }
            >
              <SelectTrigger className="bg-white border-gray-300 focus:ring-[#ef7f1b]/20">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>

              <SelectContent className="bg-white">
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#ef7f1b] hover:bg-[#d66e15] min-w-[130px]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : isEdit ? (
              "Update User"
            ) : (
              "Create User"
            )}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}
