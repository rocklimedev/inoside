"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Shield, Trash2 } from "lucide-react";

export default function RoleSheet({ role, open, onOpenChange, onDelete }) {
  const handleDelete = async () => {
    if (!confirm("Delete this role?")) return;
    await onDelete(role.id);
    onOpenChange(false);
  };

  if (!role) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[480px] overflow-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Shield className="h-7 w-7 text-[#ef7f1b]" />
            {role.name}
          </SheetTitle>
          <SheetDescription>{role.description}</SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          <h4 className="mb-4 font-semibold">Permissions</h4>
          <div className="space-y-2">
            {role.permissions?.map((perm) => (
              <div
                key={perm}
                className="rounded-xl border bg-muted/30 px-3 py-2 text-sm"
              >
                {perm}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Role
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
