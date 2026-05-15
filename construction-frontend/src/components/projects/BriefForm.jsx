"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  FileText,
  Send,
  Loader2,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import SectionFields from "./SectionFields";

// RTK Query Hooks
import {
  useUpdateBriefMutation,
  useSendBriefMutation,
} from "@/api/projectsApi"; // ← Adjust path if needed

const SECTIONS = [
  /* ... paste your full SECTIONS array here ... */
];

export default function BriefForm({
  brief,
  projectId,
  user,
  onBack,
  onGenerated,
}) {
  const [form, setForm] = useState(brief || {});
  const [openSections, setOpenSections] = useState({ client: true });

  const [updateBrief, { isLoading: saving }] = useUpdateBriefMutation();
  const [sendBrief, { isLoading: sending }] = useSendBriefMutation();

  const autoSaveTimer = useRef | (null > null);

  // Sync form when brief data changes
  useEffect(() => {
    if (brief) setForm(brief);
  }, [brief]);

  const updateField = (key, value) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(() => {
      handleAutoSave(newForm);
    }, 1800);
  };

  const handleAutoSave = async (dataToSave) => {
    if (!projectId) return;

    try {
      await updateBrief({
        projectId: projectId,
        ...dataToSave,
      }).unwrap();
    } catch (err) {
      console.error(err);
      // Silent fail for auto-save (don't show toast on every keystroke)
    }
  };

  const handleManualSave = async () => {
    if (!projectId) return;
    try {
      await updateBrief({
        projectId: projectId,
        ...form,
      }).unwrap();
      toast.success("Brief saved successfully");
    } catch (err) {
      toast.error("Failed to save brief");
    }
  };

  const handleGenerate = async () => {
    if (!projectId) return;

    try {
      // Save first
      await updateBrief({
        projectId: projectId,
        ...form,
      }).unwrap();

      // TODO: Add generateBrief mutation (recommended)
      toast.success("Document generated successfully");
      onGenerated(); // This will refetch in parent
    } catch (err) {
      toast.error("Failed to generate document");
    }
  };

  const handleSendToClient = async () => {
    if (!projectId) return;

    try {
      // Save current data
      await updateBrief({
        projectId: projectId,
        ...form,
      }).unwrap();

      // Send using brief ID (if available)
      if (brief?.id) {
        await sendBrief(brief.id).unwrap();
      }

      toast.success("Brief sent to client successfully");
      onGenerated();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to send brief");
    }
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSectionProgress = (section) => {
    const filled = section.fields.filter(
      (f) => form[f] && String(form[f]).trim(),
    ).length;
    return Math.round((filled / section.fields.length) * 100);
  };

  const totalProgress = Math.round(
    (SECTIONS.reduce(
      (acc, s) =>
        acc + s.fields.filter((f) => form[f] && String(form[f]).trim()).length,
      0,
    ) /
      SECTIONS.reduce((acc, s) => acc + s.fields.length, 0)) *
      100,
  );

  return (
    <div className="flex flex-col h-full" data-testid="brief-form">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">
                {form.project_name || "Untitled Brief"}
              </h1>
              <p className="text-[11px] text-gray-400">Module: Brief</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">
              {saving ? "Saving..." : "Auto-saved"}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={saving}
            >
              <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 mr-1" />
              )}
              Generate Document
            </Button>

            <Button
              size="sm"
              onClick={handleSendToClient}
              disabled={sending}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
            >
              {sending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1" />
              )}
              Send to Client
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Progress
            value={totalProgress}
            className="h-1.5 flex-1 bg-gray-100"
          />
          <span className="text-xs font-bold text-gray-500">
            {totalProgress}%
          </span>
        </div>
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections[section.id];
            const prog = getSectionProgress(section);

            return (
              <Card key={section.id} className="overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        prog === 100
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-[#ef7f1b]"
                      }`}
                    >
                      {prog === 100 ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">
                        {section.title}
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        {prog}% complete
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
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                    <SectionFields
                      section={section.id}
                      form={form}
                      onChange={updateField}
                    />
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
