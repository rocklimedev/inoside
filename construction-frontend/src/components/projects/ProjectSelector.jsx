"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useGetProjectsQuery } from "@/api/projectsApi";
import { CreateProjectModal } from "./CreateProjectModal"; // ← Import

export function ProjectSelector({ value, onChange, disabled = false }) {
  const { data: projects = [], isLoading, refetch } = useGetProjectsQuery();
  const [modalOpen, setModalOpen] = useState(false);

  const handleProjectCreated = (newProjectId) => {
    onChange(newProjectId); // Auto-select the new project
    refetch(); // Refresh project list
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Select Project</h3>
          <p className="text-sm text-muted-foreground">
            Choose the project for this BOQ
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Project *</Label>
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
                {project.site?.name && ` • ${project.site.name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        )}
      </div>

      {/* Modal */}
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </Card>
  );
}
