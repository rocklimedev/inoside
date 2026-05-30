import { Card } from "@/components/ui/card";
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

import {
  MoreHorizontal,
  Eye,
  Edit3,
  ArrowRight,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

export function GridView({
  projects,
  onSelect,
  selectedIds,
  onToggleSelect,
  actions,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {projects.map((p) => {
        const isSelected = selectedIds.includes(p.id);

        return (
          <Card
            key={p.id}
            onClick={() => onSelect(p)}
            className={`
              relative cursor-pointer group transition-all border
              p-3 md:p-4
              hover:shadow-md
              ${
                isSelected
                  ? "border-[#ef7f1b] bg-orange-50/40"
                  : "hover:border-[#ef7f1b]/30"
              }
            `}
          >
            {/* Checkbox (bigger tap area on mobile) */}
            <div
              className="absolute top-2 right-2 md:top-3 md:right-3 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(p.id)}
                className="h-5 w-5 md:h-4 md:w-4 bg-white border-gray-300 data-[state=checked]:bg-[#ef7f1b] data-[state=checked]:border-[#ef7f1b]"
              />
            </div>

            {/* Actions Menu */}
            <div
              className="absolute top-2 left-2 md:top-3 md:left-3 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-7 md:w-7 text-gray-500"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-44">
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

            {/* Header */}
            <div className="pt-8 md:pt-10 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold truncate">{p.name}</h3>
                <p className="text-[11px] text-gray-400 truncate">
                  {p.client_name}
                </p>
              </div>

              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#ef7f1b] flex-shrink-0" />
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <Badge className="text-[10px] h-[18px] bg-orange-50 text-[#ef7f1b] border-orange-200">
                {p.stage}
              </Badge>

              <span className="text-[10px] text-gray-400">{p.type}</span>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mt-3">
              <Progress value={p.progress} className="h-1.5 flex-1" />
              <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                {p.progress}%
              </span>
            </div>

            {/* Location (hidden on very small screens if long) */}
            {p.location && p.location !== "—" && (
              <p className="text-[10px] text-gray-500 mt-2 line-clamp-1">
                📍 {p.location}
              </p>
            )}
          </Card>
        );
      })}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-500 text-sm">
          No projects found.
        </div>
      )}
    </div>
  );
}
