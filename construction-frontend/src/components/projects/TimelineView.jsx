import { Badge } from "@/components/ui/badge";

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

export function TimelineView({ projects, onSelect }) {
  return (
    <div className="space-y-4">
      {projects.map((p) => {
        const stageIdx = STAGES.indexOf(p.stage);

        return (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm text-gray-500">
                  {p.client_name} • {p.type}
                </p>
              </div>
              <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200">
                {p.stage}
              </Badge>
            </div>

            <div className="flex gap-1">
              {STAGES.map((stage, i) => (
                <div key={i} className="flex-1">
                  <div
                    className={`h-2.5 rounded transition-all ${
                      i <= stageIdx ? "bg-[#ef7f1b]" : "bg-gray-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
