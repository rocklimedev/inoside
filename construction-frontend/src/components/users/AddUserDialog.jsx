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
  userToEdit = null, // ← New prop for editing
}) {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Staff",
    is_active: true,
  });

  // Populate form when editing a user
  useEffect(() => {
    if (userToEdit) {
      setNewUser({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        phone: userToEdit.phone || "",
        role: userToEdit.role?.name || userToEdit.role || "Staff",
        is_active: userToEdit.is_active ?? true,
      });
    } else {
      setNewUser({
        name: "",
        email: "",
        phone: "",
        role: "Staff",
        is_active: true,
      });
    }
  }, [userToEdit]);

  const handleSubmit = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Name and Email are required");
      return;
    }

    try {
      if (userToEdit) {
        // TODO: Add update mutation later
        toast.info("Update user functionality coming soon");
        console.log("Would update user:", userToEdit.id, newUser);
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

        <div className="space-y-5 py-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

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

          <div>
            <Label>Phone</Label>
            <Input
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={newUser.role}
              onValueChange={(v) => setNewUser({ ...newUser, role: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.name}>
                    {r.display_name || r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
