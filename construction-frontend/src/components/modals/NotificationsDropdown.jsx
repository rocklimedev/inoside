// components/dropdowns/NotificationsDropdown.tsx
"use client";

import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

const defaultNotifications = [
  {
    id: 1,
    title: "New client message",
    message: "Sarah Chen sent a message about project timeline",
    time: "2 min ago",
    unread: true,
    type: "message",
  },
  {
    id: 2,
    title: "Project Update",
    message: "Site photos uploaded for Project #8921",
    time: "15 min ago",
    unread: true,
    type: "project",
  },
  {
    id: 3,
    title: "Approval Required",
    message: "Client approved final design for Villa Phase 2",
    time: "1 hour ago",
    unread: false,
    type: "approval",
  },
];

export default function NotificationsDropdown({
  notifications = defaultNotifications,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-[18px] h-[18px]" />

          {notifications.some((n) => n.unread) && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e31d3b] rounded-full" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 overflow-hidden rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#ef7f1b]" />
            <h3 className="font-semibold text-sm">Notifications</h3>
          </div>

          <button className="text-xs text-[#ef7f1b] hover:underline">
            Mark all read
          </button>
        </div>

        {/* List */}
        <ScrollArea className="max-h-[420px]">
          <div className="p-2 space-y-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  className={`w-full text-left p-3 rounded-xl transition-colors border ${
                    notif.unread
                      ? "bg-orange-50/60 border-orange-100"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-black">
                          {notif.title}
                        </p>

                        {notif.unread && (
                          <div className="w-2 h-2 rounded-full bg-[#ef7f1b] mt-1 shrink-0" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notif.message}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-2">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t px-4 py-3 bg-gray-50">
          <button className="w-full text-sm font-medium text-[#ef7f1b] hover:underline">
            View all activity
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
