"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useGetProjectByIdQuery } from "@/api/projectsApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
} from "lucide-react";

/* ---------------- STAGES ---------------- */

const STAGES = [
  "Brief",
  "Pitch",
  "Reki",
  "Scope",
  "BOQ",
  "Design",
  "Execution",
  "Handover",
];

/* ---------------- HELPERS ---------------- */

const getStageIcon = (status) => {
  if (status === "done")
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === "blocked")
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-yellow-500" />;
};

const isFilled = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === "object") return Object.keys(val).length > 0;
  return true;
};

const safeDate = (date) => {
  if (!date || date === "0000-00-00") return "Not scheduled";
  return new Date(date).toLocaleDateString();
};

/* ---------------- PAGE ---------------- */

export default function ProjectViewPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [activeStage, setActiveStage] = useState("Brief");

  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  if (!projectId) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Missing projectId in URL
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading project...
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load project
      </div>
    );
  }

  /* ---------------- STAGE DATA (DYNAMIC) ---------------- */

  const stageData = {
    Brief: {
      status: isFilled(project.brief) ? "done" : "pending",
      title: "Project Brief",
      description: "Client requirements",
      content: project.brief,
    },
    Pitch: {
      status: project.pitch?.status === "Draft" ? "pending" : "done",
      title: "Pitch",
      description: "Design proposal",
      content: project.pitch,
    },
    Reki: {
      status: project.reki ? "done" : "pending",
      title: "Reki",
      description: "Site survey",
      content: project.reki,
    },
    Scope: {
      status: project.scope ? "done" : "pending",
      title: "Scope",
      description: "Scope definition",
      content: project.scope,
    },
    BOQ: {
      status: project.costEstimates?.length ? "done" : "pending",
      title: "BOQ",
      description: "Cost estimation",
      content: project.costEstimates,
    },
    Design: {
      status: project.drawings?.length ? "done" : "pending",
      title: "Design",
      description: "Design phase",
      content: project.drawings,
    },
    Execution: {
      status: project.status === "execution" ? "done" : "pending",
      title: "Execution",
      description: "Work progress",
      content: null,
    },
    Handover: {
      status: project.is_completed ? "done" : "pending",
      title: "Handover",
      description: "Final delivery",
      content: null,
    },
  };

  const current = stageData[activeStage];

  return (
    <div className="h-screen flex bg-background">
      {/* LEFT PANEL */}
      <div className="w-80 border-r p-5 space-y-5">
        <div>
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            {project.client?.name}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge>{project.status}</Badge>
          <Badge variant="outline">{project.project_type}</Badge>
        </div>

        <Separator />

        <div className="text-sm text-muted-foreground space-y-1">
          <p>Progress: {project.progress_percentage}%</p>
          <p>Location: {project.site?.address || "-"}</p>
        </div>

        <Separator />

        <Button className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          View Full Project
        </Button>

        <Button variant="outline" className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Comments
        </Button>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b">
          <h2 className="font-semibold">Project Stages</h2>
          <p className="text-sm text-muted-foreground">
            Select a stage to view details
          </p>
        </div>

        {/* STAGES */}
        <div className="p-5 flex gap-3 overflow-x-auto border-b">
          {STAGES.map((stage) => {
            const data = stageData[stage];

            return (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={`min-w-[160px] p-3 rounded-xl border transition ${
                  activeStage === stage
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{stage}</span>
                  {getStageIcon(data.status)}
                </div>
                <p className="text-xs mt-1 opacity-70">{data.status}</p>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 p-6">
          <Card className="p-6 w-full">
            <h3 className="text-lg font-semibold">{current.title}</h3>

            <p className="text-sm text-muted-foreground mt-1">
              {current.description}
            </p>

            <Separator className="my-4" />

            {/* STAGE CONTENT */}
            {!current.content ? (
              <div className="text-sm text-muted-foreground">
                No data yet for this stage
              </div>
            ) : (
              <div className="text-sm space-y-2">
                {activeStage === "Reki" && project.reki && (
                  <>
                    <p>
                      Client Present:{" "}
                      {project.reki.client_present ? "Yes" : "No"}
                    </p>
                    <p>
                      Road Access: {project.reki.road_access ? "Yes" : "No"}
                    </p>
                    <p>
                      Structural Cracks:{" "}
                      {project.reki.structural_cracks ? "Yes" : "No"}
                    </p>
                    <p>Dampness: {project.reki.dampness ? "Yes" : "No"}</p>
                    <p>
                      Termite Damage:{" "}
                      {project.reki.termite_damage ? "Yes" : "No"}
                    </p>
                    <p>
                      Demolition Required:{" "}
                      {project.reki.demolition_required ? "Yes" : "No"}
                    </p>
                  </>
                )}

                {activeStage === "Pitch" && project.pitch && (
                  <>
                    <p>Status: {project.pitch.status}</p>
                    <p>Luxury Level: {project.pitch.luxury_level}</p>
                    <p>Color Tone: {project.pitch.color_tone}</p>

                    {project.pitch.pitch_pdf_url && (
                      <a
                        className="text-blue-500 underline"
                        href={project.pitch.pitch_pdf_url}
                        target="_blank"
                      >
                        View Pitch PDF
                      </a>
                    )}
                  </>
                )}

                {activeStage !== "Reki" && activeStage !== "Pitch" && (
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                    {JSON.stringify(current.content, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
