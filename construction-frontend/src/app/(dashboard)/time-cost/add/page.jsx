"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";

import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";

import { useGetProjectsQuery } from "@/api/projectsApi";

import {
  useAddCostEstimateMutation,
  useUpdateCostEstimateMutation,
} from "@/api/projects/costEstimatesApi";

export default function TCForm({ item, isNew, projectId }) {
  const router = useRouter();

  const [addCostEstimate] = useAddCostEstimateMutation();
  const [updateCostEstimate] = useUpdateCostEstimateMutation();

  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();

  const [form, setForm] = useState({
    ...item,
    project_id: item?.project_id || projectId || "",
    estimate_type: item?.estimate_type || "Consultation",

    material_labour_estimate: item?.material_labour_estimate?.length
      ? item.material_labour_estimate
      : [{ title: "", description: "" }],

    payment_plan: item?.payment_plan?.length
      ? item.payment_plan
      : [{ title: "", description: "" }],
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    router.push(`/projects/${form.project_id}/time-cost`);
  };

  const handleSave = async () => {
    if (!form.project_id) {
      toast.error("Please select a project");
      return;
    }

    setSaving(true);

    try {
      if (isNew) {
        const res = await addCostEstimate({
          projectId: form.project_id,
          ...form,
        }).unwrap();

        toast.success("Estimate created successfully");
        router.push(`/time-cost/${res.id}?projectId=${form.project_id}`);
      } else {
        await updateCostEstimate({
          estimateId: item.id,
          ...form,
        }).unwrap();

        toast.success("Saved successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        isNew ? "Failed to create estimate" : "Failed to save estimate",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!form.project_id) {
      toast.error("Please select a project");
      return;
    }

    setGenerating(true);

    try {
      let saved;

      if (isNew) {
        saved = await addCostEstimate({
          projectId: form.project_id,
          ...form,
        }).unwrap();
      } else {
        saved = await updateCostEstimate({
          estimateId: item.id,
          ...form,
        }).unwrap();
      }

      toast.success("Document generated successfully");
      router.push(`/time-cost/${saved.id}?projectId=${form.project_id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate document");
    } finally {
      setGenerating(false);
    }
  };

  // ---------- MATERIAL & LABOUR ----------
  const updateML = (index, key, value) => {
    const updated = [...form.material_labour_estimate];
    updated[index][key] = value;
    update("material_labour_estimate", updated);
  };

  const addML = () => {
    update("material_labour_estimate", [
      ...form.material_labour_estimate,
      { title: "", description: "" },
    ]);
  };

  const removeML = (index) => {
    update(
      "material_labour_estimate",
      form.material_labour_estimate.filter((_, i) => i !== index),
    );
  };

  // ---------- PAYMENT PLAN ----------
  const updatePP = (index, key, value) => {
    const updated = [...form.payment_plan];
    updated[index][key] = value;
    update("payment_plan", updated);
  };

  const addPP = () => {
    update("payment_plan", [
      ...form.payment_plan,
      { title: "", description: "" },
    ]);
  };

  const removePP = (index) => {
    update(
      "payment_plan",
      form.payment_plan.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* HEADER */}
      <div className="p-6 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {saving ? "Saving..." : "All changes saved manually"}
            </span>

            <Button variant="outline" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isNew ? "Create" : "Save"}
            </Button>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-8">
          {/* PROJECT INFO */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#ef7f1b]" />
              Basic Info
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Project</Label>
                <select
                  className="w-full mt-2 border p-3 rounded-md"
                  value={form.project_id}
                  onChange={(e) => update("project_id", e.target.value)}
                  disabled={projectsLoading}
                >
                  <option value="">
                    {projectsLoading ? "Loading..." : "Select Project"}
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.project_name || p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Estimate Type</Label>
                <select
                  className="w-full mt-2 border p-3 rounded-md"
                  value={form.estimate_type}
                  onChange={(e) => update("estimate_type", e.target.value)}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Turnkey">Turnkey</option>
                  <option value="Constructional">Constructional</option>
                </select>
              </div>

              <div>
                <Label>Consultation Fee</Label>
                <Input
                  type="number"
                  className="mt-2"
                  value={form.consultation_fee || ""}
                  onChange={(e) =>
                    update("consultation_fee", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Total Cost</Label>
                <Input
                  type="number"
                  className="mt-2"
                  value={form.tentative_total_cost || ""}
                  onChange={(e) =>
                    update("tentative_total_cost", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </Card>

          {/* MATERIAL & LABOUR */}
          <Card className="p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Material & Labour</h3>
              <Button onClick={addML}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-4">
              {form.material_labour_estimate.map((item, i) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <Input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updateML(i, "title", e.target.value)}
                  />

                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateML(i, "description", e.target.value)}
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeML(i)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* PAYMENT PLAN */}
          <Card className="p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Payment Plan</h3>
              <Button onClick={addPP}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-4">
              {form.payment_plan.map((item, i) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <Input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updatePP(i, "title", e.target.value)}
                  />

                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updatePP(i, "description", e.target.value)}
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePP(i)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
