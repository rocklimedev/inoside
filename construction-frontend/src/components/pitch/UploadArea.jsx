"use client";

import React, { useState, useRef } from "react";

import { useCreatePitchGlobalMutation } from "@/api/projectsApi";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { Upload, File, X, Loader2, Plus, Sparkles } from "lucide-react";

import { toast } from "sonner";

const ALLOWED_TYPES = [".pdf", ".ppt", ".pptx", ".key"];

export default function UploadArea({ onUploaded }) {
  const { api } = useAuth();

  const [createPitchGlobal, { isLoading }] = useCreatePitchGlobalMutation();

  // ======================================================
  // STATE
  // ======================================================

  const [projectName, setProjectName] = useState("");
  const [preferredDesignStyle, setPreferredDesignStyle] = useState("");
  const [colorTone, setColorTone] = useState("Not Sure");
  const [luxuryLevel, setLuxuryLevel] = useState("Medium");
  const [functionalVsAesthetic, setFunctionalVsAesthetic] = useState("");
  const [budgetFlexibility, setBudgetFlexibility] = useState(false);

  const [priorityInput, setPriorityInput] = useState("");
  const [priorityAreas, setPriorityAreas] = useState([]);

  const [likesDislikes, setLikesDislikes] = useState("");
  const [nonNegotiables, setNonNegotiables] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");

  const [status, setStatus] = useState("Draft");

  const [file, setFile] = useState(null);

  const [progress, setProgress] = useState(0);

  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  // ======================================================
  // FILE HANDLER
  // ======================================================

  const handleFile = (f) => {
    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();

    if (!ALLOWED_TYPES.includes(ext)) {
      toast.error("Supported formats: PDF, PPT, PPTX, Keynote");
      return;
    }

    setFile(f);
  };

  // ======================================================
  // PRIORITY AREAS
  // ======================================================

  const addPriorityArea = () => {
    if (!priorityInput.trim()) return;

    setPriorityAreas((prev) => [...prev, priorityInput.trim()]);

    setPriorityInput("");
  };

  const removePriorityArea = (index) => {
    setPriorityAreas((prev) => prev.filter((_, i) => i !== index));
  };

  // ======================================================
  // UPLOAD
  // ======================================================

  const handleUpload = async () => {
    if (!projectName.trim()) {
      return toast.error("Project name required");
    }

    if (!file) {
      return toast.error("Select a file");
    }

    try {
      setProgress(0);

      const formData = new FormData();

      formData.append("file", file);

      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 200);

      const uploadRes = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(interval);

      setProgress(95);

      await createPitchGlobal({
        project_name: projectName,

        preferred_design_style: preferredDesignStyle,

        color_tone: colorTone,

        luxury_level: luxuryLevel,

        functional_vs_aesthetic: functionalVsAesthetic,

        budget_flexibility: budgetFlexibility,

        priority_areas: priorityAreas,

        likes_dislikes: likesDislikes,

        non_negotiables: nonNegotiables,

        special_requirements: specialRequirements,

        moodboard_pdf_url: "",

        pitch_pdf_url: uploadRes.data.url,

        status,

        file_id: uploadRes.data.file_id,
        filename: file.name,
        file_size: uploadRes.data.size,
      }).unwrap();

      setProgress(100);

      toast.success("Pitch uploaded successfully");

      // RESET
      setProjectName("");
      setPreferredDesignStyle("");
      setColorTone("Not Sure");
      setLuxuryLevel("Medium");
      setFunctionalVsAesthetic("");
      setBudgetFlexibility(false);
      setPriorityAreas([]);
      setLikesDislikes("");
      setNonNegotiables("");
      setSpecialRequirements("");
      setStatus("Draft");
      setFile(null);

      if (onUploaded) {
        onUploaded();
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="w-full">
      {/* ====================================================== */}
      {/* MODAL CONTENT WRAPPER */}
      {/* ====================================================== */}

      <ScrollArea className="h-[85vh] pr-4">
        <div className="max-w-6xl mx-auto pb-10">
          {/* HEADER */}

          <div className="sticky top-0 z-10 bg-white pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#ef7f1b]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-black">
                  Upload Project Pitch
                </h2>

                <p className="text-sm text-gray-500">
                  Submit your project presentation and details
                </p>
              </div>
            </div>

            <Separator className="mt-4" />
          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            {/* ====================================================== */}
            {/* LEFT SIDE */}
            {/* ====================================================== */}

            <Card className="rounded-2xl border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Project Information</h3>

                  <p className="text-sm text-gray-500">
                    Basic project configuration
                  </p>
                </div>

                {/* PROJECT NAME */}

                <div className="space-y-2">
                  <Label>Project Name *</Label>

                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Sunrise Villa"
                  />
                </div>

                {/* DESIGN STYLE */}

                <div className="space-y-2">
                  <Label>Preferred Design Style</Label>

                  <Input
                    value={preferredDesignStyle}
                    onChange={(e) => setPreferredDesignStyle(e.target.value)}
                    placeholder="Modern Minimal"
                  />
                </div>

                {/* COLOR + LUXURY */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color Tone</Label>

                    <select
                      value={colorTone}
                      onChange={(e) => setColorTone(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 bg-white"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Mixed</option>
                      <option>Not Sure</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Luxury Level</Label>

                    <select
                      value={luxuryLevel}
                      onChange={(e) => setLuxuryLevel(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 bg-white"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                {/* FUNCTIONAL */}

                <div className="space-y-2">
                  <Label>Functional vs Aesthetic</Label>

                  <Textarea
                    rows={5}
                    value={functionalVsAesthetic}
                    onChange={(e) => setFunctionalVsAesthetic(e.target.value)}
                    placeholder="Describe balance between function and aesthetics..."
                  />
                </div>

                {/* BUDGET */}

                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">Budget Flexible</p>

                    <p className="text-sm text-gray-500">
                      Allow flexibility in budget planning
                    </p>
                  </div>

                  <Switch
                    checked={budgetFlexibility}
                    onCheckedChange={setBudgetFlexibility}
                  />
                </div>

                {/* STATUS */}

                <div className="space-y-2">
                  <Label>Status</Label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Draft</option>
                    <option>Pending Review</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* ====================================================== */}
            {/* RIGHT SIDE */}
            {/* ====================================================== */}

            <Card className="rounded-2xl border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Additional Details</h3>

                  <p className="text-sm text-gray-500">
                    Priorities, notes and uploads
                  </p>
                </div>

                {/* PRIORITY AREAS */}

                <div className="space-y-3">
                  <Label>Priority Areas</Label>

                  <div className="flex gap-2">
                    <Input
                      value={priorityInput}
                      onChange={(e) => setPriorityInput(e.target.value)}
                      placeholder="Kitchen"
                    />

                    <Button
                      type="button"
                      size="icon"
                      onClick={addPriorityArea}
                      className="bg-[#ef7f1b] hover:bg-[#d66e15]"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {priorityAreas.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm rounded-full flex items-center gap-2"
                      >
                        {item}

                        <button onClick={() => removePriorityArea(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* TEXTAREAS */}

                <div className="space-y-2">
                  <Label>Likes / Dislikes</Label>

                  <Textarea
                    rows={4}
                    value={likesDislikes}
                    onChange={(e) => setLikesDislikes(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Non Negotiables</Label>

                  <Textarea
                    rows={4}
                    value={nonNegotiables}
                    onChange={(e) => setNonNegotiables(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Special Requirements</Label>

                  <Textarea
                    rows={4}
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                  />
                </div>

                {/* FILE UPLOAD */}

                <div>
                  <Label className="mb-2 block">Pitch File</Label>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                      dragActive
                        ? "border-[#ef7f1b] bg-orange-50"
                        : "border-gray-200 hover:border-[#ef7f1b]/50"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();

                      setDragActive(false);

                      if (e.dataTransfer.files?.[0]) {
                        handleFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => inputRef.current?.click()}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.ppt,.pptx,.key"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleFile(e.target.files[0])
                      }
                    />

                    {file ? (
                      <div className="flex flex-col items-center gap-3">
                        <File className="w-10 h-10 text-[#ef7f1b]" />

                        <div>
                          <p className="font-medium text-sm break-all">
                            {file.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />

                        <p className="font-medium text-sm">
                          Drag & drop your file
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          PDF, PPT, PPTX, Keynote
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* PROGRESS */}

                {isLoading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />

                    <p className="text-xs text-gray-500 text-center">
                      {progress}% uploaded
                    </p>
                  </div>
                )}

                {/* SUBMIT */}

                <Button
                  onClick={handleUpload}
                  disabled={isLoading || !file || !projectName.trim()}
                  className="w-full h-11 bg-[#ef7f1b] hover:bg-[#d66e15] text-white rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Pitch
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
