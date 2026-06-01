"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUploadDrawingMutation } from "@/api/projects/drawingsApi";
import { useGetProjectsQuery } from "@/api/projectsApi";

const DRAWING_TYPES = [
  "Design",
  "Execution",
  "Technical",
  "Construction",
  "Working",
];

function UploadDesignForm({ onSuccess }) {
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [form, setForm] = useState({
    drawing_type: "Design",
    version: 1,
    area_floor: "",
  });

  const [file, setFile] = useState(null);

  const fileRef = useRef(null);

  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();

  const [uploadDrawing, { isLoading: uploading }] = useUploadDrawingMutation();

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append("drawing_type", form.drawing_type);

    formData.append("version", String(form.version));

    formData.append("area_floor", form.area_floor);

    try {
      const result = await uploadDrawing({
        projectId: selectedProjectId,
        body: formData,
      }).unwrap();

      toast.success("Drawing uploaded successfully");

      onSuccess?.(result);

      setSelectedProjectId("");

      setForm({
        drawing_type: "Design",
        version: 1,
        area_floor: "",
      });

      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      console.error(err);

      toast.error(err?.data?.message || "Failed to upload drawing");
    }
  };

  return (
    <div className="space-y-4 py-2">
      {/* Project */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Project *
        </Label>

        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="mt-1">
            <SelectValue
              placeholder={
                projectsLoading ? "Loading projects..." : "Select Project"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Drawing Type */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Drawing Type
        </Label>

        <Select
          value={form.drawing_type}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              drawing_type: value,
            }))
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {DRAWING_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Version */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Version
        </Label>

        <Input
          type="number"
          min={1}
          value={form.version}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              version: Number(e.target.value) || 1,
            }))
          }
          className="mt-1"
        />
      </div>

      {/* Area Floor */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Area / Floor
        </Label>

        <Input
          value={form.area_floor}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              area_floor: e.target.value,
            }))
          }
          className="mt-1"
          placeholder="Ground Floor, First Floor, Kitchen, Living Room, etc."
        />
      </div>

      {/* File Upload */}
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          PDF Drawing *
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
            <div className="space-y-2">
              <Upload className="mx-auto w-8 h-8 text-gray-400" />

              <p className="text-xs text-gray-400">
                Click to select PDF drawing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={uploading || !selectedProjectId || !file}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white min-w-[160px]"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Drawing
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default UploadDesignForm;
