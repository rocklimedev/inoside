"use client";

import { useState, useMemo } from "react";
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

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
} from "@/api/notificationApi";

const typeIcon = {
  message: MessageSquare,
  project: FolderOpen,
  approval: CheckCheck,
  alert: AlertCircle,
};

export default function NotificationsDropdown() {
  const [tab, setTab] = useState("all");

  // ================= RTK QUERIES =================
  const { data: notifications = [], refetch } = useGetNotificationsQuery();

  const { data: unreadCount = 0 } = useGetUnreadCountQuery();

  const [markAsRead] = useMarkAsReadMutation();

  // ================= FILTER =================
  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    return notifications.filter((n) => n.category === tab);
  }, [tab, notifications]);

  // ================= HANDLER =================
  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (err) {
      console.error(err);
    }
  };

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
        className="w-[92vw] sm:w-[420px] max-w-[95vw] p-0 overflow-hidden rounded-2xl border shadow-xl"
      >
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-500" />
            <p className="font-semibold text-sm">Activity Center</p>

            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* TABS */}
        <div className="px-2 pt-2">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* LIST */}
        <div className="max-h-[60vh] overflow-y-auto mt-2">
          <div className="p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              filtered.map((notif) => {
                const Icon = typeIcon[notif.type] || Activity;

                return (
                  <button
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id)}
                    className={`w-full text-left flex gap-3 p-3 rounded-xl transition ${
                      notif.is_read
                        ? "hover:bg-muted"
                        : "bg-orange-50 border border-orange-100"
                    }`}
                  >
                    {/* ICON */}
                    <div className="p-2 rounded-lg bg-muted h-fit">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{notif.title}</p>

                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 mt-1" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
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

        <Separator />

        <div className="p-2">
          <Button variant="ghost" className="w-full text-sm text-orange-500">
            View full activity log
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
