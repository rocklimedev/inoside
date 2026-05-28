"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";
import JsonInput from "./JsonInput";
import { useCreateScopeMutation } from "@/api/projectsApi";
import { useUpdateScopeMutation } from "@/api/projectsApi";
const SECTIONS = [
  {
    id: "summary",
    title: "Scope Summary",
    icon: FileText,
    fields: ["scope_summary"],
  },
  {
    id: "civil",
    title: "Civil Works",
    icon: "Briefcase",
    fields: ["civil_works"],
  },
  {
    id: "mep",
    title: "MEP Works",
    icon: "ClipboardList",
    fields: ["mep_works"],
  },
  {
    id: "interior",
    title: "Interior Works",
    icon: "Package",
    fields: ["interior_works"],
  },
  { id: "finishes", title: "Finishes", icon: "Check", fields: ["finishes"] },
  {
    id: "area",
    title: "Area Summary",
    icon: "Users",
    fields: ["area_summary"],
  },
];

export default function ScopeForm({
  item,
  projectId,
  isNew,
  onBack,
  onGenerated,
}) {
  const [form, setForm] = useState(item);
  const [open, setOpen] = useState({ summary: true });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [createScope] = useCreateScopeMutation();
  const [updateScope] = useUpdateScopeMutation();

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      let result;
      if (isNew) {
        result = await createScope({ projectId, body: form }).unwrap();
        toast.success("Scope created successfully");
      } else {
        result = await updateScope({ projectId, body: form }).unwrap();
        toast.success("Saved successfully");
      }

      setForm(result); // Update with real backend data
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      await save(); // First save/create

      // Optional: Call generate endpoint if you have separate logic
      const result = await updateScope({ projectId, body: form }).unwrap();

      toast.success("Document generated successfully");
      onGenerated(result);
    } catch (err) {
      console.error(err);
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const allFields = SECTIONS.flatMap((s) => s.fields);
  const filled = allFields.filter(
    (f) => form[f] && String(form[f]).trim(),
  ).length;
  const prog = Math.round((filled / allFields.length) * 100);

  const toggle = (id) => setOpen((p) => ({ ...p, [id]: !p[id] }));

  const fieldMap = {
    scope_summary: (
      <Textarea
        rows={4}
        value={form.scope_summary || ""}
        onChange={(e) => update("scope_summary", e.target.value)}
        placeholder="Enter overall scope summary..."
      />
    ),
    civil_works: (
      <JsonInput
        value={form.civil_works}
        onChange={(v) => update("civil_works", v)}
      />
    ),
    mep_works: (
      <JsonInput
        value={form.mep_works}
        onChange={(v) => update("mep_works", v)}
      />
    ),
    interior_works: (
      <JsonInput
        value={form.interior_works}
        onChange={(v) => update("interior_works", v)}
      />
    ),
    finishes: (
      <JsonInput
        value={form.finishes}
        onChange={(v) => update("finishes", v)}
      />
    ),
    area_summary: (
      <JsonInput
        value={form.area_summary}
        onChange={(v) => update("area_summary", v)}
      />
    ),
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold">Scope Of Work</h1>
              <p className="text-[11px] text-gray-400">Project Scope Module</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">
              {saving ? "Saving..." : "Draft"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={save}
              disabled={saving}
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generate}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 mr-1" />
              )}
              Generate Document
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Progress value={prog} className="h-1.5 flex-1" />
          <span className="text-xs font-bold text-gray-500">{prog}%</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = open[section.id] ?? true;
            const filledFields = section.fields.filter(
              (f) => form[f] && String(form[f]).trim(),
            ).length;
            const sectionProgress = Math.round(
              (filledFields / section.fields.length) * 100,
            );

            return (
              <Card key={section.id} className="overflow-hidden">
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${sectionProgress === 100 ? "bg-green-50 text-green-600" : "bg-orange-50 text-[#ef7f1b]"}`}
                    >
                      {sectionProgress === 100 ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{section.title}</h3>
                      <p className="text-[10px] text-gray-400">
                        {sectionProgress}% complete
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-4">
                    {section.fields.map((field) => (
                      <div key={field}>
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {field.replace(/_/g, " ")}
                        </Label>
                        <div className="mt-1">{fieldMap[field]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
