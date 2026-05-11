import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { toast } from "sonner";
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
  const { api } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    stages: [],
    types: [],
    statuses: [],
  });
  const [sortBy, setSortBy] = useState("name");
  const [selectedProject, setSelectedProject] = useState(null);
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let r = [...projects];
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.client_name?.toLowerCase().includes(s) ||
          p.type?.toLowerCase().includes(s) ||
          p.stage?.toLowerCase().includes(s) ||
          p.location?.toLowerCase().includes(s),
      );
    }
    if (filters.stages.length)
      r = r.filter((p) => filters.stages.includes(p.stage));
    if (filters.types.length)
      r = r.filter((p) => filters.types.includes(p.type));
    if (filters.statuses.length)
      r = r.filter((p) => filters.statuses.includes(p.status || "Active"));
    r.sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "completion")
        return (b.completion || 0) - (a.completion || 0);
      if (sortBy === "stage")
        return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
      return 0;
    });
    return r;
  }, [projects, search, filters, sortBy]);

  const handleCreate = async () => {
    if (!newProject.name || !newProject.type) {
      toast.error("Name and type required");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/projects", newProject);
      setProjects((prev) => [...prev, res.data]);
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
      toast.success("Project created");
    } catch (err) {
      toast.error("Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pid) => {
    try {
      await api.delete(`/projects/${pid}`);
      setProjects((prev) => prev.filter((p) => p.id !== pid));
      setSelectedProject(null);
      toast.success("Project deleted");
    } catch (err) {
      toast.error("Failed to delete");
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex h-full" data-testid="projects-page">
      {/* Filter Panel */}
      {showFilters && (
        <div className="w-64 border-r border-gray-200 bg-white p-5 shrink-0 animate-slideInRight overflow-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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
                setFilters({ stages: [], types: [], statuses: [] })
              }
              className="mt-4 text-xs text-[#ef7f1b] font-medium hover:underline"
              data-testid="clear-filters-btn"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1
              className="text-xl font-black text-black"
              data-testid="projects-title"
            >
              Projects
            </h1>
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1 border border-transparent focus-within:border-[#ef7f1b]/30">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  data-testid="projects-search"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="filter-btn"
                className={showFilters ? "border-[#ef7f1b] text-[#ef7f1b]" : ""}
              >
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className="w-32 h-9 text-xs"
                  data-testid="sort-select"
                >
                  <ArrowUpDown className="w-3 h-3 mr-1" />
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
                  { mode: "grid", icon: LayoutGrid },
                  { mode: "list", icon: List },
                  { mode: "timeline", icon: GanttChart },
                ].map((v) => (
                  <button
                    key={v.mode}
                    onClick={() => setViewMode(v.mode)}
                    data-testid={`view-${v.mode}`}
                    className={`p-2 transition-colors ${viewMode === v.mode ? "bg-[#ef7f1b] text-white" : "text-gray-400 hover:bg-gray-50"}`}
                  >
                    <v.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setShowNewProject(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                size="sm"
                data-testid="new-project-btn"
              >
                <Plus className="w-4 h-4 mr-1" /> New Project
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            {viewMode === "grid" && (
              <GridView projects={filtered} onSelect={setSelectedProject} />
            )}
            {viewMode === "list" && (
              <ListView projects={filtered} onSelect={setSelectedProject} />
            )}
            {viewMode === "timeline" && (
              <TimelineView projects={filtered} onSelect={setSelectedProject} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="max-w-lg" data-testid="new-project-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Project Name *
                </Label>
                <Input
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1"
                  data-testid="np-name"
                />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Client Name
                </Label>
                <Input
                  value={newProject.client_name}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      client_name: e.target.value,
                    }))
                  }
                  className="mt-1"
                  data-testid="np-client"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Type *
                </Label>
                <Select
                  value={newProject.type}
                  onValueChange={(v) =>
                    setNewProject((p) => ({ ...p, type: v }))
                  }
                >
                  <SelectTrigger className="mt-1" data-testid="np-type">
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
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Service Type
                </Label>
                <Input
                  value={newProject.service_type}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      service_type: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="e.g. Full Design + Execution"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Location
                </Label>
                <Input
                  value={newProject.location}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, location: e.target.value }))
                  }
                  className="mt-1"
                  data-testid="np-location"
                />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Starting Stage
                </Label>
                <Select
                  value={newProject.stage}
                  onValueChange={(v) =>
                    setNewProject((p) => ({ ...p, stage: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
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
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, start_date: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Expected Completion
                </Label>
                <Input
                  type="date"
                  value={newProject.expected_completion}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      expected_completion: e.target.value,
                    }))
                  }
                  className="mt-1"
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
              disabled={saving}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              data-testid="np-submit"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
        <SheetContent
          className="w-[420px] sm:w-[480px] overflow-auto"
          data-testid="project-detail-sheet"
        >
          {selectedProject && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">
                  {selectedProject.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
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
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Progress
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={selectedProject.completion || 0}
                      className="h-2 flex-1 bg-gray-100 progress-orange"
                    />
                    <span className="text-sm font-bold">
                      {selectedProject.completion || 0}%
                    </span>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Team
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.team || []).map((m, i) => (
                      <Badge
                        key={i}
                        className="bg-gray-100 text-gray-700 border-0 text-xs"
                      >
                        {m}
                      </Badge>
                    ))}
                    {(!selectedProject.team ||
                      selectedProject.team.length === 0) && (
                      <span className="text-xs text-gray-400">
                        No team assigned
                      </span>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="w-3.5 h-3.5 mr-1" /> Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#e31d3b] hover:text-[#e31d3b] border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(selectedProject.id)}
                    data-testid="delete-project-btn"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
          {label}
        </p>
        <p className="text-sm text-black">{value}</p>
      </div>
    </div>
  );
}

function FilterSection({ title, items, selected, onToggle }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
        {title}
      </p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black transition-colors"
          >
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => onToggle(item)}
              className="data-[state=checked]:bg-[#ef7f1b] data-[state=checked]:border-[#ef7f1b]"
            />
            <span className="text-xs">{item}</span>
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
          className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group animate-fadeInUp"
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
          onClick={() => onSelect(p)}
          data-testid={`project-card-${i}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-black truncate">
                {p.name}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                {p.client_name}
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#ef7f1b] transition-colors shrink-0" />
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
            <Progress
              value={p.completion || 0}
              className="h-1.5 flex-1 bg-gray-100 progress-orange"
            />
            <span className="text-[10px] font-bold text-gray-500">
              {p.completion || 0}%
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>{p.last_activity}</span>
            <div className="flex items-center gap-2">
              {p.pending_approvals > 0 && (
                <span className="text-[#ef7f1b] font-medium">
                  {p.pending_approvals} approvals
                </span>
              )}
              {p.has_issues && (
                <AlertTriangle className="w-3 h-3 text-[#e31d3b]" />
              )}
              {p.has_delay && (
                <span className="text-[#e31d3b] font-medium">Delayed</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

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
          data-testid={`project-row-${i}`}
          className="grid grid-cols-8 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-orange-50/30 cursor-pointer transition-colors items-center text-sm"
        >
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
            <Progress
              value={p.completion || 0}
              className="h-1 flex-1 bg-gray-100 progress-orange"
            />
            <span className="text-[10px] font-bold">{p.completion || 0}%</span>
          </div>
          <span className="text-xs text-gray-400">{p.last_activity}</span>
          <span className="text-xs">
            {p.pending_approvals > 0 ? (
              <span className="text-[#ef7f1b] font-medium">
                {p.pending_approvals}
              </span>
            ) : (
              "—"
            )}
          </span>
          <Badge
            className={`text-[10px] h-[18px] border w-fit ${p.has_delay ? "bg-red-50 text-[#e31d3b] border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}
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
        const stageIdx = STAGES.indexOf(p.stage);
        return (
          <div
            key={p.id || i}
            onClick={() => onSelect(p)}
            data-testid={`project-timeline-${i}`}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
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
                    className={`h-2 rounded-sm transition-colors ${si <= stageIdx ? (p.has_delay ? "bg-[#e31d3b]" : "bg-[#ef7f1b]") : "bg-gray-100"}`}
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
