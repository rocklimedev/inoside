import { Badge } from "@/components/ui/badge";
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

const STAGES = [
  "Brief",
  "Pitch",
  "Site Reki",
  "Scope",
  "Time & Cost",
  "BOQ",
  "Design",
  "Execution",
  "Vendor",
  "Inventory",
  "Quality",
  "Handover",
];

export function TimelineView({
  projects,
  onSelect,
  selectedIds,
  onToggleSelect,
  actions,
}) {
  return (
    <div className="space-y-4">
      {projects.map((p) => {
        const stageIdx = STAGES.indexOf(p.stage);
        const isSelected = (selectedIds ?? []).includes(p.id);

        return (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className={`bg-white rounded-lg border p-5 hover:shadow-md cursor-pointer transition-all relative ${
              isSelected
                ? "border-[#ef7f1b] bg-orange-50/50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Checkbox */}
            <div
              className="absolute top-5 right-5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(p.id)}
                className="bg-white border-gray-300 data-[state=checked]:bg-[#ef7f1b] data-[state=checked]:border-[#ef7f1b]"
              />
            </div>

            {/* Actions Menu */}
            <div
              className="absolute top-5 left-5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
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

            <div className="flex justify-between items-start mb-4 pr-8 pl-10">
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {p.client_name} • {p.type}
                </p>
                {p.location && p.location !== "—" && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    📍 {p.location}
                  </p>
                )}
              </div>

              <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200">
                {p.stage}
              </Badge>
            </div>

            {/* Progress Timeline */}
            <div className="flex gap-1.5">
              {STAGES.map((stage, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`h-3 w-full rounded-full transition-all ${
                      i <= stageIdx ? "bg-[#ef7f1b]" : "bg-gray-100"
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-1.5 transition-colors ${
                      i <= stageIdx
                        ? "text-[#ef7f1b] font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Percentage */}
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-gray-500">Overall Progress</span>
              <span className="font-bold text-[#ef7f1b]">{p.progress}%</span>
            </div>
          </div>
        );
      })}

      {projects.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No projects found matching your criteria.
        </div>
      )}
    </div>
  );
}
