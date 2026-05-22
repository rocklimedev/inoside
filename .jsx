"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  Camera,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  useGetRekiQuery,
  useUpdateRekiMutation,
  useUploadPitchFileMutation,
  useGetProjectsQuery,
} from "@/api/projectsApi";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function SiteRekiForm({
  projectId: initialProjectId,
  onBack,
  onGenerated,
}) {
  const { data: projects = [] } = useGetProjectsQuery();

  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || "",
  );

  const { data: item, isLoading } = useGetRekiQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [updateReki] = useUpdateRekiMutation();
  const [uploadFile] = useUploadPitchFileMutation();

  const [form, setForm] = useState({});
  const [openSections, setOpenSections] = useState({ site: true });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const photoRef = useRef(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (item) {
      setForm({
        ...item,
        photos: item.photos || [],
      });
    }
  }, [item]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!selectedProjectId) return toast.error("Select a project first");

    setSaving(true);
    try {
      await updateReki({
        projectId: selectedProjectId,
        ...form,
      }).unwrap();

      toast.success("Saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= GENERATE ================= */
  const handleGenerate = async () => {
    if (!selectedProjectId) return toast.error("Select a project first");

    setGenerating(true);
    try {
      await updateReki({
        projectId: selectedProjectId,
        ...form,
      }).unwrap();

      toast.success("Report generated");
      onGenerated?.(form);
    } catch (err) {
      console.error(err);
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  /* ================= PHOTO ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const res = await uploadFile(file).unwrap();

      const newPhoto = {
        photo_url: res.url || res.data?.url,
        photo_type: "site",
      };

      const photos = [...(form.photos || []), newPhoto];
      setForm((prev) => ({ ...prev, photos }));

      await updateReki({
        projectId: selectedProjectId,
        photos,
      }).unwrap();

      toast.success("Photo uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const removePhoto = async (idx) => {
    const photos = (form.photos || []).filter((_, i) => i !== idx);
    setForm((prev) => ({ ...prev, photos }));

    await updateReki({
      projectId: selectedProjectId,
      photos,
    }).unwrap();
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ================= FIELD ================= */
  const field = (key, label, type = "input") => (
    <div>
      <Label className="text-[10px] uppercase text-gray-400 font-bold">
        {label}
      </Label>

      {type === "input" && (
        <Input
          value={form?.[key] ?? ""}
          onChange={(e) => updateField(key, e.target.value)}
        />
      )}

      {type === "textarea" && (
        <Textarea
          value={form?.[key] ?? ""}
          onChange={(e) => updateField(key, e.target.value)}
        />
      )}

      {type === "checkbox" && (
        <input
          type="checkbox"
          checked={!!form?.[key]}
          onChange={(e) => updateField(key, e.target.checked)}
          className="h-4 w-4 mt-2"
        />
      )}
    </div>
  );

  /* ================= SECTIONS (MATCHED TO MODEL) ================= */
  const sections = {
    project: (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Project</Label>
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {field("visit_date", "Visit Date", "input")}
        {field("area_type", "Area Type", "input")}
        {field("plot_type", "Plot Type", "input")}
      </div>
    ),

    access: (
      <div className="grid grid-cols-2 gap-4">
        {field("client_present", "Client Present", "checkbox")}
        {field("road_access", "Road Access", "checkbox")}
        {field("unloading_space", "Unloading Space", "checkbox")}
        {field("working_time_restrictions", "Work Restrictions", "textarea")}
      </div>
    ),

    structure: (
      <div className="grid grid-cols-2 gap-4">
        {field("existing_structure", "Existing Structure", "checkbox")}
        {field("existing_floors", "Floors", "input")}
        {field("construction_type", "Construction Type", "input")}
        {field("structural_cracks", "Cracks", "checkbox")}
      </div>
    ),

    measurements: (
      <div className="grid grid-cols-2 gap-4">
        {field("built_up_area", "Built-up Area", "input")}
        {field("floor_to_floor_height", "Floor Height", "input")}
        {field("slab_thickness", "Slab Thickness", "input")}
      </div>
    ),

    risks: (
      <div className="grid grid-cols-2 gap-4">
        {field("dampness", "Dampness", "checkbox")}
        {field("termite_damage", "Termite", "checkbox")}
        {field("safety_concerns", "Safety", "checkbox")}
        {field("risk_factors", "Risk Factors", "textarea")}
      </div>
    ),

    services: (
      <div className="grid grid-cols-2 gap-4">
        {field("electrical_wiring", "Electrical", "checkbox")}
        {field("plumbing_lines", "Plumbing", "checkbox")}
        {field("tanks_present", "Tanks", "checkbox")}
      </div>
    ),

    demolition: (
      <div className="grid grid-cols-2 gap-4">
        {field("demolition_required", "Demolition Required", "checkbox")}
        {field("demolition_type", "Demolition Type", "input")}
      </div>
    ),

    output: (
      <div className="grid grid-cols-2 gap-4">
        {field("suggestions", "Suggestions", "textarea")}
        {field("client_instructions", "Client Instructions", "textarea")}
      </div>
    ),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>

          <Button onClick={handleGenerate} disabled={generating}>
            <FileText className="w-3 h-3 mr-1" />
            Generate
          </Button>
        </div>
      </div>

      {/* BODY */}
      <ScrollArea className="flex-1 p-4 space-y-3">
        {Object.entries(sections).map(([key, content]) => (
          <Card key={key}>
            <button
              className="w-full flex justify-between p-4"
              onClick={() => toggleSection(key)}
            >
              <span className="font-semibold capitalize">{key}</span>
              {openSections[key] ? <ChevronDown /> : <ChevronRight />}
            </button>

            {openSections[key] && <div className="p-4 border-t">{content}</div>}
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}
