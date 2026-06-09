"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetProjectByIdQuery } from "@/api/projectsApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, User, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

const MODULES = [
  "Brief",
  "Pitch",
  "Site Reki",
  "Scope of Work",
  "Time & Cost",
  "BOQ",
  "Design",
  "Execution",
  "Handover",
];

export default function ProjectViewPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  const [activeTab, setActiveTab] = useState("Scope of Work");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 text-red-500">
        Project not found or failed to load.
      </div>
    );
  }

  const p = project; // for easier access

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-black">{p.name}</h1>
          <p className="text-gray-500 mt-1">
            {p.project_type} • {p.service_type}
          </p>
        </div>
        <Badge className="ml-auto text-sm" variant="outline">
          {p.current_stage}
        </Badge>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#ef7f1b]" />
            <div>
              <p className="text-xs text-gray-500">Client</p>
              <p className="font-medium">{p.client?.name}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#ef7f1b]" />
            <div>
              <p className="text-xs text-gray-500">Timeline</p>
              <p className="font-medium">{p.timeline_expectation}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#ef7f1b]" />
            <div>
              <p className="text-xs text-gray-500">Purpose</p>
              <p className="font-medium">{p.purpose}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#ef7f1b]" />
            <div>
              <p className="text-xs text-gray-500">Progress</p>
              <p className="font-medium">{p.progress_percentage}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 bg-gray-100 p-1">
          {MODULES.map((module) => (
            <TabsTrigger
              key={module}
              value={module}
              className="text-xs data-[state=active]:bg-white data-[state=active]:shadow"
            >
              {module}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Brief */}
        {/* Brief */}
        <TabsContent value="Brief" className="mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Project Brief</h3>

            {p.brief ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <strong>Rooms / Spaces Required:</strong>
                    <p className="mt-1 text-gray-600">
                      {p.brief.rooms_spaces_required || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <strong>Parking Required:</strong>
                    <p className="mt-1 text-gray-600">
                      {p.brief.parking_required ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <strong>First Construction Project:</strong>
                    <p className="mt-1 text-gray-600">
                      {p.brief.first_construction_project ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <strong>End-to-End Services:</strong>
                    <p className="mt-1 text-gray-600">
                      {p.brief.end_to_end_services ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <strong>Decision Readiness:</strong>
                    <p className="mt-1 text-gray-600">
                      {p.brief.decision_readiness || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <strong>Status:</strong>
                    <Badge
                      variant={p.brief.is_approved ? "default" : "secondary"}
                    >
                      {p.brief.status}
                    </Badge>
                  </div>
                </div>

                {p.brief.output_client_profile && (
                  <div>
                    <strong>Client Profile:</strong>
                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                      {p.brief.output_client_profile}
                    </p>
                  </div>
                )}

                {p.brief.output_project_profile && (
                  <div>
                    <strong>Project Profile:</strong>
                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                      {p.brief.output_project_profile}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No brief filled yet.</p>
            )}
          </Card>
        </TabsContent>
        {/* Pitch */}
        <TabsContent value="Pitch" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">Pitch Details</h3>
              <Badge
                className={
                  p.pitch?.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : ""
                }
              >
                {p.pitch?.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <strong>Luxury Level:</strong> {p.pitch?.luxury_level}
              </div>
              <div>
                <strong>Color Tone:</strong> {p.pitch?.color_tone}
              </div>
              <div>
                <strong>Budget Flexibility:</strong>{" "}
                {p.pitch?.budget_flexibility ? "Yes" : "No"}
              </div>
              {p.pitch?.pitch_pdf_url && (
                <div className="col-span-2">
                  <a
                    href={p.pitch.pitch_pdf_url}
                    target="_blank"
                    className="text-[#ef7f1b] hover:underline flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> View Pitch PDF
                  </a>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Site Reki */}
        <TabsContent value="Site Reki" className="mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Site Reconnaissance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Existing Structure:</strong>{" "}
                {p.reki?.existing_structure ? "Yes" : "No"}
              </div>
              <div>
                <strong>Floors:</strong> {p.reki?.existing_floors}
              </div>
              <div>
                <strong>Structural Cracks:</strong>{" "}
                {p.reki?.structural_cracks ? "Yes" : "No"}
              </div>
              <div>
                <strong>Dampness:</strong> {p.reki?.dampness ? "Yes" : "No"}
              </div>
              <div>
                <strong>Termite Damage:</strong>{" "}
                {p.reki?.termite_damage ? "Yes" : "No"}
              </div>
              <div>
                <strong>Demolition Required:</strong>{" "}
                {p.reki?.demolition_required ? "Yes" : "No"}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Scope of Work */}
        <TabsContent value="Scope of Work" className="mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Scope Summary</h3>
            <p className="mb-6 text-gray-700">{p.scope?.scope_summary}</p>

            <div className="space-y-8">
              <ScopeSection title="Civil Works" items={p.scope?.civil_works} />
              <ScopeSection title="MEP Works" items={p.scope?.mep_works} />
              <ScopeSection
                title="Interior Works"
                items={p.scope?.interior_works}
              />
              <ScopeSection title="Finishes" items={p.scope?.finishes} />
              <ScopeSection
                title="Area Summary"
                items={p.scope?.area_summary}
              />
            </div>
          </Card>
        </TabsContent>

        {/* Other Tabs (Placeholder) */}
        {["Time & Cost", "BOQ", "Design", "Execution", "Handover"].map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-3">{tab}</h3>
                <p className="text-gray-500">
                  Content for <strong>{tab}</strong> will be populated here.
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  You can extend this easily by adding logic similar to above
                  tabs.
                </p>
              </Card>
            </TabsContent>
          ),
        )}
      </Tabs>
    </div>
  );
}

function ScopeSection({ title, items }) {
  // Handle null, undefined, or non-array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-sm">{item?.title || "No title"}</p>
            <p className="text-xs text-gray-600 mt-1">
              {item?.description || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
