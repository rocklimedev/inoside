"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useGetProjectByIdQuery } from "@/api/projectsApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Eye,
  MessageSquare,
  MapPin,
  Building2,
  ChevronRight,
  FileText,
  Layers3,
  Menu,
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
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === "blocked")
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  return <Clock3 className="h-5 w-5 text-amber-500" />;
};

const getStageStyles = (active, status) => {
  if (active) {
    return "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]";
  }
  if (status === "done") {
    return "border-green-200 bg-green-50 hover:bg-green-100 dark:bg-green-950/50";
  }
  return "hover:bg-muted/70 border-border";
};

const isFilled = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === "object") return Object.keys(val).length > 0;
  return true;
};

export default function ProjectViewPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [activeStage, setActiveStage] = useState("Brief");
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Missing projectId in URL
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading project...
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load project
      </div>
    );
  }

  /* ---------------- STAGE DATA ---------------- */
  const stageData = {
    Brief: {
      status: isFilled(project.brief) ? "done" : "pending",
      title: "Project Brief",
      description: "Client requirements and project goals",
      content: project.brief,
    },
    Pitch: {
      status: project.pitch?.status === "Draft" ? "pending" : "done",
      title: "Pitch",
      description: "Design proposal and visual direction",
      content: project.pitch,
    },
    Reki: {
      status: project.reki ? "done" : "pending",
      title: "Reki",
      description: "Site inspection and survey details",
      content: project.reki,
    },
    Scope: {
      status: project.scope ? "done" : "pending",
      title: "Scope",
      description: "Scope definition and deliverables",
      content: project.scope,
    },
    BOQ: {
      status: project.costEstimates?.length ? "done" : "pending",
      title: "BOQ",
      description: "Budget and quantity estimation",
      content: project.costEstimates,
    },
    Design: {
      status: project.drawings?.length ? "done" : "pending",
      title: "Design",
      description: "Drawings and design assets",
      content: project.drawings,
    },
    Execution: {
      status: project.status === "execution" ? "done" : "pending",
      title: "Execution",
      description: "Execution and on-site updates",
      content: null,
    },
    Handover: {
      status: project.is_completed ? "done" : "pending",
      title: "Handover",
      description: "Final delivery and closure",
      content: null,
    },
  };

  const current = stageData[activeStage];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex flex-col lg:flex-row">
        {/* ==================== MOBILE HEADER ==================== */}
        <div className="lg:hidden border-b bg-background sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Layers3 className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-xl">{project.name}</h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* ==================== SIDEBAR ==================== */}
        <aside
          className={`
          ${showSidebar ? "block" : "hidden"} 
          lg:block w-full lg:w-96 border-r bg-background lg:sticky lg:top-0 lg:h-screen overflow-auto
        `}
        >
          <div className="p-6 space-y-6">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {project.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{project.client?.name || "No Client"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="capitalize text-sm px-3 py-1">
                    {project.status}
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {project.project_type}
                  </Badge>
                </div>

                <Separator />

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Overall Progress
                    </span>
                    <span className="font-semibold text-primary">
                      {project.progress_percentage || 0}%
                    </span>
                  </div>
                  <Progress
                    value={project.progress_percentage || 0}
                    className="h-3"
                  />
                </div>

                {/* Location */}
                <div className="flex gap-4 bg-muted/60 rounded-2xl p-4">
                  <MapPin className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Site Location</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.site?.address || "No address available"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button className="w-full h-12 rounded-2xl text-base">
                      <Eye className="mr-2 h-5 w-5" />
                      View Full Project
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-2xl text-base"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Comments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Status */}
            <Card className="border-0 shadow">
              <CardHeader>
                <CardTitle>Workflow Status</CardTitle>
                <CardDescription>Project pipeline overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {STAGES.map((stage) => {
                  const item = stageData[stage];
                  return (
                    <div
                      key={stage}
                      className="flex items-center justify-between p-4 rounded-2xl border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveStage(stage);
                        setShowSidebar(false); // Close sidebar on mobile
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {getStageIcon(item.status)}
                        <div>
                          <p className="font-medium">{stage}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {item.status}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-40 hidden lg:block">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4">
                <Layers3 className="h-7 w-7 text-primary" />
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Project Workflow
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Track every stage of your project journey
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-8 pb-6">
              <Tabs value={activeStage}>
                <TabsList className="inline-flex h-auto bg-transparent p-1 gap-3 overflow-x-auto w-full scrollbar-hide">
                  {STAGES.map((stage) => {
                    const data = stageData[stage];
                    return (
                      <TabsTrigger
                        key={stage}
                        value={stage}
                        onClick={() => setActiveStage(stage)}
                        className={`
                          min-w-[170px] rounded-2xl border px-5 py-4 transition-all data-[state=active]:shadow-xl
                          ${getStageStyles(activeStage === stage, data.status)}
                        `}
                      >
                        <div className="w-full text-left">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{stage}</span>
                            {getStageIcon(data.status)}
                          </div>
                          <p className="text-xs opacity-75 mt-1 capitalize">
                            {data.status}
                          </p>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Stage Content */}
          <div className="p-6 lg:p-8">
            <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-6 px-8 pt-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl">{current.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {current.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      current.status === "done" ? "default" : "secondary"
                    }
                    className="text-sm px-4 py-2 capitalize self-start"
                  >
                    {current.status}
                  </Badge>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-8">
                {!current.content ? (
                  <div className="rounded-3xl border border-dashed py-20 text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                    <h3 className="text-2xl font-semibold">
                      Stage Not Completed
                    </h3>
                    <p className="text-muted-foreground mt-3 max-w-sm mx-auto">
                      This stage is still pending. Data will appear here once
                      completed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Reki Specific */}
                    {activeStage === "Reki" && project.reki && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            label: "Client Present",
                            value: project.reki.client_present,
                          },
                          {
                            label: "Road Access",
                            value: project.reki.road_access,
                          },
                          {
                            label: "Structural Cracks",
                            value: project.reki.structural_cracks,
                          },
                          { label: "Dampness", value: project.reki.dampness },
                          {
                            label: "Termite Damage",
                            value: project.reki.termite_damage,
                          },
                          {
                            label: "Demolition Required",
                            value: project.reki.demolition_required,
                          },
                        ].map((item) => (
                          <Card key={item.label} className="rounded-2xl">
                            <CardContent className="p-6 flex items-center justify-between">
                              <div>
                                <p className="text-muted-foreground">
                                  {item.label}
                                </p>
                                <p className="font-semibold text-lg mt-1">
                                  {item.value ? "Yes" : "No"}
                                </p>
                              </div>
                              <CheckCircle2
                                className={`h-8 w-8 ${item.value ? "text-green-500" : "text-muted-foreground"}`}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Pitch Specific */}
                    {activeStage === "Pitch" && project.pitch && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="rounded-2xl">
                          <CardContent className="p-6">
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-semibold mt-2 text-lg">
                              {project.pitch.status}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="rounded-2xl">
                          <CardContent className="p-6">
                            <p className="text-muted-foreground">
                              Luxury Level
                            </p>
                            <p className="font-semibold mt-2 text-lg">
                              {project.pitch.luxury_level}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="rounded-2xl">
                          <CardContent className="p-6">
                            <p className="text-muted-foreground">Color Tone</p>
                            <p className="font-semibold mt-2 text-lg">
                              {project.pitch.color_tone}
                            </p>
                          </CardContent>
                        </Card>

                        {project.pitch.pitch_pdf_url && (
                          <div className="sm:col-span-3 mt-4">
                            <a
                              href={project.pitch.pitch_pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="lg" className="rounded-2xl">
                                View Pitch PDF
                              </Button>
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Default JSON View */}
                    {activeStage !== "Pitch" && activeStage !== "Reki" && (
                      <div className="rounded-2xl bg-muted/70 border p-6 overflow-auto max-h-[70vh]">
                        <pre className="text-sm text-muted-foreground">
                          {JSON.stringify(current.content, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
