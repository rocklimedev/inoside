import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
export function TimelineView({ projects, onSelect }) {
  return (
    <div className="space-y-4">
      {projects.map((p) => {
        const stageIdx = STAGES.indexOf(p.stage); // Make sure STAGES is imported or passed
        return (
          <Card
            key={p.id}
            className="p-4 hover:shadow-md cursor-pointer"
            onClick={() => onSelect(p)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm text-gray-500">
                  {p.client_name} • {p.type}
                </p>
              </div>
              <Badge>{p.stage}</Badge>
            </div>
            <div className="flex gap-0.5">
              {STAGES.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded ${
                    i <= stageIdx ? "bg-[#ef7f1b]" : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
