// components/boq/StepDimensions.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepDimensions({ project, update }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>
            Built-up Area (sqft) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={project.built_up_area || ""}
            onChange={(e) => update({ built_up_area: Number(e.target.value) })}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Plot Area (sqft)</Label>
          <Input
            type="number"
            value={project.plot_area || ""}
            onChange={(e) => update({ plot_area: Number(e.target.value) })}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Floors</Label>
          <Input
            type="number"
            value={project.floors}
            onChange={(e) => update({ floors: Number(e.target.value) })}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Ceiling Height (ft)</Label>
          <Input
            type="number"
            value={project.ceiling_height}
            onChange={(e) => update({ ceiling_height: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
