import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ListView({ projects, onSelect }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-8 gap-2 px-4 py-3 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b">
        <span className="col-span-2">Project</span>
        <span>Client</span>
        <span>Stage</span>
        <span>Progress</span>
        <span>Type</span>
        <span>Location</span>
        <span>Status</span>
      </div>

      {projects.map((p) => (
        <div
          key={p.id}
          onClick={() => onSelect(p)}
          className="grid grid-cols-8 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-orange-50/30 cursor-pointer transition-colors items-center"
        >
          <div className="col-span-2 min-w-0">
            <p className="font-medium truncate">{p.name}</p>
          </div>
          <span className="text-gray-600 truncate text-xs">
            {p.client_name}
          </span>

          <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] h-[18px] border w-fit">
            {p.stage}
          </Badge>

          <div className="flex items-center gap-2">
            <Progress value={p.progress} className="h-1.5 flex-1" />
            <span className="text-xs font-bold">{p.progress}%</span>
          </div>

          <span className="text-xs text-gray-600">{p.type}</span>
          <span className="text-xs text-gray-500">{p.location}</span>

          <Badge className="text-[10px] h-[18px] border w-fit bg-green-50 text-green-700 border-green-200">
            {p.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
