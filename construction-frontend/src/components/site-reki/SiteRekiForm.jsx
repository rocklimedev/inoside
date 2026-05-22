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
} from "@/api/projectsApi";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function SiteRekiForm({ rekiId, onBack, onGenerated }) {
  const { data: item, isLoading } = useGetRekiQuery(rekiId);

  const [updateReki] = useUpdateRekiMutation();
  const [uploadFile] = useUploadPitchFileMutation();

  const [form, setForm] = useState({});
  const [openSections, setOpenSections] = useState({ site: true });

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
    } else if (rekiId?.startsWith("temp-")) {
      // Handle temporary ID created in debug mode
      setForm({
        id: rekiId,
        project: { name: "Untitled Project" },
        status: "draft",
        photos: [],
      });
    }
  }, [item, rekiId]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateReki({
        id: rekiId,
        data: form,
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
    setGenerating(true);
    try {
      await updateReki({
        id: rekiId,
        data: form,
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

  /* ================= PHOTO UPLOAD ================= */
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
        id: rekiId,
        data: { photos },
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

    try {
      await updateReki({
        id: rekiId,
        data: { photos },
      }).unwrap();
    } catch {
      toast.error("Failed to remove photo");
    }
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ================= PROGRESS ================= */
  const fields = [
    "client_present",
    "road_access",
    "unloading_space",
    "existing_structure",
    "structural_cracks",
    "dampness",
    "termite_damage",
    "electrical_wiring",
    "plumbing_lines",
    "tanks_present",
    "demolition_required",
    "safety_concerns",
  ];

  const filledCount = fields.filter((f) => {
    const v = form?.[f];
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v > 0;
    return v !== null && v !== undefined && String(v).trim() !== "";
  }).length;

  const totalProgress = Math.round((filledCount / fields.length) * 100);

  /* ================= FIELD HELPER ================= */
  const field = (key, label, type = "input", opts = {}) => (
    <div className={opts.full ? "col-span-2" : ""}>
      <Label className="text-[10px] uppercase text-gray-400 font-bold">
        {label}
      </Label>

      {type === "input" && (
        <Input
          value={form?.[key] || ""}
          onChange={(e) => updateField(key, e.target.value)}
          className="mt-1"
        />
      )}

      {type === "textarea" && (
        <Textarea
          value={form?.[key] || ""}
          onChange={(e) => updateField(key, e.target.value)}
          className="mt-1"
        />
      )}

      {type === "select" && (
        <Select
          value={form?.[key] || ""}
          onValueChange={(v) => updateField(key, v)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {(opts.options || []).map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );

  /* ================= SECTIONS ================= */
  const sections = {
    site: (
      <div className="grid grid-cols-2 gap-4">
        {field("client_present", "Client Present", "select", {
          options: ["true", "false"],
        })}
        {field("road_access", "Road Access", "select", {
          options: ["true", "false"],
        })}
        {field("unloading_space", "Unloading Space", "select", {
          options: ["true", "false"],
        })}
        {field("working_time_restrictions", "Work Restrictions", "textarea", {
          full: true,
        })}
      </div>
    ),

    structure: (
      <div className="grid grid-cols-2 gap-4">
        {field("existing_structure", "Existing Structure", "select", {
          options: ["true", "false"],
        })}
        {field("existing_floors", "Floors", "input")}
        {field("construction_type", "Construction Type", "input")}
        {field("structural_cracks", "Cracks", "select", {
          options: ["true", "false"],
        })}
        {field("wall_condition", "Wall Condition", "input")}
        {field("floor_condition", "Floor Condition", "input")}
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
        {field("dampness", "Dampness", "select", {
          options: ["true", "false"],
        })}
        {field("dampness_location", "Damp Location", "textarea")}
        {field("termite_damage", "Termite", "select", {
          options: ["true", "false"],
        })}
        {field("safety_concerns", "Safety Concerns", "select", {
          options: ["true", "false"],
        })}
        {field("risk_factors", "Risk Factors", "textarea", { full: true })}
      </div>
    ),

    services: (
      <div className="grid grid-cols-2 gap-4">
        {field("electrical_wiring", "Electrical", "select", {
          options: ["true", "false"],
        })}
        {field("electrical_panel_location", "Panel Location", "textarea")}
        {field("plumbing_lines", "Plumbing", "select", {
          options: ["true", "false"],
        })}
        {field("water_inlet_outlet", "Water Lines", "textarea")}
        {field("tanks_present", "Tanks", "select", {
          options: ["true", "false"],
        })}
      </div>
    ),

    demolition: (
      <div className="grid grid-cols-2 gap-4">
        {field("demolition_required", "Demolition", "select", {
          options: ["true", "false"],
        })}
        {field("demolition_type", "Type", "input")}
        {field("beam_cutting", "Beam Cutting", "select", {
          options: ["true", "false"],
        })}
        {field("core_drilling", "Core Drilling", "select", {
          options: ["true", "false"],
        })}
      </div>
    ),

    output: (
      <div className="grid grid-cols-2 gap-4">
        {field("suggestions", "Suggestions", "textarea", { full: true })}
        {field("client_instructions", "Client Instructions", "textarea", {
          full: true,
        })}
      </div>
    ),

    photos: (
      <div>
        <div className="flex gap-3 flex-wrap mb-3">
          {(form.photos || []).map((p, i) => (
            <div
              key={i}
              className="relative w-24 h-24 border rounded overflow-hidden group"
            >
              <img
                src={`${BACKEND}${p.photo_url}`}
                className="w-full h-full object-cover"
                alt="Site photo"
              />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={photoRef}
          hidden
          accept="image/*"
          onChange={handlePhotoUpload}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={() => photoRef.current?.click()}
          disabled={uploadingPhoto}
        >
          {uploadingPhoto ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Camera className="w-3 h-3" />
          )}
          Add Photo
        </Button>
      </div>
    ),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <button onClick={onBack} className="text-gray-600 hover:text-black">
          <ArrowLeft size={20} />
        </button>

        <h1 className="font-bold text-lg">Site Reki</h1>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
            disabled={saving}
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>

          <Button
            onClick={handleGenerate}
            variant="outline"
            size="sm"
            disabled={generating}
          >
            <FileText className="w-3 h-3 mr-1" />
            Generate
          </Button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-4 py-2 flex items-center gap-2">
        <Progress value={totalProgress} className="flex-1 h-1.5" />
        <span className="text-xs font-medium">{totalProgress}%</span>
      </div>

      {/* BODY */}
      <ScrollArea className="flex-1 p-4 space-y-3">
        {Object.entries(sections).map(([key, content]) => (
          <Card key={key}>
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex justify-between p-4 text-left"
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
