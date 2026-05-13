// components/boq/StepQuickArea.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StepQuickArea({ project, update }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>
          Built-up Area (sqft) <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          value={project.built_up_area || ""}
          onChange={(e) => update({ built_up_area: Number(e.target.value) })}
          placeholder="1200"
          className="mt-1 text-lg"
        />
      </div>

      <div>
        <Label>Quality Standard</Label>
        <Select
          value={project.quality}
          onValueChange={(v) => update({ quality: v })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="economy">Economy</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
