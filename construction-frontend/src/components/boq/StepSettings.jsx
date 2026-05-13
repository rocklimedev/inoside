// components/boq/StepSettings.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function StepSettings({ project, update }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Include Labor Cost</Label>
          <Switch
            checked={project.include_labor}
            onCheckedChange={(v) => update({ include_labor: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Include GST</Label>
          <Switch
            checked={project.include_gst}
            onCheckedChange={(v) => update({ include_gst: v })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>GST (%) </Label>
          <Input
            type="number"
            value={project.gst_percent}
            onChange={(e) => update({ gst_percent: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label>Contingency (%)</Label>
          <Input
            type="number"
            value={project.contingency_percent}
            onChange={(e) =>
              update({ contingency_percent: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <Label>Wastage (%)</Label>
          <Input
            type="number"
            value={project.wastage_percent}
            onChange={(e) =>
              update({ wastage_percent: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <Label>Contractor Markup (%)</Label>
          <Input
            type="number"
            value={project.contractor_markup_percent}
            onChange={(e) =>
              update({ contractor_markup_percent: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
}
