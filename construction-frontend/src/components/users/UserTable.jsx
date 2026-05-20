"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";

export default function UserTable({ users, onUserClick, onDelete }) {
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
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-muted/30 transition cursor-pointer"
                onClick={() => onUserClick(user)}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#ef7f1b] text-white font-bold">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm">{user.email}</td>
                <td className="px-5 py-4 text-sm">{user.phone || "—"}</td>
                <td className="px-5 py-4">
                  <Badge variant="outline">
                    {user.role?.display_name ||
                      user.role?.name ||
                      user.role ||
                      "No Role"}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9"
                      onClick={() => toast.info("Edit user coming soon")}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
