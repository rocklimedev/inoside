"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "@/api/projectsApi";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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
  X,
  Loader2,
  Trash2,
} from "lucide-react";

import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
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
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: projects = [], isLoading, error } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const mappedProjects = useMemo(() => {
    return projects.map((p) => ({
      id: p.id,
      name: p.name || "Untitled Project",
      client_name: p.client?.name || "—",
      type: p.project_type || p.service_type || "—",
      stage: p.current_stage || "Brief",
      progress: parseFloat(p.progress_percentage || "0"),

      location: p.site?.address
        ? [
            p.site.address.line1,
            p.site.address.line2,
            p.site.address.city,
            p.site.address.state,
          ]
            .filter(Boolean)
            .join(", ")
        : "—",

      start_date: p.created_at
        ? new Date(p.created_at).toLocaleDateString()
        : "—",

      status: p.status || "Active",
    }));
  }, [projects]);
  const filteredProjects = useMemo(() => {
    let result = [...mappedProjects];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((p) =>
        [p.name, p.client_name, p.type, p.stage, p.location].some((f) =>
          f?.toLowerCase().includes(term),
        ),
      );
    }

    if (filters.stages.length)
      result = result.filter((p) => filters.stages.includes(p.stage));

    if (filters.types.length)
      result = result.filter((p) => filters.types.includes(p.type));

    if (filters.statuses.length)
      result = result.filter((p) => filters.statuses.includes(p.status));

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "completion") return b.progress - a.progress;
      if (sortBy === "stage")
        return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
      return 0;
    });

    return result;
  }, [mappedProjects, search, filters, sortBy]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} projects?`)) return;

    try {
      await Promise.all(selectedIds.map((id) => deleteProject(id).unwrap()));
      toast.success("Projects deleted");
      clearSelection();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleMoveToNextStage = async (project) => {
    const i = STAGES.indexOf(project.stage);
    if (i === -1 || i === STAGES.length - 1) return;

    const next = STAGES[i + 1];

    try {
      await updateProject({
        id: project.id,
        current_stage: next,
        progress: Math.min(100, project.progress + 8),
      }).unwrap();

      toast.success(`Moved to ${next}`);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete project?")) return;
    await deleteProject(id);
    setSelectedProject(null);
    toast.success("Deleted");
  };

  const actions = {
    onView: setSelectedProject,
    onEdit: setSelectedProject,
    onDelete: handleDelete,
    onMoveNext: handleMoveToNextStage,
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !showCreateModal) {
        e.preventDefault();
        document.querySelector("input")?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        setShowCreateModal(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showCreateModal]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Failed to load projects
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* FILTER DRAWER */}
      {showFilters && (
        <div className="fixed md:static inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 md:hidden"
            onClick={() => setShowFilters(false)}
          />
          <div className="relative w-72 bg-white border-r p-6 overflow-auto">
            <div className="flex justify-between mb-6">
              <h2 className="font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X />
              </button>
            </div>

            <FilterSection
              title="Stage"
              items={STAGES}
              selected={filters.stages}
              onToggle={(v) =>
                setFilters((p) => ({
                  ...p,
                  stages: p.stages.includes(v)
                    ? p.stages.filter((x) => x !== v)
                    : [...p.stages, v],
                }))
              }
            />

            <Separator className="my-4" />

            <FilterSection
              title="Type"
              items={TYPES}
              selected={filters.types}
              onToggle={(v) =>
                setFilters((p) => ({
                  ...p,
                  types: p.types.includes(v)
                    ? p.types.filter((x) => x !== v)
                    : [...p.types, v],
                }))
              }
            />

            <Separator className="my-4" />

            <FilterSection
              title="Status"
              items={STATUSES}
              selected={filters.statuses}
              onToggle={(v) =>
                setFilters((p) => ({
                  ...p,
                  statuses: p.statuses.includes(v)
                    ? p.statuses.filter((x) => x !== v)
                    : [...p.statuses, v],
                }))
              }
            />
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-3 md:p-6 border-b bg-white">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>

            <div className="flex-1 md:max-w-md">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="w-4 h-4 mr-1" /> Filters
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 md:w-40">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="completion">Progress</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                {[
                  { m: "grid", i: LayoutGrid },
                  { m: "list", i: List },
                  { m: "timeline", i: GanttChart },
                ].map(({ m, i: Icon }) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`p-2 ${
                      viewMode === m ? "bg-orange-500 text-white" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <Button
                className="bg-orange-500"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-1" /> New
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {filteredProjects.length} projects
          </p>
        </div>

        {/* CONTENT */}
        <ScrollArea className="flex-1">
          <div className="p-3 md:p-6">
            {viewMode === "grid" && (
              <GridView
                projects={filteredProjects}
                onSelect={setSelectedProject}
                actions={actions}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
              />
            )}

            {viewMode === "list" && (
              <ListView
                projects={filteredProjects}
                actions={actions}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
              />
            )}

            {viewMode === "timeline" && (
              <TimelineView projects={filteredProjects} actions={actions} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* MODALS */}
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
