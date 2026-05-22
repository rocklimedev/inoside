"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Pencil, Trash2, MoreVertical } from "lucide-react";

import { toast } from "sonner";

export default function UserTable({ users, onUserClick, onDelete, onEdit }) {
  // ================= DELETE =================
  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!confirm("Delete this user?")) return;

    try {
      await onDelete(id);

      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          {/* ================= HEAD ================= */}
          <thead className="bg-muted/40">
            <tr className="border-b">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                User
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Phone
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Role
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody>
            {users.map((user) => {
              const avatar = user?.avatar_thumbnail || user?.avatar_url || "";

              return (
                <tr
                  key={user.id}
                  className="border-b hover:bg-muted/30 transition cursor-pointer"
                  onClick={() => onUserClick(user)}
                >
                  {/* USER */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        {/* IMAGE */}
                        {avatar && (
                          <AvatarImage
                            src={avatar}
                            alt={user.name}
                            className="object-cover"
                          />
                        )}

                        {/* FALLBACK */}
                        <AvatarFallback className="bg-[#ef7f1b] text-white font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-5 py-4 text-sm">
                    <span className="truncate block max-w-[240px]">
                      {user.email}
                    </span>
                  </td>

                  {/* PHONE */}
                  <td className="px-5 py-4 text-sm">{user.phone || "—"}</td>

                  {/* ROLE */}
                  <td className="px-5 py-4">
                    <Badge variant="outline">
                      {user?.role?.display_name ||
                        user?.role?.name ||
                        user?.role ||
                        "No Role"}
                    </Badge>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <Badge variant={user?.is_active ? "default" : "secondary"}>
                      {user?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  {/* ACTIONS */}
                  <td
                    className="px-5 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      {/* EDIT */}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9"
                        onClick={(e) => {
                          e.stopPropagation();

                          onEdit(user);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* MENU */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => handleDelete(user.id, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
