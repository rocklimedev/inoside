import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Eye, Edit3, ArrowRight, Trash2 } from "lucide-react";

export function ListView({
  projects,
  onSelect,
  selectedIds,
  onToggleSelect,
  actions,
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-10 gap-2 px-4 py-3 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b">
        <div className="w-8"></div> {/* Checkbox column */}
        <span className="col-span-2">Project</span>
        <span>Client</span>
        <span>Stage</span>
        <span>Progress</span>
        <span>Type</span>
        <span>Location</span>
        <span>Status</span>
        <span className="text-right pr-2">Actions</span>{" "}
        {/* New Actions Column */}
      </div>

      {/* Table Rows */}
      {projects.map((p) => {
        const isSelected = selectedIds.includes(p.id);

        return (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className={`grid grid-cols-10 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-orange-50/30 cursor-pointer transition-colors items-center ${
              isSelected ? "bg-orange-50/70" : ""
            }`}
          >
            {/* Checkbox */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(p.id)}
                className="bg-white border-gray-300 data-[state=checked]:bg-[#ef7f1b] data-[state=checked]:border-[#ef7f1b]"
              />
            </div>

            {/* Project Name */}
            <div className="col-span-2 min-w-0">
              <p className="font-medium truncate">{p.name}</p>
            </div>

            {/* Client */}
            <span className="text-gray-600 truncate text-xs">
              {p.client_name}
            </span>

            {/* Stage */}
            <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] h-[18px] border w-fit">
              {p.stage}
            </Badge>

            {/* Progress */}
            <div className="flex items-center gap-2 pr-4">
              <Progress value={p.progress} className="h-1.5 flex-1" />
              <span className="text-xs font-bold whitespace-nowrap">
                {p.progress}%
              </span>
            </div>

            {/* Type */}
            <span className="text-xs text-gray-600">{p.type}</span>

            {/* Location */}
            <span className="text-xs text-gray-500 truncate">{p.location}</span>

            {/* Status */}
            <Badge
              className={`text-[10px] h-[18px] border w-fit ${
                p.status === "Active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : p.status === "Delayed"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {p.status}
            </Badge>

            {/* Actions Dropdown */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex justify-end"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => actions.onView(p)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => actions.onEdit(p)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => actions.onMoveNext(p)}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Move to Next Stage
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => actions.onDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}

      {projects.length === 0 && (
        <div className="p-12 text-center text-gray-500">No projects found.</div>
      )}
    </div>
  );
}
