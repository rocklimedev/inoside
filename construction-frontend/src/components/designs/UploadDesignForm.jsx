"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { useUploadDrawingMutation } from "@/api/projects/drawingsApi"; // adjust path
const CATEGORIES = [
  "All",
  "Interior",
  "Room-wise",
  "Structure",
  "MEP",
  "Walls",
  "Doors",
  "Windows",
  "Lighting",
  "Furniture",
  "Ceiling",
  "Flooring",
  "Elevations",
  "2D Layouts",
  "3D Views",
  "Other",
];
function UploadDesignForm({ projectId, projectName, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    category: "2D Layouts",
    description: "",
    room_area_tag: "",
    version: "v1.0",
  });

  const [file, setFile] = useState(null);
  const [uploadDrawing, { isLoading: uploading }] = useUploadDrawingMutation();

  const fileRef = useRef(null);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    const formData = new FormData();

    // Append file
    formData.append("file", file);

    // Append other fields
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("room_area_tag", form.room_area_tag);
    formData.append("version", form.version);
    formData.append("project_name", projectName);

    try {
      const result = await uploadDrawing({
        projectId,
        body: formData, // RTK Query will handle it
      }).unwrap();

      toast.success("Design uploaded successfully!");
      onSuccess?.(result);

      // Reset form
      setForm({
        title: "",
        category: "2D Layouts",
        description: "",
        room_area_tag: "",
        version: "v1.0",
      });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="space-y-3 py-2">
      {/* Category */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Category
        </Label>
        <Select
          value={form.category}
          onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.filter((c) => c !== "All").map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Title *
        </Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="mt-1"
          placeholder="e.g. Master Bedroom Floor Plan"
          data-testid="design-title-input"
        />
      </div>

      {/* Version + Room Area */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Version
          </Label>
          <Input
            value={form.version}
            onChange={(e) =>
              setForm((p) => ({ ...p, version: e.target.value }))
            }
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Room / Area Tag
          </Label>
          <Input
            value={form.room_area_tag}
            onChange={(e) =>
              setForm((p) => ({ ...p, room_area_tag: e.target.value }))
            }
            className="mt-1"
            placeholder="e.g. Master Bedroom"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Description
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          className="mt-1"
          rows={2}
        />
      </div>

      {/* File Upload */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          PDF File *
        </Label>

        <div
          onClick={() => fileRef.current?.click()}
          className="mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[#ef7f1b]/50 transition-colors"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {file ? (
            <p className="text-sm font-medium text-black break-all">
              {file.name}
            </p>
          ) : (
            <div className="space-y-1">
              <Upload className="mx-auto w-8 h-8 text-gray-400" />
              <p className="text-xs text-gray-400">Click to select PDF</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={uploading || !file || !form.title.trim()}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white min-w-[140px]"
          data-testid="design-upload-submit"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Design
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default UploadDesignForm;
