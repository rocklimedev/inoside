"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateScopeMutation,
  useUpdateScopeMutation,
  useGetScopeByIdQuery,
} from "@/api/projects/scopeApi";
import { useGetProjectsQuery } from "@/api/projectsApi";

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
    icon: FileText,
    fields: ["civil_works"],
  },
  { id: "mep", title: "MEP Works", icon: FileText, fields: ["mep_works"] },
  {
    id: "interior",
    title: "Interior Works",
    icon: FileText,
    fields: ["interior_works"],
  },
  { id: "finishes", title: "Finishes", icon: FileText, fields: ["finishes"] },
  {
    id: "area",
    title: "Area Summary",
    icon: FileText,
    fields: ["area_summary"],
  },
];

const emptyItems = [{ title: "", description: "" }];

export default function ScopeForm({ onBack, onGenerated }) {
  const searchParams = useSearchParams();
  const scopeId = searchParams.get("id");
  const projectIdFromUrl = searchParams.get("projectId");

  const isEdit = Boolean(scopeId);

  // Queries & Mutations
  const { data: scopeData, isLoading: isLoadingScope } = useGetScopeByIdQuery(
    scopeId,
    {
      skip: !isEdit,
    },
  );

  const { data: projects = [] } = useGetProjectsQuery();
  const [createScope] = useCreateScopeMutation();
  const [updateScope] = useUpdateScopeMutation();

  // Form State
  const [form, setForm] = useState({
    project_id: projectIdFromUrl || "",
    scope_summary: "",
    civil_works: [...emptyItems],
    mep_works: [...emptyItems],
    interior_works: [...emptyItems],
    finishes: [...emptyItems],
    area_summary: [...emptyItems],
  });

  const [open, setOpen] = useState({
    summary: true,
    civil: true,
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Populate form when editing and data is fetched
  useEffect(() => {
    if (isEdit && scopeData) {
      setForm({
        project_id: scopeData.project_id || projectIdFromUrl || "",
        scope_summary: scopeData.scope_summary || "",
        civil_works: scopeData.civil_works?.length
          ? scopeData.civil_works
          : [...emptyItems],
        mep_works: scopeData.mep_works?.length
          ? scopeData.mep_works
          : [...emptyItems],
        interior_works: scopeData.interior_works?.length
          ? scopeData.interior_works
          : [...emptyItems],
        finishes: scopeData.finishes?.length
          ? scopeData.finishes
          : [...emptyItems],
        area_summary: scopeData.area_summary?.length
          ? scopeData.area_summary
          : [...emptyItems],
      });
    }
  }, [scopeData, isEdit, projectIdFromUrl]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateJsonField = (field, index, key, value) => {
    const updated = [...(form[field] || [])];
    updated[index] = { ...updated[index], [key]: value };
    update(field, updated);
  };

  const addRow = (field) => {
    update(field, [...(form[field] || []), { title: "", description: "" }]);
  };

  const removeRow = (field, index) => {
    const updated = [...(form[field] || [])];
    updated.splice(index, 1);
    update(field, updated.length ? updated : [...emptyItems]);
  };

  const save = async () => {
    if (!form.project_id) {
      toast.error("Please select a project");
      return;
    }

    setSaving(true);
    try {
      let result;

      if (!isEdit) {
        result = await createScope({
          projectId: form.project_id,
          ...form,
        }).unwrap();
        toast.success("Scope created successfully");
      } else {
        result = await updateScope({
          projectId: form.project_id,
          ...form,
        }).unwrap();
        toast.success("Scope updated successfully");
      }

      onGenerated?.(result);
      return result;
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const result = await save();
      if (result) {
        toast.success("Document generated successfully");
        onGenerated?.(result);
      }
    } catch (err) {
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  // Progress Calculation
  const allFields = SECTIONS.flatMap((s) => s.fields);
  const filled = allFields.filter((f) => {
    const value = form[f];
    if (!value) return false;
    if (Array.isArray(value)) {
      return value.some((v) => v.title?.trim() || v.description?.trim());
    }
    return String(value).trim().length > 0;
  }).length;

  const prog = Math.round((filled / allFields.length) * 100);

  if (isEdit && isLoadingScope) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-black transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-black">
                {isEdit ? "Edit Scope Of Work" : "New Scope Of Work"}
              </h1>
              <p className="text-xs text-gray-400">Project Scope Module</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={save}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>

            <Button
              size="sm"
              onClick={generate}
              disabled={generating}
              className="bg-[#ef7f1b] hover:bg-[#d46f14]"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-1" />
              )}
              Generate Document
            </Button>
          </div>
        </div>

        {/* Project Select */}
        <div className="mt-5">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Select Project
          </Label>
          <Select
            value={form.project_id}
            onValueChange={(value) => update("project_id", value)}
            disabled={isEdit} // Don't allow changing project when editing
          >
            <SelectTrigger className="mt-2 bg-white h-11">
              <SelectValue placeholder="Choose a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-xs text-gray-400">
                      {project.project_type} • {project.purpose}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Progress value={prog} className="h-2 flex-1" />
          <span className="text-xs font-bold text-gray-500">{prog}%</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = open[section.id] ?? true;

            const filledFields = section.fields.filter((f) => {
              const value = form[f];
              if (Array.isArray(value)) {
                return value.some(
                  (v) => v.title?.trim() || v.description?.trim(),
                );
              }
              return String(value).trim().length > 0;
            }).length;

            const sectionProgress = Math.round(
              (filledFields / section.fields.length) * 100,
            );

            return (
              <Card
                key={section.id}
                className="overflow-hidden border border-gray-200 shadow-sm"
              >
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        sectionProgress === 100
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-[#ef7f1b]"
                      }`}
                    >
                      {sectionProgress === 100 ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">
                        {section.title}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {sectionProgress}% complete
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-5">
                    {section.fields.map((field) => (
                      <div key={field}>
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {field.replace(/_/g, " ").toUpperCase()}
                        </Label>
                        <div className="mt-2">
                          {field === "scope_summary" ? (
                            <Textarea
                              rows={5}
                              value={form.scope_summary}
                              onChange={(e) =>
                                update("scope_summary", e.target.value)
                              }
                              placeholder="Enter overall project scope summary..."
                            />
                          ) : (
                            // Dynamic array fields
                            <div className="space-y-3">
                              {form[field].map((item, index) => (
                                <Card
                                  key={index}
                                  className="p-4 border shadow-sm"
                                >
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-xs font-semibold text-gray-500">
                                        Title
                                      </Label>
                                      <input
                                        type="text"
                                        value={item.title || ""}
                                        onChange={(e) =>
                                          updateJsonField(
                                            field,
                                            index,
                                            "title",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter title"
                                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                      />
                                    </div>

                                    <div>
                                      <Label className="text-xs font-semibold text-gray-500">
                                        Description
                                      </Label>
                                      <Textarea
                                        rows={4}
                                        value={item.description || ""}
                                        onChange={(e) =>
                                          updateJsonField(
                                            field,
                                            index,
                                            "description",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter description"
                                      />
                                    </div>

                                    <div className="flex justify-end">
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        type="button"
                                        onClick={() => removeRow(field, index)}
                                      >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addRow(field)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Item
                              </Button>
                            </div>
                          )}
                        </div>
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
