"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SiteWorkspace from "@/components/site-coordination/SiteWorkplace";

export default function SiteCoordinationPage() {
  const { api } = useAuth();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("project_id");

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Projects
  useEffect(() => {
    if (!api) {
      setLoading(false);
      return;
    }

    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [api]);

  // Auto select from URL
  useEffect(() => {
    if (!projectIdFromUrl || projects.length === 0) return;
    const found = projects.find((p) => p.id === projectIdFromUrl);
    if (found) setSelectedProject(found);
  }, [projectIdFromUrl, projects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (selectedProject) {
    return (
      <SiteWorkspace
        project={selectedProject}
        api={api}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="site-coord-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-black text-black">Site Coordination</h1>
        <p className="text-xs text-gray-400 mt-1">
          Select a project for site updates
        </p>
      </div>

      <div className="p-4 md:p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects
            .filter(
              (p) =>
                !search || p.name?.toLowerCase().includes(search.toLowerCase()),
            )
            .map((p) => (
              <Card
                key={p.id}
                className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer"
                onClick={() => setSelectedProject(p)}
              >
                <h3 className="text-sm font-bold text-black">{p.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1">
                  {p.client_name} · {p.stage}
                </p>
                {p.location && (
                  <p className="text-[10px] text-gray-400">{p.location}</p>
                )}
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
