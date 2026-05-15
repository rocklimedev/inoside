import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";

export function GridView({ projects, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((p) => (
        <Card
          key={p.id}
          className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group"
          onClick={() => onSelect(p)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">{p.name}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                {p.client_name}
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#ef7f1b]" />
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] h-[18px] border font-medium">
              {p.stage}
            </Badge>
            <span className="text-[10px] text-gray-400">{p.type}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Progress value={p.progress} className="h-1.5 flex-1" />
            <span className="text-[10px] font-bold text-gray-500">
              {p.progress}%
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
