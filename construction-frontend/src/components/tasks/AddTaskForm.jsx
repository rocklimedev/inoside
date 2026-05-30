/* ====================== IMPORTS ====================== */
import React, { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

import { Plus, Loader2 } from "lucide-react";
import { useCreateTaskMutation } from "@/api/taskApi";
import { useGetUsersQuery } from "@/api/usersApi";

/* ====================== CONSTANTS ====================== */

const PRIORITIES = ["low", "medium", "high", "critical"];

const TASK_TYPES = [
  "General",
  "Bug",
  "Feature",
  "Enhancement",
  "Testing",
  "Documentation",
];

/* ====================== ADD TASK FORM ====================== */

export default function AddTaskForm({ projects = [], onSuccess }) {
  const [createTask] = useCreateTaskMutation();

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    project_id: "",
    module: "",
    assigned_to_user_id: "unassigned",
    due_date: "",
    priority: "medium",
    task_type: "General",
    description: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      project_id: "",
      module: "",
      assigned_to_user_id: "unassigned",
      due_date: "",
      priority: "medium",
      task_type: "General",
      description: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!form.project_id) {
      toast.error("Please select a project");
      return;
    }

    try {
      setSaving(true);

      await createTask({
        ...form,
        assigned_to_user_id:
          form.assigned_to_user_id === "unassigned"
            ? null
            : form.assigned_to_user_id,
      }).unwrap();

      toast.success("Task created successfully");

      resetForm();

      onSuccess?.();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Failed to create task",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 py-2">
      {/* TITLE */}
      <div>
        <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Task Title *
        </Label>

        <Input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Enter task title"
          className="mt-1"
        />
      </div>

      {/* PROJECT + USER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Project *
          </Label>

          <Select
            value={form.project_id}
            onValueChange={(value) => updateField("project_id", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>

            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Assigned To
          </Label>

          <Select
            value={form.assigned_to_user_id}
            onValueChange={(value) => updateField("assigned_to_user_id", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>

              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {usersLoading && (
            <p className="text-xs text-gray-400 mt-1">Loading users...</p>
          )}
        </div>
      </div>

      {/* MODULE */}
      <div>
        <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Module
        </Label>

        <Input
          value={form.module}
          onChange={(e) => updateField("module", e.target.value)}
          placeholder="Optional module name"
          className="mt-1"
        />
      </div>

      {/* PRIORITY / TYPE / DATE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Priority
          </Label>

          <Select
            value={form.priority}
            onValueChange={(value) => updateField("priority", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Type
          </Label>

          <Select
            value={form.task_type}
            onValueChange={(value) => updateField("task_type", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {TASK_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Due Date
          </Label>

          <Input
            type="date"
            value={form.due_date}
            onChange={(e) => updateField("due_date", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Description
        </Label>

        <Textarea
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Task description..."
          className="mt-1"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white px-8"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
