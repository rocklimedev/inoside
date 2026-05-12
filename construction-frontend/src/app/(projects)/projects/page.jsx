"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from "@/api/projectsApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
  FileText,
  Upload,
  Clock,
  MapPin,
  User,
  Calendar,
  X,
  AlertTriangle,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";

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
  const [showNewProject, setShowNewProject] = useState(false);

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

  // RTK Query Hooks
  const { data: projects = [], isLoading, error } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const filteredProjects = useMemo(() => {
    let result = [...projects];

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
    if (filters.stages.length) {
      result = result.filter((p) => filters.stages.includes(p.stage || ""));
    }
    if (filters.types.length) {
      result = result.filter((p) => filters.types.includes(p.type || ""));
    }
    if (filters.statuses.length) {
      result = result.filter((p) =>
        filters.statuses.includes(p.status || "Active"),
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "completion")
        return (b.completion || 0) - (a.completion || 0);
      if (sortBy === "stage")
        return STAGES.indexOf(a.stage || "") - STAGES.indexOf(b.stage || "");
      return 0;
    });

    return result;
  }, [projects, search, filters, sortBy]);

  const handleCreate = async () => {
    if (!newProject.name || !newProject.type) {
      toast.error("Project Name and Type are required");
      return;
    }

    try {
      await createProject(newProject).unwrap();
      setShowNewProject(false);
      resetNewProjectForm();
      toast.success("Project created successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create project");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id).unwrap();
      setSelectedProject(null);
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const resetNewProjectForm = () => {
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
                className={showFilters ? "border-[#ef7f1b] text-[#ef7f1b]" : ""}
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
                onClick={() => setShowNewProject(true)}
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

        {/* Main Content */}
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

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Form fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Client Name</Label>
                <Input
                  value={newProject.client_name}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      client_name: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select
                  value={newProject.type}
                  onValueChange={(v) =>
                    setNewProject((p) => ({ ...p, type: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Service Type</Label>
                <Input
                  value={newProject.service_type}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      service_type: e.target.value,
                    }))
                  }
                  placeholder="e.g. Full Design + Execution"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={newProject.location}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Starting Stage</Label>
                <Select
                  value={newProject.stage}
                  onValueChange={(v) =>
                    setNewProject((p) => ({ ...p, stage: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, start_date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Expected Completion</Label>
                <Input
                  type="date"
                  value={newProject.expected_completion}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      expected_completion: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            >
              {isCreating ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Detail Sheet */}
      <Sheet
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <SheetContent className="w-[440px] sm:w-[480px]">
          {selectedProject && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedProject.name}</SheetTitle>
              </SheetHeader>

              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
                  <InfoRow
                    icon={User}
                    label="Client"
                    value={selectedProject.client_name}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={selectedProject.location || "—"}
                  />
                  <InfoRow
                    icon={FileText}
                    label="Type"
                    value={selectedProject.type}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Stage"
                    value={selectedProject.stage}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Start"
                    value={selectedProject.start_date || "—"}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Expected"
                    value={selectedProject.expected_completion || "—"}
                  />
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Progress
                  </p>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={selectedProject.completion || 0}
                      className="h-2.5"
                    />
                    <span className="font-bold text-lg">
                      {selectedProject.completion || 0}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" /> View Full Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" /> Upload Files
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(selectedProject.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ===================== Helper Components ===================== */

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function FilterSection({ title, items, selected, onToggle }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => onToggle(item)}
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function GridView({ projects, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((p, i) => (
        <Card
          key={p.id || i}
          className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group"
          onClick={() => onSelect(p)}
          data-testid={`project-card-${i}`}
        >
          {/* Same Grid Card content as your original */}
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-black truncate">
                {p.name}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                {p.client_name}
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#ef7f1b] transition-colors" />
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] h-[18px] border font-medium">
              {p.stage}
            </Badge>
            <span className="text-[10px] text-gray-400">{p.type}</span>
            {p.location && (
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />
                {p.location}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Progress value={p.completion || 0} className="h-1.5 flex-1" />
            <span className="text-[10px] font-bold text-gray-500">
              {p.completion || 0}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>{p.last_activity}</span>
            <div className="flex items-center gap-2">
              {p.pending_approvals && p.pending_approvals > 0 && (
                <span className="text-[#ef7f1b] font-medium">
                  {p.pending_approvals} approvals
                </span>
              )}
              {p.has_issues && (
                <AlertTriangle className="w-3 h-3 text-red-600" />
              )}
              {p.has_delay && (
                <span className="text-red-600 font-medium">Delayed</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ListView and TimelineView remain the same as your original code
function ListView({ projects, onSelect }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-8 gap-2 px-4 py-3 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b">
        <span className="col-span-2">Project</span>
        <span>Client</span>
        <span>Stage</span>
        <span>Progress</span>
        <span>Last Activity</span>
        <span>Approvals</span>
        <span>Status</span>
      </div>
      {projects.map((p, i) => (
        <div
          key={p.id || i}
          onClick={() => onSelect(p)}
          className="grid grid-cols-8 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-orange-50/30 cursor-pointer transition-colors items-center text-sm"
          data-testid={`project-row-${i}`}
        >
          {/* List row content - same as original */}
          <div className="col-span-2 min-w-0">
            <p className="font-medium text-black truncate">{p.name}</p>
            <p className="text-[10px] text-gray-400">
              {p.type} {p.location ? `· ${p.location}` : ""}
            </p>
          </div>
          <span className="text-gray-600 truncate text-xs">
            {p.client_name}
          </span>
          <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] h-[18px] border w-fit">
            {p.stage}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Progress value={p.completion || 0} className="h-1 flex-1" />
            <span className="text-[10px] font-bold">{p.completion || 0}%</span>
          </div>
          <span className="text-xs text-gray-400">{p.last_activity}</span>
          <span className="text-xs">
            {p.pending_approvals && p.pending_approvals > 0 ? (
              <span className="text-[#ef7f1b] font-medium">
                {p.pending_approvals}
              </span>
            ) : (
              "—"
            )}
          </span>
          <Badge
            className={`text-[10px] h-[18px] border w-fit ${p.has_delay ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}
          >
            {p.status || (p.has_delay ? "Delayed" : "Active")}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function TimelineView({ projects, onSelect }) {
  return (
    <div className="space-y-3">
      {projects.map((p, i) => {
        const stageIdx = STAGES.indexOf(p.stage || "");
        return (
          <div
            key={p.id || i}
            onClick={() => onSelect(p)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
            data-testid={`project-timeline-${i}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-black">{p.name}</h3>
                <p className="text-[10px] text-gray-400">
                  {p.client_name} · {p.type}
                </p>
              </div>
              <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] border">
                {p.stage}
              </Badge>
            </div>
            <div className="flex gap-0.5">
              {STAGES.map((stage, si) => (
                <div key={si} className="flex-1 group relative">
                  <div
                    className={`h-2 rounded-sm transition-colors ${si <= stageIdx ? (p.has_delay ? "bg-red-600" : "bg-[#ef7f1b]") : "bg-gray-100"}`}
                  />
                  <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] bg-gray-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                    {stage}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
              <span>Brief</span>
              <span>Handover</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
