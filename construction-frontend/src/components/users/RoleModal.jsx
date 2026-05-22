"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 👉 adjust import based on your API structure
import { useGetRolesQuery } from "@/api/rbacApi";
import { useUpdateUserMutation } from "@/api/usersApi";

export default function RoleModal({ open, user, onOpenChange }) {
  const { data: roles = [] } = useGetRolesQuery();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [selectedRole, setSelectedRole] = useState("");

  // sync current user role
  useEffect(() => {
    if (user?.role?.id) {
      setSelectedRole(user.role.id);
    } else {
      setSelectedRole("");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUser({
        id: user.id,
        body: {
          role_id: selectedRole,
        },
      }).unwrap();

      toast.success("Role updated successfully");

      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* USER INFO */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          {/* ROLE SELECT */}
          <div className="space-y-2">
            <Label>Select Role</Label>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>

              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.display_name || role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isLoading || !selectedRole}
            className="bg-[#ef7f1b] hover:bg-[#d66e15]"
          >
            {isLoading ? "Saving..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
