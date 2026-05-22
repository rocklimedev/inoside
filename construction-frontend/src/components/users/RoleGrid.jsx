"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Pencil, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";

export default function RoleGrid({
  roles,
  onRoleClick,
  onDelete,
  onEdit, // ← New prop
}) {
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this role?")) return;
    try {
      await onDelete(id);
      toast.success("Role deleted successfully");
    } catch (err) {
      toast.error("Failed to delete role");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => (
        <Card
          key={role.id}
          className="cursor-pointer p-6 hover:border-primary/20 hover:shadow-soft transition-all"
          onClick={() => onRoleClick(role)}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="rounded-2xl bg-orange-100 p-3">
                <Shield className="h-7 w-7 text-[#ef7f1b]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{role.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role.description || "No description"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Updated Edit Button */}
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(role); // ← Now opens edit dialog
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => handleDelete(role.id, e)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-6">
            <Badge variant="secondary">
              {role.permissions?.length || 0} permissions
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
