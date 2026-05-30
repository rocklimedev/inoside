import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

export function ListView({
  projects,
  onSelect,
  selectedIds,
  onToggleSelect,
  actions,
}) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* ================= DESKTOP TABLE HEADER ================= */}
      <div className="hidden md:grid grid-cols-10 gap-2 px-4 py-3 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b">
        <div className="w-8"></div>
        <span className="col-span-2">Project</span>
        <span>Client</span>
        <span>Stage</span>
        <span>Progress</span>
        <span>Type</span>
        <span>Location</span>
        <span>Status</span>
        <span className="text-right pr-2">Actions</span>
      </div>

      {/* ================= LIST ================= */}
      <div className="divide-y">
        {projects.map((p) => {
          const isSelected = selectedIds.includes(p.id);

          return (
            <div key={p.id}>
              {/* ================= DESKTOP ROW ================= */}
              <div
                onClick={() => onSelect(p)}
                className={`
                  hidden md:grid grid-cols-10 gap-2 px-4 py-3
                  items-center cursor-pointer hover:bg-orange-50/30
                  ${isSelected ? "bg-orange-50/60" : ""}
                `}
              >
                {/* Checkbox */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(p.id)}
                  />
                </div>

                {/* Project */}
                <div className="col-span-2 min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                </div>

                <span className="text-xs text-gray-600 truncate">
                  {p.client_name}
                </span>

                <Badge className="text-[10px] w-fit bg-orange-50 text-[#ef7f1b] border-orange-200">
                  {p.stage}
                </Badge>

                <div className="flex items-center gap-2 pr-4">
                  <Progress value={p.progress} className="h-1.5 flex-1" />
                  <span className="text-xs font-bold">{p.progress}%</span>
                </div>

                <span className="text-xs text-gray-600">{p.type}</span>

                <span className="text-xs text-gray-500 truncate">
                  {p.location}
                </span>

                <Badge
                  className={`text-[10px] w-fit ${
                    p.status === "Active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : p.status === "Delayed"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {p.status}
                </Badge>

                {/* Actions */}
                <div
                  className="flex justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => actions.onView(p)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => actions.onEdit(p)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => actions.onMoveNext(p)}>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Next Stage
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => actions.onDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* ================= MOBILE CARD ================= */}
              <div
                onClick={() => onSelect(p)}
                className={`
                  md:hidden p-4 space-y-3 cursor-pointer
                  ${isSelected ? "bg-orange-50/60" : ""}
                `}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect(p.id)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {p.client_name}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => actions.onView(p)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => actions.onEdit(p)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => actions.onMoveNext(p)}>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Next Stage
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => actions.onDelete(p.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="text-[10px] bg-orange-50 text-[#ef7f1b] border-orange-200">
                    {p.stage}
                  </Badge>

                  <Badge
                    className={`text-[10px] ${
                      p.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : p.status === "Delayed"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {p.status}
                  </Badge>

                  <span className="text-xs text-gray-500">{p.type}</span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                  <Progress value={p.progress} className="h-1.5 flex-1" />
                  <span className="text-xs font-semibold">{p.progress}%</span>
                </div>

                {/* Location */}
                <p className="text-xs text-gray-500 truncate">
                  📍 {p.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {projects.length === 0 && (
        <div className="p-12 text-center text-gray-500">No projects found.</div>
      )}
    </div>
  );
}
