import { Card } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((p) => {
        const isSelected = selectedIds.includes(p.id);

        return (
          <Card
            key={p.id}
            className={`p-4 hover:shadow-lg transition-all cursor-pointer group relative border ${
              isSelected
                ? "border-[#ef7f1b] bg-orange-50/50"
                : "hover:border-[#ef7f1b]/20"
            }`}
            onClick={() => onSelect(p)}
          >
            {/* Checkbox */}
            <div
              className="absolute top-3 right-3 z-20"
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
              className="absolute top-3 left-3 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-gray-600"
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

            <div className="flex items-start justify-between mb-2 pt-8">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold truncate">{p.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {p.client_name}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#ef7f1b] flex-shrink-0 mt-0.5" />
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] h-[18px] border font-medium">
                {p.stage}
              </Badge>
              <span className="text-[10px] text-gray-400">{p.type}</span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Progress value={p.progress} className="h-1.5 flex-1" />
              <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">
                {p.progress}%
              </span>
            </div>

            {/* Location */}
            {p.location && p.location !== "—" && (
              <p className="text-[10px] text-gray-500 mt-2 line-clamp-1">
                📍 {p.location}
              </p>
            )}
          </Card>
        );
      })}

      {projects.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No projects found.
        </div>
      )}
    </div>
  );
}
