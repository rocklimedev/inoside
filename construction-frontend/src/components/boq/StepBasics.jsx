// components/boq/StepBasics.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StepBasics({ project, update, onCity }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">
          Project Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={project.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Modern 3BHK Villa - Phase 1"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="client_name">Client Name</Label>
        <Input
          id="client_name"
          value={project.client_name}
          onChange={(e) => update({ client_name: e.target.value })}
          placeholder="Mr. Rajesh Sharma"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Project Type</Label>
          <Select
            value={project.project_type}
            onValueChange={(v) => update({ project_type: v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="renovation">Renovation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Location / City</Label>
          <Select value={project.location} onValueChange={onCity}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tier 1 / Metro">Tier 1 / Metro</SelectItem>
              <SelectItem value="Tier 2 / Other">Tier 2 / Other</SelectItem>
              <SelectItem value="Tier 3 / Rural">Tier 3 / Rural</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Notes / Special Requirements</Label>
        <Textarea
          value={project.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Any special instructions..."
          className="mt-1 h-24"
        />
      </div>
    </div>
  );
}
