/* ====================== IMPORTS ====================== */
import React from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Trash2, User, Calendar } from "lucide-react";

/* ====================== CONFIGS ====================== */

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    color: "bg-gray-100 text-gray-700",
    header: "bg-gray-50 border-gray-200",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-50 text-blue-700",
    header: "bg-blue-50 border-blue-200",
  },
  review: {
    label: "Review",
    color: "bg-purple-50 text-purple-700",
    header: "bg-purple-50 border-purple-200",
  },
  completed: {
    label: "Completed",
    color: "bg-green-50 text-green-700",
    header: "bg-green-50 border-green-200",
  },
  blocked: {
    label: "Blocked",
    color: "bg-red-50 text-[#e31d3b]",
    header: "bg-red-50 border-red-200",
  },
};

const PRIORITY_CONFIG = {
  low: { color: "bg-gray-100 text-gray-600" },
  medium: { color: "bg-yellow-50 text-yellow-700" },
  high: { color: "bg-orange-50 text-[#ef7f1b]" },
  urgent: { color: "bg-red-50 text-[#e31d3b]" },
};

const STATUSES = ["todo", "in_progress", "review", "completed", "blocked"];

/* ====================== TASK CARD ====================== */

export default function TaskCard({
  task,
  onDelete,
  onStatusChange,
  listMode = false,
}) {
  const pcfg = PRIORITY_CONFIG?.[task?.priority] || PRIORITY_CONFIG.medium;

  const scfg = STATUS_CONFIG?.[task?.status] || STATUS_CONFIG.todo;

  const isOverdue =
    task?.due_date &&
    task.due_date < new Date().toISOString().slice(0, 10) &&
    task.status !== "completed";

  return (
    <Card
      className={`p-4 ${listMode ? "flex items-center gap-4" : ""} ${
        isOverdue ? "border-red-300" : ""
      } hover:shadow-md transition-all active:scale-[0.985]`}
    >
      <div className={`flex-1 min-w-0 ${listMode ? "space-y-2" : ""}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm leading-tight line-clamp-2">
            {task?.title}
          </h4>

          <button
            type="button"
            onClick={() => onDelete?.(task?.id)}
            className="text-gray-300 hover:text-red-500 p-1 -mr-1 -mt-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Project */}
        {task?.project?.name && (
          <p className="text-xs text-gray-500">
            {task.project.name}
            {task?.module && ` · ${task.module}`}
          </p>
        )}

        {/* Description */}
        {task?.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge className={`${pcfg.color} text-xs font-medium`}>
            {task?.priority || "medium"}
          </Badge>

          <Badge className={`${scfg.color} text-xs font-medium`}>
            {scfg.label}
          </Badge>

          {task?.task_type && task.task_type !== "General" && (
            <Badge variant="outline" className="text-xs">
              {task.task_type}
            </Badge>
          )}

          {isOverdue && (
            <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
              Overdue
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
          <div className="flex flex-wrap items-center gap-3">
            {task?.assignedUser?.name && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {task.assignedUser.name}
              </span>
            )}

            {task?.due_date && (
              <span
                className={`flex items-center gap-1 ${
                  isOverdue ? "text-red-600 font-medium" : ""
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {task.due_date}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status Dropdown (List View Only) */}
      {listMode && (
        <Select
          value={task?.status || "todo"}
          onValueChange={(value) => onStatusChange?.(task?.id, value)}
        >
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_CONFIG[status]?.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </Card>
  );
}
