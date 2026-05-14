"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useGetClientsQuery } from "@/api/clientsApi"; // Adjust path
import { useCreateProjectMutation } from "@/api/projectsApi"; // Adjust path

export function CreateProjectModal({ open, onClose, onProjectCreated }) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: clients = [] } = useGetClientsQuery();

  const [form, setForm] = useState({
    name: "",
    client_id: "",
    project_type: "Interior Fit-out",
    service_type: "Interior",
    purpose: "Residential",
    approximate_area_sqft: "",
    number_of_floors: "",
    budget_range: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Project name is required");
    if (!form.client_id) return toast.error("Please select a client");

    try {
      const payload = {
        ...form,
        approximate_area_sqft: form.approximate_area_sqft
          ? Number(form.approximate_area_sqft)
          : null,
        number_of_floors: form.number_of_floors
          ? Number(form.number_of_floors)
          : null,
      };

      const result = await createProject(payload).unwrap();
      const newProjectId = result.id || result.data?.id;

      toast.success("Project created successfully!");

      // Pass new project ID back to selector
      onProjectCreated(newProjectId);

      // Reset form
      setForm({
        name: "",
        client_id: "",
        project_type: "Interior Fit-out",
        service_type: "Interior",
        purpose: "Residential",
        approximate_area_sqft: "",
        number_of_floors: "",
        budget_range: "",
        notes: "",
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Project Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Luxury Villa - Phase 1"
              required
            />
          </div>

          <div>
            <Label>Client *</Label>
            <Select
              value={form.client_id}
              onValueChange={(v) => setForm({ ...form, client_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Project Type *</Label>
              <Select
                value={form.project_type}
                onValueChange={(v) => setForm({ ...form, project_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Construction">
                    New Construction
                  </SelectItem>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                  <SelectItem value="Interior Fit-out">
                    Interior Fit-out
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Service Type</Label>
              <Select
                value={form.service_type}
                onValueChange={(v) => setForm({ ...form, service_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Purpose</Label>
            <Select
              value={form.purpose}
              onValueChange={(v) => setForm({ ...form, purpose: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Area (sqft)</Label>
              <Input
                type="number"
                value={form.approximate_area_sqft}
                onChange={(e) =>
                  setForm({ ...form, approximate_area_sqft: e.target.value })
                }
              />
            </div>
            <div>
              <Label>No. of Floors</Label>
              <Input
                type="number"
                value={form.number_of_floors}
                onChange={(e) =>
                  setForm({ ...form, number_of_floors: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label>Budget Range</Label>
            <Input
              value={form.budget_range}
              onChange={(e) =>
                setForm({ ...form, budget_range: e.target.value })
              }
              placeholder="e.g. 50L - 80L"
            />
          </div>

          <div>
            <Label>Notes / Remarks</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
