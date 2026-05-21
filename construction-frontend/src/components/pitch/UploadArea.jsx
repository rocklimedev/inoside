"use client";

import React, { useState, useRef, useMemo } from "react";
import { useGetProjectsQuery, useCreatePitchMutation } from "@/api/projectsApi";
import { useUploadFileMutation } from "@/api/cdnApi"; // ← Import from cdnApi

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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Upload,
  File,
  X,
  Loader2,
  Plus,
  Sparkles,
  ChevronsUpDown,
} from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = [".pdf", ".ppt", ".pptx", ".key"];

export default function UploadArea({ onUploaded }) {
  const [createPitchGlobal, { isLoading: isCreating }] =
    useCreatePitchMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();

  // ======================================================
  // STATE
  // ======================================================
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [openProjectCombobox, setOpenProjectCombobox] = useState(false);

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
  // FILTERED PROJECTS
  // ======================================================
  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return projects;
    const term = projectSearch.toLowerCase();
    return projects.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.client?.name?.toLowerCase().includes(term),
    );
  }, [projects, projectSearch]);

  // ======================================================
  // HANDLERS
  // ======================================================
  const handleFile = (f) => {
    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      toast.error("Supported formats: PDF, PPT, PPTX, Keynote");
      return;
    }
    setFile(f);
  };

  const addPriorityArea = () => {
    if (!priorityInput.trim()) return;
    setPriorityAreas((prev) => [...prev, priorityInput.trim()]);
    setPriorityInput("");
  };

  const removePriorityArea = (index) => {
    setPriorityAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedProject(null);
    setProjectSearch("");
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
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedProject) return toast.error("Please select a project");
    if (!file) return toast.error("Please select a pitch file");

    try {
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 92));
      }, 220);

      // Upload file using CDN API
      const uploadRes = await uploadFile(file).unwrap();

      clearInterval(interval);
      setProgress(95);

      // Create Pitch
      await createPitchGlobal({
        projectId: selectedProject.id,
        preferred_design_style: preferredDesignStyle || null,
        color_tone: colorTone,
        luxury_level: luxuryLevel,
        functional_vs_aesthetic: functionalVsAesthetic || null,
        budget_flexibility: budgetFlexibility,

        likes_dislikes: likesDislikes || null,
        non_negotiables: nonNegotiables || null,
        special_requirements: specialRequirements || null,
        pitch_pdf_url: uploadRes.url || uploadRes.data?.url,
      }).unwrap();

      setProgress(100);
      toast.success("Project Pitch uploaded successfully!");

      resetForm();
      if (onUploaded) onUploaded();
    } catch (err) {
      console.error("=== UPLOAD ERROR ===");
      console.error("Full error:", err);
      console.error("Status:", err?.status);
      console.error("Data:", err?.data);
      console.error("Original Error:", err?.error);

      if (err?.status === 401 || err?.status === 403) {
        toast.error("CDN Authentication failed - Check secret key");
      } else if (err?.status === "FETCH_ERROR") {
        toast.error(
          "Cannot connect to server. Check if backend is running + CORS",
        );
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Failed to upload pitch");
      }
    }
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-[85vh] pr-4">
        <div className="max-w-6xl mx-auto pb-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            {/* LEFT SIDE */}
            <Card className="rounded-2xl border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Project Information</h3>
                  <p className="text-sm text-gray-500">
                    Select existing project
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>
                    Project <span className="text-red-500">*</span>
                  </Label>
                  <Popover
                    open={openProjectCombobox}
                    onOpenChange={setOpenProjectCombobox}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                        disabled={projectsLoading}
                      >
                        {selectedProject
                          ? selectedProject.name
                          : "Select or search project..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search projects..."
                          value={projectSearch}
                          onValueChange={setProjectSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No project found.</CommandEmpty>
                          <CommandGroup>
                            {filteredProjects.map((project) => (
                              <CommandItem
                                key={project.id}
                                onSelect={() => {
                                  setSelectedProject(project);
                                  setProjectSearch("");
                                  setOpenProjectCombobox(false);
                                }}
                              >
                                <div>
                                  <p className="font-medium">{project.name}</p>
                                  {project.client?.name && (
                                    <p className="text-xs text-muted-foreground">
                                      {project.client.name}
                                    </p>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Other fields (Design Style, Color, etc.) */}
                <div className="space-y-2">
                  <Label>Preferred Design Style</Label>
                  <Input
                    value={preferredDesignStyle}
                    onChange={(e) => setPreferredDesignStyle(e.target.value)}
                    placeholder="Modern Minimal"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color Tone</Label>
                    <select
                      value={colorTone}
                      onChange={(e) => setColorTone(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
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
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Functional vs Aesthetic</Label>
                  <Textarea
                    rows={5}
                    value={functionalVsAesthetic}
                    onChange={(e) => setFunctionalVsAesthetic(e.target.value)}
                  />
                </div>

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

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option>Draft</option>
                    <option>Pending Review</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* RIGHT SIDE */}
            <Card className="rounded-2xl border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Additional Details</h3>
                </div>

                {/* Priority Areas */}
                <div className="space-y-3">
                  <Label>Priority Areas</Label>
                  <div className="flex gap-2">
                    <Input
                      value={priorityInput}
                      onChange={(e) => setPriorityInput(e.target.value)}
                      placeholder="e.g. Kitchen"
                    />
                    <Button type="button" size="icon" onClick={addPriorityArea}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {priorityAreas.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        {item}
                        <button onClick={() => removePriorityArea(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

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

                {/* File Upload */}
                <div>
                  <Label className="mb-2 block">
                    Pitch File <span className="text-red-500">*</span>
                  </Label>
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
                      if (e.dataTransfer.files?.[0])
                        handleFile(e.dataTransfer.files[0]);
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
                        <div className="text-center">
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
                        <p className="font-medium">Drag & drop your file</p>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF, PPT, PPTX, Keynote
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {progress > 0 && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-center text-gray-500">
                      {progress}% uploaded
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={
                    isCreating || isUploading || !file || !selectedProject
                  }
                  className="w-full h-12 bg-[#ef7f1b] hover:bg-[#d66e15] text-white rounded-xl"
                >
                  {isCreating || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading Pitch...
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
