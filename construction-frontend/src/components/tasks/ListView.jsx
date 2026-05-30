"use client";

/* ====================== IMPORTS ====================== */
import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { ListTodo, Calendar, User } from "lucide-react";

/* ====================== CONFIGS ====================== */

const STATUS_CONFIG = {
  todo: { label: "To Do", color: "bg-gray-100 text-gray-700" },
  in_progress: { label: "In Progress", color: "bg-blue-50 text-blue-700" },
  review: { label: "Review", color: "bg-purple-50 text-purple-700" },
  completed: { label: "Completed", color: "bg-green-50 text-green-700" },
  blocked: { label: "Blocked", color: "bg-red-50 text-red-700" },
};

const PRIORITY_CONFIG = {
  low: { color: "bg-gray-100 text-gray-600" },
  medium: { color: "bg-yellow-50 text-yellow-700" },
  high: { color: "bg-orange-50 text-orange-700" },
  urgent: { color: "bg-red-50 text-red-700" },
};

/* ====================== COMPONENT ====================== */

export default function ListView({ tasks = [], onStatusChange, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <ListTodo className="w-12 h-12 text-gray-200 mb-4" />

        <p className="text-gray-500 font-medium">No tasks found</p>

        <p className="text-sm text-gray-400 mt-1">
          Try changing filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl border bg-white">
          {/* ================= HEADER (DESKTOP ONLY) ================= */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div className="col-span-4">Task</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Assigned</div>
            <div className="col-span-1">Due</div>
          </div>

          {/* ================= TASK ROWS ================= */}
          {tasks.map((task) => {
            const priority =
              PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

            const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;

            const isOverdue =
              task?.due_date &&
              task.due_date < new Date().toISOString().slice(0, 10) &&
              task.status !== "completed";

            return (
              <div
                key={task.id}
                className="
                  border-b last:border-0
                  hover:bg-muted/20 transition-colors
                  p-4
                  flex flex-col gap-3
                  md:grid md:grid-cols-12 md:gap-4 md:items-center
                "
              >
                {/* ================= TASK ================= */}
                <div className="md:col-span-4 min-w-0">
                  <p className="font-medium truncate">{task.title}</p>

                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* ================= MOBILE META ================= */}
                <div className="flex flex-wrap gap-2 md:hidden">
                  <Badge className={priority.color}>{task.priority}</Badge>

                  <Badge className={status.color}>{status.label}</Badge>

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {task?.assignedUser?.name || "-"}
                  </span>

                  <span
                    className={`text-xs flex items-center gap-1 ${
                      isOverdue
                        ? "text-red-600 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    {task?.due_date || "-"}
                  </span>
                </div>

                {/* ================= PROJECT (DESKTOP) ================= */}
                <div className="md:col-span-2 text-sm hidden md:block">
                  <div>{task?.project?.name || "-"}</div>

                  {task?.module && (
                    <div className="text-xs text-muted-foreground">
                      {task.module}
                    </div>
                  )}
                </div>

                {/* ================= PRIORITY (DESKTOP) ================= */}
                <div className="md:col-span-1 hidden md:block">
                  <Badge className={priority.color}>{task.priority}</Badge>
                </div>

                {/* ================= STATUS (DESKTOP) ================= */}
                <div className="md:col-span-2 hidden md:block">
                  <Badge className={status.color}>{status.label}</Badge>
                </div>

                {/* ================= ASSIGNED (DESKTOP) ================= */}
                <div className="md:col-span-2 hidden md:flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {task?.assignedUser?.name || "-"}
                </div>

                {/* ================= DUE (DESKTOP) ================= */}
                <div
                  className={`md:col-span-1 hidden md:flex items-center gap-1 text-sm ${
                    isOverdue ? "text-red-600 font-medium" : ""
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {task?.due_date || "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
