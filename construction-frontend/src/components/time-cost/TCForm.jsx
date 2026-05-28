"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ArrowLeft, Save, FileText, Loader2, DollarSign } from "lucide-react";

export default function TCForm({
  item,
  isNew,
  projectId,
  onBack,
  onGenerated,
  addCostEstimate,
  updateCostEstimate,
}) {
  const [form, setForm] = useState({ ...item });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const res = await addCostEstimate({ projectId, ...form }).unwrap();
        toast.success("Estimate created successfully");
        onGenerated(res);
      } else {
        await updateCostEstimate({ estimateId: item.id, ...form }).unwrap();
        toast.success("Saved successfully");
      }
    } catch {
      toast.error(isNew ? "Failed to create estimate" : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      let savedData;
      if (isNew) {
        savedData = await addCostEstimate({ projectId, ...form }).unwrap();
      } else {
        savedData = await updateCostEstimate({
          estimateId: item.id,
          ...form,
        }).unwrap();
      }
      toast.success("Document generated successfully");
      onGenerated(savedData);
    } catch {
      toast.error("Failed to generate document");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {saving ? "Saving..." : "All changes saved manually"}
            </span>
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {isNew ? "Create" : "Save"}
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
              Generate Document
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <DollarSign className="text-[#ef7f1b]" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Estimate Type *</Label>
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-3"
                  value={form.estimate_type}
                  onChange={(e) => update("estimate_type", e.target.value)}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Turnkey">Turnkey</option>
                  <option value="Constructional">Constructional</option>
                </select>
              </div>
              <div>
                <Label>Consultation Fee (₹)</Label>
                <Input
                  type="number"
                  value={form.consultation_fee || ""}
                  onChange={(e) =>
                    update("consultation_fee", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Tentative Total Cost (₹)</Label>
                <Input
                  type="number"
                  value={form.tentative_total_cost || ""}
                  onChange={(e) =>
                    update(
                      "tentative_total_cost",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                />
              </div>
            </div>
          </Card>

          {/* Material & Labour */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">
              Material & Labour Estimate
            </h3>
            <Textarea
              rows={12}
              value={JSON.stringify(
                form.material_labour_estimate || {},
                null,
                2,
              )}
              onChange={(e) => {
                try {
                  update(
                    "material_labour_estimate",
                    JSON.parse(e.target.value),
                  );
                } catch {}
              }}
              placeholder='{"items": [{"name": "Cement", "qty": 500, "unit": "bags", "rate": 350}]}'
            />
          </Card>

          {/* Payment Plan */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Payment Plan</h3>
            <Textarea
              rows={12}
              value={JSON.stringify(form.payment_plan || {}, null, 2)}
              onChange={(e) => {
                try {
                  update("payment_plan", JSON.parse(e.target.value));
                } catch {}
              }}
              placeholder='[{"milestone": "Advance", "percentage": 20, "amount": 500000}]'
            />
          </Card>

          {/* Attachments */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Attachments</h3>
            <div className="space-y-4">
              <div>
                <Label>Annexure URL</Label>
                <Input
                  value={form.annexure_url || ""}
                  onChange={(e) => update("annexure_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Contract URL</Label>
                <Input
                  value={form.contract_url || ""}
                  onChange={(e) => update("contract_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
