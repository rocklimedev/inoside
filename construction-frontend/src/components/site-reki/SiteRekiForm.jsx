"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  ChevronDown,
  ChevronRight,
  Upload,
  X,
  Camera,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  useGetRekiQuery,
  useUpdateRekiMutation,
  useUploadPitchFileMutation,
  useGetProjectsQuery,
} from "@/api/projectsApi";

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
  const [openSections, setOpenSections] = useState({
    project: true,
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const photoRef = useRef(null);

  /* ================= LOAD DATA ================= */
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
    if (!selectedProjectId) return toast.error("Please select a project");
    setSaving(true);
    try {
      await updateReki({ projectId: selectedProjectId, ...form }).unwrap();
      toast.success("Changes saved successfully");
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  /* ================= GENERATE ================= */
  const handleGenerate = async () => {
    if (!selectedProjectId) return toast.error("Please select a project");
    setGenerating(true);
    try {
      await updateReki({ projectId: selectedProjectId, ...form }).unwrap();
      toast.success("Report generated successfully");
      onGenerated?.(form);
    } catch (err) {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ================= PHOTO UPLOAD ================= */
  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    const uploadedPhotos = [];

    for (const file of files) {
      try {
        const result = await uploadFile({
          file,
          projectId: selectedProjectId,
        }).unwrap();
        uploadedPhotos.push(result.url);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setForm((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...uploadedPhotos],
    }));

    setUploadingPhoto(false);
    toast.success("Photos uploaded successfully");
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  /* ================= FIELD HELPER ================= */
  /* ================= FIELD HELPER ================= */
  const field = (key, label, type = "input") => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>

      {type === "input" && (
        <Input
          value={form?.[key] ?? ""}
          onChange={(e) => updateField(key, e.target.value)}
          className="bg-background"
        />
      )}

      {type === "textarea" && (
        <Textarea
          value={form?.[key] ?? ""}
          onChange={(e) => updateField(key, e.target.value)}
          rows={3}
        />
      )}

      {type === "checkbox" && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            checked={!!form?.[key]}
            onChange={(e) => updateField(key, e.target.checked)}
            className="h-5 w-5 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground">Yes</span>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="pl-0">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleGenerate} disabled={generating}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Project Selection */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Project</Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
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
              {field("visit_date", "Visit Date")}
              {field("area_type", "Area Type")}
              {field("plot_type", "Plot Type")}
            </div>
          </Card>

          {/* Dynamic Sections */}
          {Object.entries({
            access: "Site Access",
            structure: "Existing Structure",
            measurements: "Measurements",
            risks: "Risk Assessment",
            services: "Services & Utilities",
            demolition: "Demolition Scope",
            output: "Suggestions & Instructions",
          }).map(([key, title]) => (
            <Card key={key} className="overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg">{title}</span>
                </div>
                {openSections[key] ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {openSections[key] && (
                <>
                  <Separator />
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {key === "access" && (
                        <>
                          {field(
                            "client_present",
                            "Client Present",
                            "checkbox",
                          )}
                          {field("road_access", "Road Access", "checkbox")}
                          {field(
                            "unloading_space",
                            "Unloading Space",
                            "checkbox",
                          )}
                          {field(
                            "working_time_restrictions",
                            "Work Time Restrictions",
                            "textarea",
                          )}
                        </>
                      )}
                      {key === "structure" && (
                        <>
                          {field(
                            "existing_structure",
                            "Existing Structure",
                            "checkbox",
                          )}
                          {field("existing_floors", "Number of Floors")}
                          {field("construction_type", "Construction Type")}
                          {field(
                            "structural_cracks",
                            "Structural Cracks",
                            "checkbox",
                          )}
                        </>
                      )}
                      {key === "measurements" && (
                        <>
                          {field("built_up_area", "Built-up Area (sq.ft)")}
                          {field(
                            "floor_to_floor_height",
                            "Floor to Floor Height",
                          )}
                          {field("slab_thickness", "Slab Thickness")}
                        </>
                      )}
                      {key === "risks" && (
                        <>
                          {field("dampness", "Dampness", "checkbox")}
                          {field(
                            "termite_damage",
                            "Termite Damage",
                            "checkbox",
                          )}
                          {field(
                            "safety_concerns",
                            "Safety Concerns",
                            "checkbox",
                          )}
                          {field(
                            "risk_factors",
                            "Other Risk Factors",
                            "textarea",
                          )}
                        </>
                      )}
                      {key === "services" && (
                        <>
                          {field(
                            "electrical_wiring",
                            "Electrical Wiring",
                            "checkbox",
                          )}
                          {field(
                            "plumbing_lines",
                            "Plumbing Lines",
                            "checkbox",
                          )}
                          {field("tanks_present", "Water Tanks", "checkbox")}
                        </>
                      )}
                      {key === "demolition" && (
                        <>
                          {field(
                            "demolition_required",
                            "Demolition Required",
                            "checkbox",
                          )}
                          {field("demolition_type", "Demolition Type")}
                        </>
                      )}
                      {key === "output" && (
                        <>
                          {field(
                            "suggestions",
                            "Suggestions / Recommendations",
                            "textarea",
                          )}
                          {field(
                            "client_instructions",
                            "Client Specific Instructions",
                            "textarea",
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}

          {/* Photos Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Site Photos</h2>
              <Button
                onClick={() => photoRef.current?.click()}
                disabled={uploadingPhoto}
                variant="outline"
              >
                <Camera className="mr-2 h-4 w-4" />
                Add Photos
              </Button>
              <input
                ref={photoRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {form.photos?.map((photo, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border"
                >
                  <img
                    src={photo}
                    alt={`Site photo ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!form.photos || form.photos.length === 0) && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No photos uploaded yet
                </div>
              )}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
