"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

export default function ListView({ users, onSelect, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-500 border-b">
        <div className="col-span-5">User</div>

        <div className="col-span-4">Email</div>

        <div className="col-span-2">Role</div>

        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Rows */}
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelect(user)}
          className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer items-center transition-colors"
        >
          {/* User */}
          <div className="col-span-5 min-w-0">
            <p className="font-medium text-black truncate">{user.name}</p>

            <p className="text-sm text-gray-500 truncate">@{user.username}</p>
          </div>

          {/* Email */}
          <div className="col-span-4 text-sm text-gray-600 truncate">
            {user.email}
          </div>

          {/* Role */}
          <div className="col-span-2">
            <Badge
              variant="outline"
              className="text-xs border-[#ef7f1b]/30 text-[#ef7f1b] bg-[#ef7f1b]/10"
            >
              {user.role || "Viewer"}
            </Badge>
          </div>

          {/* Actions */}
          <div className="col-span-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                {/* View */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();

                    onSelect(user);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>

                {/* Edit */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();

                    onEdit?.(user);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>

                {/* Delete */}
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();

                    onDelete?.(user);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      {/* Empty */}
      {users.length === 0 && (
        <div className="text-center py-14 text-gray-500 text-sm">
          No users found
        </div>
      )}
    </div>
  );
}
