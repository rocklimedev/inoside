import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRight } from "lucide-react";

export function GridView({ projects, onSelect, selectedIds, onToggleSelect }) {
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
              className="absolute top-3 right-3 z-10"
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(p.id)}
                className="bg-white border-gray-300 data-[state=checked]:bg-[#ef7f1b] data-[state=checked]:border-[#ef7f1b]"
              />
            </div>

            <div className="flex items-start justify-between mb-2 pr-8">
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
    </div>
  );
}
