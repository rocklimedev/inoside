"use client";

import React, { useState, useEffect } from "react";
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
  Link as LinkIcon,
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
    project_id: item?.project_id || projectId || "",
    estimate_type: item?.estimate_type || "Consultation",
    consultation_fee: item?.consultation_fee || 0,
    tentative_total_cost: item?.tentative_total_cost || 0,
    material_labour_estimate: item?.material_labour_estimate?.length
      ? item.material_labour_estimate
      : [{ title: "", description: "", price: null }],
    payment_plan: item?.payment_plan?.length
      ? item.payment_plan
      : [{ title: "", description: "", amount: null }],
    annexure_url: item?.annexure_url || "",
    contract_url: item?.contract_url || "",
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Auto-calculate Tentative Total Cost
  useEffect(() => {
    const total = form.material_labour_estimate.reduce((sum, item) => {
      return sum + (Number(item?.price) || 0);
    }, 0);

    update("tentative_total_cost", total);
  }, [form.material_labour_estimate]);

  // Set initial project_id
  useEffect(() => {
    if (item?.project_id) {
      update("project_id", item.project_id);
    } else if (projectId && isNew) {
      update("project_id", projectId);
    }
  }, [item?.project_id, projectId, isNew]);

  const handleBack = () => {
    if (form.project_id) {
      router.push(`/projects/${form.project_id}/time-cost`);
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (!form.project_id) {
      toast.error("Please select a project");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form };

      let res;
      if (isNew === true) {
        // CREATE
        res = await addCostEstimate({
          projectId: form.project_id,
          ...payload,
        }).unwrap();

        toast.success("Estimate created successfully");
        router.push(`/time-cost/${res.id}?projectId=${form.project_id}`);
      } else {
        // UPDATE
        if (!item?.id) {
          toast.error("Cannot update: Estimate ID not found");
          return;
        }
        res = await updateCostEstimate({
          estimateId: item.id,
          ...payload,
        }).unwrap();

        toast.success("Estimate updated successfully");
      }
    } catch (err) {
      console.error("Save Error:", err);
      toast.error(err?.data?.message || "Operation failed");
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
      const payload = { ...form };
      let saved;

      if (isNew) {
        saved = await addCostEstimate(payload).unwrap();
      } else {
        if (!item?.id) {
          toast.error("Cannot generate: Estimate ID not found");
          return;
        }
        saved = await updateCostEstimate({ id: item.id, ...payload }).unwrap();
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

  // Material & Labour Handlers
  const updateML = (index, key, value) => {
    const updated = [...form.material_labour_estimate];
    updated[index] = { ...updated[index], [key]: value };
    update("material_labour_estimate", updated);
  };

  const addML = () => {
    update("material_labour_estimate", [
      ...form.material_labour_estimate,
      { title: "", description: "", price: null },
    ]);
  };

  const removeML = (index) => {
    update(
      "material_labour_estimate",
      form.material_labour_estimate.filter((_, i) => i !== index),
    );
  };

  // Payment Plan Handlers
  const updatePP = (index, key, value) => {
    const updated = [...form.payment_plan];
    updated[index] = { ...updated[index], [key]: value };
    update("payment_plan", updated);
  };

  const addPP = () => {
    update("payment_plan", [
      ...form.payment_plan,
      { title: "", description: "", amount: null },
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
              Generate Documents
            </Button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-8">
          {/* BASIC INFO */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#ef7f1b]" />
              Basic Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Project <span className="text-red-500">*</span>
                </Label>
                <select
                  className="w-full mt-2 border p-3 rounded-md focus:ring-2 focus:ring-[#ef7f1b]"
                  value={form.project_id}
                  onChange={(e) => update("project_id", e.target.value)}
                  disabled={!isNew && !!item?.project_id}
                >
                  <option value="">Select Project</option>
                  {projectsLoading ? (
                    <option disabled>Loading projects...</option>
                  ) : (
                    projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name || p.name}
                      </option>
                    ))
                  )}
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
                  value={form.consultation_fee}
                  onChange={(e) =>
                    update("consultation_fee", Number(e.target.value) || 0)
                  }
                />
              </div>

              <div>
                <Label>Tentative Total Cost (Auto Calculated)</Label>
                <Input
                  type="number"
                  className="mt-2 font-semibold"
                  value={form.tentative_total_cost}
                  onChange={(e) =>
                    update("tentative_total_cost", Number(e.target.value) || 0)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Automatically calculated from Material & Labour prices
                </p>
              </div>
            </div>
          </Card>

          {/* MATERIAL & LABOUR */}
          <Card className="p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Material & Labour Estimate</h3>
              <Button onClick={addML}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {form.material_labour_estimate.map((ml, i) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <div className="grid md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                      <Input
                        placeholder="Title (e.g., Concrete Work)"
                        value={ml.title || ""}
                        onChange={(e) => updateML(i, "title", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Input
                        type="number"
                        placeholder="Price"
                        value={ml.price ?? ""}
                        onChange={(e) =>
                          updateML(
                            i,
                            "price",
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-4">
                      <Input
                        placeholder="Description"
                        value={ml.description || ""}
                        onChange={(e) =>
                          updateML(i, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>

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
                Add Milestone
              </Button>
            </div>

            <div className="space-y-4">
              {form.payment_plan.map((pp, i) => (
                <div key={i} className="border p-4 rounded-md space-y-3">
                  <div className="grid md:grid-cols-12 gap-3">
                    <div className="md:col-span-4">
                      <Input
                        placeholder="Title (e.g., 30% Advance)"
                        value={pp.title || ""}
                        onChange={(e) => updatePP(i, "title", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={pp.amount ?? ""}
                        onChange={(e) =>
                          updatePP(
                            i,
                            "amount",
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-5">
                      <Input
                        placeholder="Description / Condition"
                        value={pp.description || ""}
                        onChange={(e) =>
                          updatePP(i, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>

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

          {/* DOCUMENTS */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Documents
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Annexure URL</Label>
                <Input
                  type="url"
                  className="mt-2"
                  placeholder="https://..."
                  value={form.annexure_url}
                  onChange={(e) => update("annexure_url", e.target.value)}
                />
              </div>

              <div>
                <Label>Contract URL</Label>
                <Input
                  type="url"
                  className="mt-2"
                  placeholder="https://..."
                  value={form.contract_url}
                  onChange={(e) => update("contract_url", e.target.value)}
                />
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
