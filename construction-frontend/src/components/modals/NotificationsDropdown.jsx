"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  FolderOpen,
  AlertCircle,
  Activity,
  RefreshCw,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultNotifications = [
  {
    id: 1,
    title: "New client message",
    message: "Sarah Chen sent a message about project timeline",
    time: "2 min ago",
    unread: true,
    type: "message",
    category: "updates",
  },
  {
    id: 2,
    title: "Project Update",
    message: "Site photos uploaded for Project #8921",
    time: "15 min ago",
    unread: true,
    type: "project",
    category: "updates",
  },
  {
    id: 3,
    title: "Approval Required",
    message: "Client approved final design for Villa Phase 2",
    time: "1 hour ago",
    unread: false,
    type: "approval",
    category: "activity",
  },
  {
    id: 4,
    title: "System Activity",
    message: "Backup completed successfully",
    time: "2 hours ago",
    unread: false,
    type: "alert",
    category: "activity",
  },
];

const typeIcon = {
  message: MessageSquare,
  project: FolderOpen,
  approval: CheckCheck,
  alert: AlertCircle,
};

export default function NotificationsDropdown({
  notifications = defaultNotifications,
}) {
  const [tab, setTab] = useState("all");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    return notifications.filter((n) => n.category === tab);
  }, [tab, notifications]);

  return (
    <DropdownMenu>
      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5 text-muted-foreground" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* PANEL */}
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
          w-[92vw]
          sm:w-[420px]
          max-w-[95vw]

          p-0
          overflow-hidden

          rounded-2xl
          border
          shadow-xl
        "
      >
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Bell className="w-4 h-4 text-orange-500" />

            <p className="font-semibold text-sm truncate">Activity Center</p>

            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs shrink-0">
                {unreadCount}
              </Badge>
            )}
          </div>

          <Button variant="ghost" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* TABS */}
        <div className="px-2 pt-2">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* LIST (FIXED HEIGHT + SAFE SCROLL) */}
        <div className="max-h-[60vh] overflow-y-auto mt-2">
          <div className="p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No items in this section
              </div>
            ) : (
              filtered.map((notif) => {
                const Icon = typeIcon[notif.type] || Activity;

                return (
                  <button
                    key={notif.id}
                    className={`
                      w-full text-left flex gap-3 p-3 rounded-xl transition
                      ${
                        notif.unread
                          ? "bg-orange-50 border border-orange-100"
                          : "hover:bg-muted border border-transparent"
                      }
                    `}
                  >
                    {/* ICON */}
                    <div className="p-2 rounded-lg bg-muted h-fit">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">
                          {notif.title}
                        </p>

                        {notif.unread && (
                          <span className="w-2 h-2 mt-1 rounded-full bg-orange-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notif.message}
                      </p>

                      <p className="text-[11px] text-muted-foreground mt-2">
                        {notif.time}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* FOOTER */}
        <Separator />

        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-sm text-orange-500 hover:text-orange-600"
          >
            View full activity log
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
