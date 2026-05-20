"use client";

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

export default function RoleTable({ roles, onRoleClick, onDelete }) {
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
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="bg-muted/40">
            <tr className="border-b">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Permissions
              </th>
              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role.id}
                className="border-b hover:bg-muted/30 transition cursor-pointer"
                onClick={() => onRoleClick(role)}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-2">
                      <Shield className="h-5 w-5 text-[#ef7f1b]" />
                    </div>
                    <span className="font-medium">{role.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {role.description || "—"}
                </td>
                <td className="px-5 py-4">
                  <Badge variant="secondary">
                    {role.permissions?.length || 0} permissions
                  </Badge>
                </td>
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9"
                      onClick={() => toast.info("Edit role coming soon")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-9 w-9">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
