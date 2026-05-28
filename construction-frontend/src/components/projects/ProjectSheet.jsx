import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Upload, Trash2 } from "lucide-react";
import { InfoRow } from "./InfoRow";
import Link from "next/link";
const STAGE_ROUTE_MAP = {
  Brief: "brief",
  Pitch: "pitch",
  "Site Reki": "site-reki",
  Scope: "scope",
  "Time & Cost": "time-cost",
  BOQ: "boq",
  Design: "design",
  Execution: "execution",
  Vendor: "vendor",
  Inventory: "inventory",
  Quality: "quality",
  Handover: "handover",
};
export function ProjectSheet({ project, onOpenChange, onDelete }) {
  if (!project) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Delayed":
        return "bg-red-50 text-red-700 border-red-200";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "On Hold":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStageRoute = (stageName) => {
    const slug = STAGE_ROUTE_MAP[stageName];
    if (!slug) return "#";
    return `/projects/${project.id}/${slug}`;
  };
  const stageInfo = {
    Brief: {
      covered:
        "Client requirements, project objectives, budget range, timeline expectations",
      happening:
        "Client meeting notes, requirement gathering, initial feasibility check",
      status: project.stage === "Brief" ? "In Progress" : "Completed",
    },
    Pitch: {
      covered: "Concept presentation, mood boards, 3D views, cost indication",
      happening: "Design team working on pitch deck and visual proposals",
      status:
        project.stage === "Pitch"
          ? "In Progress"
          : project.stage === "Brief"
            ? "Pending"
            : "Completed",
    },
    "Site Reki": {
      covered:
        "Site survey, photographs, measurements, soil test, surrounding analysis",
      happening: "Team visiting site and preparing detailed reki report",
      status: project.stage === "Site Reki" ? "In Progress" : "Pending",
    },
    Scope: {
      covered: "Detailed scope of work, inclusions & exclusions, deliverables",
      happening: "Finalizing scope document with client",
      status: "Pending",
    },
    "Time & Cost": {
      covered: "Detailed cost estimation, BOQ, timeline scheduling",
      happening: "Costing team preparing estimates",
      status: "Pending",
    },
    Design: {
      covered: "Architectural & interior drawings, 3D renders",
      happening: "Design development in progress",
      status: "Pending",
    },
    Execution: {
      covered: "On-site construction and execution",
      happening: "Site work ongoing",
      status: "Pending",
    },
  };

  return (
    <Sheet open={!!project} onOpenChange={onOpenChange}>
      <SheetContent className="w-[440px] sm:w-[520px] overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <SheetTitle className="text-xl">{project.name}</SheetTitle>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">{project.client_name}</p>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* OVERVIEW */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
            <InfoRow icon="User" label="Client" value={project.client_name} />
            <InfoRow icon="MapPin" label="Location" value={project.location} />
            <InfoRow icon="FileText" label="Type" value={project.type} />
            <InfoRow icon="Clock" label="Current Stage" value={project.stage} />
            <InfoRow
              icon="Calendar"
              label="Start Date"
              value={project.start_date}
            />
          </div>

          <Separator />

          {/* PROGRESS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Overall Progress
              </p>
              <span className="text-2xl font-bold text-[#ef7f1b]">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>

          <Separator />

          {/* STAGE TABS */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              STAGE PROGRESS & STATUS
            </p>

            <Tabs defaultValue={project.stage || "Brief"} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                {Object.keys(stageInfo).map((stage) => (
                  <TabsTrigger key={stage} value={stage} className="text-xs">
                    {stage}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(stageInfo).map(([stageName, info]) => (
                <TabsContent
                  key={stageName}
                  value={stageName}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{info.status}</Badge>

                    {project.stage === stageName && (
                      <Badge className="bg-[#ef7f1b] text-white">
                        Current Stage
                      </Badge>
                    )}
                  </div>

                  {/* COVERED */}
                  <div>
                    <Link
                      href={getStageRoute(stageName)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Open {stageName} Details →
                    </Link>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Separator />

          {/* ACTIONS */}
          <div className="space-y-3">
            <Link href={`/projects/view?projectId=${project.id}`}>
              <Button className="w-full bg-[#ef7f1b] hover:bg-[#d66e15]">
                <Eye className="w-4 h-4 mr-2" />
                View Full Project Dashboard
              </Button>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>

              <Button
                variant="outline"
                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  if (confirm("Delete this project?")) {
                    onDelete(project.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
