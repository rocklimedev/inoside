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

import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Calendar,
} from "lucide-react";

export default function GridView({ users, onSelect, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {users.map((user) => (
        <Card
          key={user.id}
          onClick={() => onSelect(user)}
          className="relative p-5 hover:shadow-xl hover:border-[#ef7f1b]/30 cursor-pointer transition-all duration-200 group overflow-hidden"
        >
          {/* Top */}
          <div className="flex items-start justify-between gap-3">
            {/* User */}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg truncate">{user.name}</h3>

              <p className="text-sm text-gray-500 truncate">@{user.username}</p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Role */}
              <Badge
                variant="outline"
                className="shrink-0 border-[#ef7f1b]/30 text-[#ef7f1b] bg-[#ef7f1b]/10"
              >
                {user.role || "Viewer"}
              </Badge>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Email */}
          <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />

            <p className="truncate">{user.email}</p>
          </div>

          {/* Joined */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 shrink-0" />

            <span>
              Joined{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </Card>
      ))}

      {/* Empty */}
      {users.length === 0 && (
        <div className="col-span-full text-center py-16 text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
}
