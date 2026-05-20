"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export default function AddRoleDialog({
  open,
  onOpenChange,
  onCreate,
  isCreating,
  availablePermissions,
}) {
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  const handleSubmit = async () => {
    if (!newRole.name) {
      alert("Role name is required");
      return;
    }
    await onCreate(newRole);
    onOpenChange(false);
    setNewRole({ name: "", description: "", permissions: [] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div>
            <Label>Role Name *</Label>
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Manager"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={newRole.description}
              onChange={(e) =>
                setNewRole({ ...newRole, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-3 block">Permissions</Label>
            <ScrollArea className="h-72 rounded-xl border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePermissions.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted cursor-pointer"
                  >
                    <Checkbox
                      checked={newRole.permissions.includes(perm)}
                      onCheckedChange={(checked) =>
                        setNewRole((prev) => ({
                          ...prev,
                          permissions: checked
                            ? [...prev.permissions, perm]
                            : prev.permissions.filter((p) => p !== perm),
                        }))
                      }
                    />
                    <span className="text-sm capitalize">
                      {perm.replace(".", " • ")}
                    </span>
                  </label>
                ))}
              </div>
            </ScrollArea>
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
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
