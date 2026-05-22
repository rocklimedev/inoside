"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddUserDialog({
  open,
  onOpenChange,
  onCreate,
  isCreating,
  roles,
  userToEdit = null,
}) {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    avatar_url: "",
    avatar_thumbnail: "",
    is_active: true,
  });

  // Populate form when editing
  useEffect(() => {
    if (userToEdit) {
      setNewUser({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        phone: userToEdit.phone || "",
        password: "", // never prefill password
        role_id: userToEdit.role_id || userToEdit.role?.id || "",
        avatar_url: userToEdit.avatar_url || "",
        avatar_thumbnail: userToEdit.avatar_thumbnail || "",
        is_active: userToEdit.is_active ?? true,
      });
    } else {
      setNewUser({
        name: "",
        email: "",
        phone: "",
        password: "",
        role_id: "",
        avatar_url: "",
        avatar_thumbnail: "",
        is_active: true,
      });
    }
  }, [userToEdit]);

  const handleSubmit = async () => {
    if (!newUser.name || !newUser.email || !newUser.role_id) {
      toast.error("Name, Email and Role are required");
      return;
    }

    if (!userToEdit && !newUser.password) {
      toast.error("Password is required");
      return;
    }

    try {
      if (userToEdit) {
        toast.info("Update user functionality coming soon");
        console.log("Update payload:", newUser);
      } else {
        await onCreate(newUser);
        toast.success("User created successfully");
      }

      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to save user");
    }
  };

  const title = userToEdit ? "Edit User" : "Add New User";
  const buttonText = userToEdit ? "Update User" : "Create User";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <Label>Name *</Label>
            <Input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              placeholder="+91XXXXXXXXXX"
            />
          </div>

          {/* Password (required for create) */}
          {!userToEdit && (
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Role (role_id FIXED) */}
          <div>
            <Label>Role *</Label>
            <Select
              value={newUser.role_id}
              onValueChange={(v) => setNewUser({ ...newUser, role_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.display_name || r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Avatar URL */}
          <div>
            <Label>Avatar URL</Label>
            <Input
              value={newUser.avatar_url}
              onChange={(e) =>
                setNewUser({ ...newUser, avatar_url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          {/* Avatar Thumbnail */}
          <div>
            <Label>Avatar Thumbnail</Label>
            <Input
              value={newUser.avatar_thumbnail}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  avatar_thumbnail: e.target.value,
                })
              }
              placeholder="https://..."
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between">
            <Label>Active Status</Label>
            <Switch
              checked={newUser.is_active}
              onCheckedChange={(v) => setNewUser({ ...newUser, is_active: v })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isCreating}
            className="bg-[#ef7f1b]"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
