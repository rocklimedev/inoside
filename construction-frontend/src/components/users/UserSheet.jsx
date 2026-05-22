"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Mail, Phone, Shield, Trash2, Calendar } from "lucide-react";

import { toast } from "sonner";

export default function UserSheet({ user, open, onOpenChange, onDelete }) {
  // ================= DELETE =================
  const handleDelete = async () => {
    if (!confirm("Delete this user?")) return;

    try {
      await onDelete(user.id);

      toast.success("User deleted successfully");

      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (!user) return null;

  const avatar = user?.avatar_thumbnail || user?.avatar_url || "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[460px] overflow-auto">
        {/* ================= HEADER ================= */}
        <SheetHeader>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="h-16 w-16 border">
              {/* IMAGE */}
              {avatar && (
                <AvatarImage
                  src={avatar}
                  alt={user.name}
                  className="object-cover"
                />
              )}

              {/* FALLBACK */}
              <AvatarFallback className="bg-gradient-to-br from-[#ef7f1b] to-orange-600 text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate">{user.name}</SheetTitle>

              <SheetDescription className="truncate">
                {user.email}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* ================= BODY ================= */}
        <div className="mt-8 space-y-6">
          {/* Details */}
          <div className="space-y-4 text-sm">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />

              <span className="break-all">{user.email}</span>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />

                <span>{user.phone}</span>
              </div>
            )}

            {/* Role */}
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground shrink-0" />

              <Badge variant="outline">
                {user?.role?.display_name ||
                  user?.role?.name ||
                  user?.role ||
                  "No Role"}
              </Badge>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  user?.is_active ? "bg-green-500" : "bg-gray-400"
                }`}
              />

              <span>{user?.is_active ? "Active User" : "Inactive User"}</span>
            </div>

            {/* Last Login */}
            {user?.last_login && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />

                <span>
                  Last login: {new Date(user.last_login).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* ================= ACTIONS ================= */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
