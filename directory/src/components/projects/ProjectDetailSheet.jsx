"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  User,
  MapPin,
  FileText,
  Clock,
  Calendar,
  Eye,
  Upload,
  Trash2,
} from "lucide-react";

import { InfoRow } from "./InfoRow";

export default function ProjectDetailSheet({
  selectedProject,
  setSelectedProject,
  onDelete,
  isDeleting,
}) {
  if (!selectedProject) return null;

  return (
    <Sheet
      open={!!selectedProject}
      onOpenChange={() => setSelectedProject(null)}
    >
      <SheetContent className="w-[420px] sm:w-[500px] overflow-y-auto border-l border-border bg-card p-0">
        {/* Header */}
        <SheetHeader className="border-b border-border bg-background px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <SheetTitle className="truncate text-2xl font-black tracking-tight text-foreground">
                {selectedProject.name}
              </SheetTitle>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-orange-50 text-[10px] font-semibold text-[#ef7f1b]">
                  {selectedProject.stage || "Stage"}
                </Badge>

                {selectedProject.type && (
                  <Badge
                    variant="outline"
                    className="border-border text-[10px]"
                  >
                    {selectedProject.type}
                  </Badge>
                )}

                {selectedProject.status && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-medium"
                  >
                    {selectedProject.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">
          {/* Project Information */}
          <section className="animate-fadeInUp">
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Project Information
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-border bg-background p-4 shadow-sm">
              <InfoRow
                icon={User}
                label="Client"
                value={selectedProject.client_name || "—"}
              />

              <InfoRow
                icon={MapPin}
                label="Location"
                value={selectedProject.location || "—"}
              />

              <InfoRow
                icon={FileText}
                label="Type"
                value={selectedProject.type || "—"}
              />

              <InfoRow
                icon={Clock}
                label="Stage"
                value={selectedProject.stage || "—"}
              />

              <InfoRow
                icon={Calendar}
                label="Start Date"
                value={selectedProject.start_date || "—"}
              />

              <InfoRow
                icon={Calendar}
                label="Expected Completion"
                value={selectedProject.expected_completion || "—"}
              />
            </div>
          </section>

          <Separator />

          {/* Progress */}
          <section className="animate-fadeIn">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Progress
              </p>

              <span className="text-sm font-black text-foreground">
                {selectedProject.completion || 0}%
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <Progress
                value={selectedProject.completion || 0}
                className="progress-orange h-2"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  Last activity: {selectedProject.last_activity || "No updates"}
                </span>

                {selectedProject.has_delay && (
                  <span className="font-semibold text-red-600">Delayed</span>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* Team */}
          <section className="animate-fadeIn">
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Assigned Team
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              {(selectedProject.team || []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedProject.team.map((member, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-[11px]"
                    >
                      {member}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No team assigned
                </p>
              )}
            </div>
          </section>

          <Separator />

          {/* Actions */}
          <section className="animate-fadeIn pb-2">
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Actions
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-11 rounded-xl border-border bg-background text-xs font-semibold hover:border-[#ef7f1b]/30 hover:bg-orange-50 hover:text-[#ef7f1b]"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-xl border-border bg-background text-xs font-semibold hover:border-[#ef7f1b]/30 hover:bg-orange-50 hover:text-[#ef7f1b]"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>

              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={() => onDelete(selectedProject.id)}
                className="h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {isDeleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
