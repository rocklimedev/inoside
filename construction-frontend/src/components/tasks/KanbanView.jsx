"use client";

/* ====================== IMPORTS ====================== */
import React, { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import SortableTaskCard from "./SortableTaskCard";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const STATUSES = ["todo", "in_progress", "review", "completed", "blocked"];

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

export default function KanbanView({ tasks = [], onStatusChange, onDelete }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const taskMap = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      map[String(task.id)] = task;
    });
    return map;
  }, [tasks]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = taskMap[String(active.id)];
    if (!activeTask) return;

    let newStatus = over.id;

    if (!STATUSES.includes(newStatus)) {
      const overTask = taskMap[String(over.id)];
      if (!overTask) return;
      newStatus = overTask.status;
    }

    if (newStatus !== activeTask.status) {
      onStatusChange?.(activeTask.id, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      {/* ================= OUTER SCROLL ================= */}
      <div className="flex-1 overflow-x-auto pb-6">
        <div
          className="
            flex gap-3 md:gap-4 p-3 md:p-4
            min-w-max md:min-w-0
          "
        >
          {STATUSES.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const columnTasks = tasks.filter((task) => task.status === status);

            return (
              <div
                key={status}
                id={status}
                className="
                  flex flex-col shrink-0
                  w-[85vw] sm:w-72 md:w-80
                  max-w-[340px]
                "
              >
                {/* ================= HEADER ================= */}
                <div
                  className={`
                    px-4 py-3
                    rounded-t-2xl border
                    flex items-center justify-between
                    sticky top-0 z-10
                    ${cfg.header}
                  `}
                >
                  <span className="font-semibold text-sm">{cfg.label}</span>

                  <Badge className={`${cfg.color} text-xs`}>
                    {columnTasks.length}
                  </Badge>
                </div>

                {/* ================= DROP ZONE ================= */}
                <div
                  id={status}
                  className="
                    flex-1 bg-gray-50/70
                    rounded-b-2xl border border-t-0
                    min-h-[60vh] md:min-h-[500px]
                  "
                >
                  <ScrollArea className="h-[70vh] md:h-full p-2">
                    <SortableContext
                      items={columnTasks.map((t) => String(t.id))}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3 pb-4">
                        {columnTasks.length === 0 ? (
                          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                            Drop task here
                          </div>
                        ) : (
                          columnTasks.map((task) => (
                            <div
                              key={task.id}
                              className="
                                touch-manipulation
                                active:scale-[0.98]
                                transition-transform
                              "
                            >
                              <SortableTaskCard
                                task={task}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </ScrollArea>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DndContext>
  );
}
