"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";

import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
} from "@/api/projectApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";

import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Plus,
  X,
} from "lucide-react";

import { FilterSection } from "@/components/projects/FilterSection";

import NewProjectDialog from "@/components/projects/NewprojectDialog";

import { Card } from "@/components/ui/card";

// ===================== CONSTANTS =====================

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

// ===================== MAIN COMPONENT =====================

export default function ProjectsPage() {
  const { api } = useAuth();

  // ===================== API =====================

  const {
    data: projectsData = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllProjectsQuery();

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // ===================== STATES =====================

  const [viewMode, setViewMode] = useState("grid");

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    stages: [],
    types: [],
    statuses: [],
  });

  const [sortBy, setSortBy] = useState("name");

  const [showNewProject, setShowNewProject] = useState(false);

  const [saving, setSaving] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    client_name: "",
    type: "",
    service_type: "",
    location: "",
    stage: "Brief",
    start_date: "",
    expected_completion: "",
  });

  // ===================== CREATE PROJECT =====================

  const handleCreate = async () => {
    if (!newProject.name || !newProject.type) {
      toast.error("Project Name and Project Type are required");
      return;
    }

    setSaving(true);

    try {
      await api.post("/projects", newProject);

      toast.success("Project created successfully");

      setShowNewProject(false);

      setNewProject({
        name: "",
        client_name: "",
        type: "",
        service_type: "",
        location: "",
        stage: "Brief",
        start_date: "",
        expected_completion: "",
      });

      refetch();
    } catch (err) {
      toast.error("Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  // ===================== DELETE =====================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    try {
      await deleteProject(id).unwrap();

      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  // ===================== FILTER TOGGLE =====================

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // ===================== FILTERED DATA =====================

  const filtered = useMemo(() => {
    let result = [...projectsData];

    // Search
    if (search) {
      const s = search.toLowerCase();

      result = result.filter((p) =>
        [p.name, p.client_name, p.type, p.stage, p.location].some((field) =>
          field?.toLowerCase().includes(s),
        ),
      );
    }

    // Filters
    if (filters.stages.length) {
      result = result.filter((p) => filters.stages.includes(p.stage));
    }

    if (filters.types.length) {
      result = result.filter((p) => filters.types.includes(p.type));
    }

    if (filters.statuses.length) {
      result = result.filter((p) =>
        filters.statuses.includes(p.status || "Active"),
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "completion") {
        return (b.completion || 0) - (a.completion || 0);
      }

      if (sortBy === "stage") {
        return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
      }

      return 0;
    });

    return result;
  }, [projectsData, search, filters, sortBy]);

  // ===================== LOADING =====================

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafafa]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#ef7f1b] border-t-transparent" />
      </div>
    );
  }

  // ===================== ERROR =====================

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <p className="text-sm font-medium text-red-600">
          Failed to load projects
        </p>

        <Button
          onClick={() => refetch()}
          className="bg-[#ef7f1b] text-white hover:bg-[#d66e15]"
        >
          Retry
        </Button>
      </div>
    );
  }

  // ===================== UI =====================

  return (
    <div
      className="flex h-full overflow-hidden bg-[#fafafa]"
      data-testid="projects-page"
    >
      {/* ===================== FILTER SIDEBAR ===================== */}

      {showFilters && (
        <div className="animate-slideInRight w-[270px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white px-5 py-5 shadow-sm">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-black">
                Filters
              </h3>

              <p className="mt-1 text-[11px] text-gray-400">
                Refine your projects
              </p>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Sections */}
          <div className="space-y-5">
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
              onClick={() =>
                setFilters({
                  stages: [],
                  types: [],
                  statuses: [],
                })
              }
              className="mt-5 text-xs font-semibold text-[#ef7f1b] transition hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ===================== MAIN ===================== */}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ===================== HEADER ===================== */}

        <div className="animate-fadeIn border-b border-gray-200 bg-white px-4 py-5 shadow-sm md:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-black tracking-tight text-black">
                Projects
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                {filtered.length} project
                {filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative min-w-[240px] flex-1 xl:w-[320px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 border-gray-200 bg-gray-50 pl-10 text-sm focus-visible:ring-[#ef7f1b]"
                />
              </div>

              {/* Filter */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 border-gray-200 ${
                  showFilters ? "border-[#ef7f1b] text-[#ef7f1b]" : ""
                }`}
              >
                <Filter className="mr-1 h-4 w-4" />
                Filter
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 w-[140px] border-gray-200 text-xs">
                  <ArrowUpDown className="mr-1 h-3 w-3" />

                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>

                  <SelectItem value="completion">Progress</SelectItem>

                  <SelectItem value="stage">Stage</SelectItem>
                </SelectContent>
              </Select>

              {/* View Switch */}
              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
                {[
                  {
                    mode: "grid",
                    icon: LayoutGrid,
                  },
                  {
                    mode: "list",
                    icon: List,
                  },
                ].map((v) => (
                  <button
                    key={v.mode}
                    onClick={() => setViewMode(v.mode)}
                    className={`p-2 transition-all ${
                      viewMode === v.mode
                        ? "bg-[#ef7f1b] text-white"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <v.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              {/* Add */}
              <Button
                onClick={() => setShowNewProject(true)}
                className="h-10 bg-[#ef7f1b] text-white hover:bg-[#d66e15]"
              >
                <Plus className="mr-1 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* ===================== CONTENT ===================== */}

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            {/* GRID VIEW */}
            {viewMode === "grid" && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}/inventory`}
                  >
                    <Card className="cursor-pointer border border-gray-200 p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-black">
                            {project.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {project.client_name}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-[#ef7f1b]">
                            {project.type}
                          </span>

                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {project.stage}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500">
                          {project.location}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {filtered.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <Link
                      href={`/projects/${project.id}/inventory`}
                      className="flex flex-1 items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-black">
                          {project.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {project.client_name}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-[#ef7f1b]">
                          {project.type}
                        </span>

                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {project.stage}
                        </span>
                      </div>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => handleDelete(project.id)}
                      className="ml-4"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ===================== DIALOG ===================== */}

      <NewProjectDialog
        open={showNewProject}
        onOpenChange={setShowNewProject}
        newProject={newProject}
        setNewProject={setNewProject}
        onCreate={handleCreate}
        saving={saving}
        STAGES={STAGES}
        TYPES={TYPES}
      />
    </div>
  );
}
