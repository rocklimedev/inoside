"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Task categories (add this if not already defined elsewhere)
const TASK_CATEGORIES = [
  "General",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Carpentry",
  "Painting",
  "Flooring",
  "Tiling",
  "Masonry",
  "Inspection",
  // Add more as needed
];

export default function AddTaskForm({
  api,
  projectId,
  projectName,
  onSuccess,
}) {
  const [form, setForm] = useState({
    title: "",
    category: "General",
    priority: "medium",
    assigned_to: "",
    deadline: "",
    area_floor: "",
    status: "todo",
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title required");
      return;
    }

    setSaving(true);

    try {
      const r = await api.post("/execution/tasks", {
        ...form,
        project_id: projectId,
        project_name: projectName,
      });

      toast.success("Task added successfully");
      onSuccess(r.data);

      // Optional: reset form after success
      setForm({
        title: "",
        category: "General",
        priority: "medium",
        assigned_to: "",
        deadline: "",
        area_floor: "",
        status: "todo",
      });
    } catch (error) {
      toast.error("Failed to add task");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 py-2">
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Task Name *
        </Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="mt-1"
          data-testid="task-title-input"
          placeholder="Enter task name"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Category
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Priority
          </Label>
          <Select
            value={form.priority}
            onValueChange={(v) => setForm((p) => ({ ...p, priority: v }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Assigned To
          </Label>
          <Input
            value={form.assigned_to}
            onChange={(e) =>
              setForm((p) => ({ ...p, assigned_to: e.target.value }))
            }
            className="mt-1"
            placeholder="Team member name"
          />
        </div>

        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Deadline
          </Label>
          <Input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              setForm((p) => ({ ...p, deadline: e.target.value }))
            }
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Area / Floor
        </Label>
        <Input
          value={form.area_floor}
          onChange={(e) =>
            setForm((p) => ({ ...p, area_floor: e.target.value }))
          }
          className="mt-1"
          placeholder="e.g. Floor 3, Zone B"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="task-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          Add Task
        </Button>
      </div>
    </div>
  );
}
