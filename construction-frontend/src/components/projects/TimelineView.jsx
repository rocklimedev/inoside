import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  selectedIds = [],
  onToggleSelect,
  actions,
}) {
  return (
    <div className="space-y-4">
      {projects.map((p) => {
        const stageIdx = STAGES.indexOf(p.stage);
        const isSelected = selectedIds.includes(p.id);

        return (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className={`
              relative bg-white border rounded-lg p-4 md:p-5
              cursor-pointer transition
              hover:shadow-md
              ${isSelected ? "border-[#ef7f1b] bg-orange-50/50" : ""}
            `}
          >
            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-start gap-3 pr-8 pl-8 md:pl-10">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm md:text-base truncate">
                  {p.name}
                </h3>

                <p className="text-xs text-gray-500 truncate">
                  {p.client_name} • {p.type}
                </p>

                {p.location && p.location !== "—" && (
                  <p className="text-[11px] text-gray-400 truncate">
                    📍 {p.location}
                  </p>
                )}
              </div>

              <Badge className="text-[10px] bg-orange-50 text-[#ef7f1b] border-orange-200 shrink-0">
                {p.stage}
              </Badge>
            </div>

            {/* ================= CHECKBOX ================= */}
            <div
              className="absolute top-4 right-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(p.id)}
              />
            </div>

            {/* ================= MENU ================= */}
            <div
              className="absolute top-4 left-4"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuItem onClick={() => actions.onView(p)}>
                    <Eye className="w-4 h-4 mr-2" /> View
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => actions.onEdit(p)}>
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => actions.onMoveNext(p)}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Next Stage
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => actions.onDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ================= DESKTOP TIMELINE ================= */}
            <div className="hidden md:flex gap-1.5 mt-4">
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex-1 flex flex-col items-center">
                  <div
                    className={`h-3 w-full rounded-full transition ${
                      i <= stageIdx ? "bg-[#ef7f1b]" : "bg-gray-100"
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-1.5 ${
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

            {/* ================= MOBILE PROGRESS ================= */}
            <div className="md:hidden mt-4 space-y-2">
              {/* Simple progress bar */}
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ef7f1b]"
                  style={{
                    width: `${((stageIdx + 1) / STAGES.length) * 100}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-gray-500">
                <span>
                  Stage {stageIdx + 1} / {STAGES.length}
                </span>
                <span className="font-semibold text-[#ef7f1b]">
                  {p.progress}%
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* EMPTY STATE */}
      {projects.length === 0 && (
        <div className="text-center py-14 text-gray-500">
          No projects found matching your criteria.
        </div>
      )}
    </div>
  );
}
