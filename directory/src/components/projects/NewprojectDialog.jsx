"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Loader2,
  FolderPlus,
  CalendarDays,
  MapPin,
  Briefcase,
  User2,
} from "lucide-react";

export default function NewProjectDialog({
  open,
  onOpenChange,
  newProject,
  setNewProject,
  onCreate,
  saving,
  STAGES,
  TYPES,
}) {
  const update = (key, value) => {
    setNewProject((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-2xl overflow-hidden
          rounded-3xl border border-border
          bg-background p-0 shadow-2xl
        "
      >
        {/* Top Accent */}
        <div className="h-1 w-full bg-[#ef7f1b]" />

        {/* Header */}
        <DialogHeader className="border-b border-border px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-2xl bg-[#ef7f1b]/10
                text-[#ef7f1b]
              "
            >
              <FolderPlus className="h-6 w-6" />
            </div>

            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                Create New Project
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Add project details and initialize workflow stage.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            {/* ===================== BASIC ===================== */}

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Basic Information
                </p>

                <div className="mt-1 h-[2px] w-10 rounded-full bg-[#ef7f1b]" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Project Name *
                  </Label>

                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={newProject.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Enter project name"
                      className="
                        h-11 rounded-xl border-border
                        bg-muted/30 pl-10
                        focus-visible:ring-[#ef7f1b]
                      "
                    />
                  </div>
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Client Name
                  </Label>

                  <div className="relative">
                    <User2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={newProject.client_name}
                      onChange={(e) => update("client_name", e.target.value)}
                      placeholder="Enter client name"
                      className="
                        h-11 rounded-xl border-border
                        bg-muted/30 pl-10
                        focus-visible:ring-[#ef7f1b]
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ===================== TYPE ===================== */}

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Project Details
                </p>

                <div className="mt-1 h-[2px] w-10 rounded-full bg-[#ef7f1b]" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Type */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Project Type *
                  </Label>

                  <Select
                    value={newProject.type}
                    onValueChange={(v) => update("type", v)}
                  >
                    <SelectTrigger
                      className="
                        h-11 rounded-xl border-border
                        bg-muted/30 text-sm
                      "
                    >
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>

                    <SelectContent>
                      {TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Service Type
                  </Label>

                  <Input
                    value={newProject.service_type}
                    onChange={(e) => update("service_type", e.target.value)}
                    placeholder="Design + Execution"
                    className="
                      h-11 rounded-xl border-border
                      bg-muted/30
                      focus-visible:ring-[#ef7f1b]
                    "
                  />
                </div>
              </div>
            </div>

            {/* ===================== LOCATION ===================== */}

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Location & Workflow
                </p>

                <div className="mt-1 h-[2px] w-10 rounded-full bg-[#ef7f1b]" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Location */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Location
                  </Label>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={newProject.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="Project location"
                      className="
                        h-11 rounded-xl border-border
                        bg-muted/30 pl-10
                        focus-visible:ring-[#ef7f1b]
                      "
                    />
                  </div>
                </div>

                {/* Stage */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Starting Stage
                  </Label>

                  <Select
                    value={newProject.stage}
                    onValueChange={(v) => update("stage", v)}
                  >
                    <SelectTrigger
                      className="
                        h-11 rounded-xl border-border
                        bg-muted/30 text-sm
                      "
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ===================== DATES ===================== */}

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Timeline
                </p>

                <div className="mt-1 h-[2px] w-10 rounded-full bg-[#ef7f1b]" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Start */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Start Date
                  </Label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="date"
                      value={newProject.start_date}
                      onChange={(e) => update("start_date", e.target.value)}
                      className="
                        h-11 rounded-xl border-border
                        bg-muted/30 pl-10
                        focus-visible:ring-[#ef7f1b]
                      "
                    />
                  </div>
                </div>

                {/* Completion */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Expected Completion
                  </Label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="date"
                      value={newProject.expected_completion}
                      onChange={(e) =>
                        update("expected_completion", e.target.value)
                      }
                      className="
                        h-11 rounded-xl border-border
                        bg-muted/30 pl-10
                        focus-visible:ring-[#ef7f1b]
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter
          className="
            border-t border-border
            bg-muted/20 px-6 py-4
          "
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={onCreate}
            disabled={saving}
            className="
              rounded-xl bg-[#ef7f1b]
              px-5 text-white
              hover:bg-[#d66e15]
            "
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
