"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "@/api/projectsApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  GanttChart,
  Plus,
  ArrowUpRight,
  X,
  Loader2,
} from "lucide-react";

import { CreateProjectModal } from "@/components/projects/CreateProjectModal";

// Extracted Components
import { FilterSection } from "@/components/projects/FilterSection";
import { GridView } from "@/components/projects/GridView";
import { ListView } from "@/components/projects/ListView";
import { TimelineView } from "@/components/projects/TimelineView";
import { ProjectSheet } from "@/components/projects/ProjectSheet";

const STAGES = [
  "Brief",
  "Pitch",
  "Site Reki",
  "Scope",
  "Time & Cost",
  "BOQ",
  "Design",
  "Execution",
  "Vendor",
  "Inventory",
  "Quality",
  "Handover",
];

const TYPES = [
  "Residential",
  "Commercial",
  "Interior",
  "Architecture",
  "Renovation",
  "Infrastructure",
];

const STATUSES = ["Active", "On Hold", "Completed", "Delayed"];

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    stages: [],
    types: [],
    statuses: [],
  });
  const [sortBy, setSortBy] = useState("stage");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: projects = [], isLoading, error } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  // Map API data
  const mappedProjects = useMemo(() => {
    return projects.map((p) => ({
      id: p.id,
      name: p.name || "Untitled Project",
      client_name: p.client?.name || "—",
      type: p.project_type || p.service_type || "—",
      stage: p.current_stage || "Brief",
      progress: parseFloat(p.progress_percentage || "0"),
      location: p.site?.address || "—",
      start_date: p.created_at
        ? new Date(p.created_at).toLocaleDateString()
        : "—",
      status: p.status || "Active",
    }));
  }, [projects]);

  // Filter + Search + Sort
  const filteredProjects = useMemo(() => {
    let result = [...mappedProjects];

    // Search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((p) =>
        [p.name, p.client_name, p.type, p.stage, p.location].some((field) =>
          field?.toLowerCase().includes(term),
        ),
      );
    }

    // Filters
    if (filters.stages.length > 0) {
      result = result.filter((p) => filters.stages.includes(p.stage));
    }
    if (filters.types.length > 0) {
      result = result.filter((p) => filters.types.includes(p.type));
    }
    if (filters.statuses.length > 0) {
      result = result.filter((p) => filters.statuses.includes(p.status));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "completion") return b.progress - a.progress;
      if (sortBy === "stage") {
        return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
      }
      return 0;
    });

    return result;
  }, [mappedProjects, search, filters, sortBy]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id).unwrap();
      setSelectedProject(null);
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete project");
    }
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({ stages: [], types: [], statuses: [] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Failed to load projects. Please try again.
      </div>
    );
  }

  return (
    <div className="flex h-full" data-testid="projects-page">
      {/* Filter Sidebar */}
      {showFilters && (
        <div className="w-72 border-r border-gray-200 bg-white p-6 shrink-0 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            <FilterSection
              title="Project Stage"
              items={STAGES}
              selected={filters.stages}
              onToggle={(v) => toggleFilter("stages", v)}
            />
            <Separator />
            <FilterSection
              title="Project Type"
              items={TYPES}
              selected={filters.types}
              onToggle={(v) => toggleFilter("types", v)}
            />
            <Separator />
            <FilterSection
              title="Status"
              items={STATUSES}
              selected={filters.statuses}
              onToggle={(v) => toggleFilter("statuses", v)}
            />
          </div>

          {(filters.stages.length > 0 ||
            filters.types.length > 0 ||
            filters.statuses.length > 0) && (
            <button
              onClick={clearFilters}
              className="mt-6 text-sm text-[#ef7f1b] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-black">Projects</h1>

            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border focus-within:border-[#ef7f1b]">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="completion">Progress</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-xl overflow-hidden">
                {[
                  { mode: "grid", icon: LayoutGrid },
                  { mode: "list", icon: List },
                  { mode: "timeline", icon: GanttChart },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2.5 ${viewMode === mode ? "bg-[#ef7f1b] text-white" : "hover:bg-gray-100"}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15]"
              >
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {viewMode === "grid" && (
              <GridView
                projects={filteredProjects}
                onSelect={setSelectedProject}
              />
            )}
            {viewMode === "list" && (
              <ListView
                projects={filteredProjects}
                onSelect={setSelectedProject}
              />
            )}
            {viewMode === "timeline" && (
              <TimelineView
                projects={filteredProjects}
                onSelect={setSelectedProject}
              />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Modals */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <ProjectSheet
        project={selectedProject}
        onOpenChange={() => setSelectedProject(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
