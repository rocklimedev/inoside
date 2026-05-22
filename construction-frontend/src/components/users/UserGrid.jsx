"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Pencil, Trash2, MoreVertical, Mail, Phone } from "lucide-react";

import { toast } from "sonner";

export default function UserGrid({ users, onUserClick, onDelete, onEdit }) {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {users.map((user) => {
        const avatar = user?.avatar_thumbnail || user?.avatar_url || "";

        return (
          <Card
            key={user.id}
            className="cursor-pointer p-5 transition-all hover:border-primary/20 hover:shadow-soft"
            onClick={() => onUserClick(user)}
          >
            {/* ================= HEADER ================= */}
            <div className="flex items-start justify-between">
              {/* Avatar */}
              <Avatar className="h-14 w-14 border">
                {/* IMAGE */}
                {avatar && (
                  <AvatarImage
                    src={avatar}
                    alt={user.name}
                    className="object-cover"
                  />
                )}

                {/* FALLBACK */}
                <AvatarFallback className="bg-gradient-to-br from-[#ef7f1b] to-orange-600 text-xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Edit */}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();

                    onEdit(user);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                {/* Menu */}
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
                      onClick={(e) => handleDelete(user.id, e)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="mt-5">
              <h3 className="text-lg font-semibold line-clamp-1">
                {user.name}
              </h3>

              {/* Email */}
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />

                <span className="truncate">{user.email}</span>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />

                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            {/* ================= FOOTER ================= */}
            <div className="mt-5 flex items-center justify-between gap-2">
              {/* Role */}
              <Badge variant="outline">
                {user?.role?.display_name ||
                  user?.role?.name ||
                  user?.role ||
                  "No Role"}
              </Badge>

              {/* Status */}
              <Badge variant={user?.is_active ? "default" : "secondary"}>
                {user?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
