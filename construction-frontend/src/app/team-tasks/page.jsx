import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  ListTodo,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Loader2,
  Trash2,
  GripVertical,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  List,
  Columns3,
} from "lucide-react";

const STATUSES = ["todo", "in_progress", "review", "completed", "blocked"];
const PRIORITIES = ["low", "medium", "high", "urgent"];
const TASK_TYPES = [
  "General",
  "Design upload",
  "Revision response",
  "Site visit",
  "Vendor follow-up",
  "Inventory dispatch",
  "Quality check",
  "Client response",
  "Internal documentation",
];

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    color: "bg-gray-100 text-gray-700",
    header: "bg-gray-50 border-gray-200",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-50 text-blue-700",
    header: "bg-blue-50 border-blue-200",
  },
  review: {
    label: "Review",
    color: "bg-purple-50 text-purple-700",
    header: "bg-purple-50 border-purple-200",
  },
  completed: {
    label: "Completed",
    color: "bg-green-50 text-green-700",
    header: "bg-green-50 border-green-200",
  },
  blocked: {
    label: "Blocked",
    color: "bg-red-50 text-[#e31d3b]",
    header: "bg-red-50 border-red-200",
  },
};

const PRIORITY_CONFIG = {
  low: { color: "bg-gray-100 text-gray-600" },
  medium: { color: "bg-yellow-50 text-yellow-700" },
  high: { color: "bg-orange-50 text-[#ef7f1b]" },
  urgent: { color: "bg-red-50 text-[#e31d3b]" },
};

export default function TeamTasksPage() {
  const { api, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState("kanban");
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [myTasksOnly, setMyTasksOnly] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/team-tasks"), api.get("/projects")])
      .then(([t, p]) => {
        setTasks(t.data);
        setProjects(p.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const reload = () => api.get("/team-tasks").then((r) => setTasks(r.data));

  const updateStatus = async (tid, status) => {
    try {
      await api.put(`/team-tasks/${tid}`, { status });
      reload();
    } catch {
      toast.error("Failed");
    }
  };

  const deleteTask = async (tid) => {
    try {
      await api.delete(`/team-tasks/${tid}`);
      setTasks((p) => p.filter((t) => t.id !== tid));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const filtered = tasks.filter((t) => {
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterProject !== "all" && t.project !== filterProject) return false;
    if (myTasksOnly && t.assigned_to !== user?.name) return false;
    return true;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col h-full" data-testid="team-tasks-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="team-tasks-title"
            >
              Team Tasks
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 ${viewMode === "kanban" ? "bg-gray-100" : ""}`}
                data-testid="view-kanban"
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                data-testid="view-list"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={() => setShowAdd(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
              data-testid="add-task-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Task
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10"
              data-testid="task-search"
            />
          </div>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-44 h-9 text-xs">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => setMyTasksOnly(!myTasksOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${myTasksOnly ? "bg-[#ef7f1b] text-white" : "bg-gray-100 text-gray-600"}`}
            data-testid="my-tasks-toggle"
          >
            <User className="w-3 h-3 inline mr-1" />
            My Tasks
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 p-4 min-w-max h-full">
            {STATUSES.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const col = filtered.filter((t) => t.status === status);
              return (
                <div
                  key={status}
                  className="w-72 flex flex-col"
                  data-testid={`kanban-col-${status}`}
                >
                  <div
                    className={`px-3 py-2 rounded-t-lg border ${cfg.header} flex items-center justify-between`}
                  >
                    <span className="text-xs font-bold">{cfg.label}</span>
                    <Badge className={`${cfg.color} text-[9px] border-0`}>
                      {col.length}
                    </Badge>
                  </div>
                  <ScrollArea className="flex-1 bg-gray-50/50 rounded-b-lg border border-t-0 border-gray-200 p-2">
                    <div className="space-y-2 min-h-[100px]">
                      {col.map((t, i) => (
                        <TaskCard
                          key={t.id}
                          task={t}
                          onDelete={deleteTask}
                          onStatusChange={updateStatus}
                          testIdx={i}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2 max-w-4xl">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <ListTodo className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No tasks found</p>
              </div>
            ) : (
              filtered.map((t, i) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onDelete={deleteTask}
                  onStatusChange={updateStatus}
                  testIdx={i}
                  listMode
                />
              ))
            )}
          </div>
        </ScrollArea>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md" data-testid="add-task-dialog">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <AddTaskForm
            api={api}
            projects={projects}
            onSuccess={(t) => {
              setTasks((p) => [...p, t]);
              setShowAdd(false);
              toast.success("Task created");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskCard({ task, onDelete, onStatusChange, testIdx, listMode }) {
  const pcfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const scfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const isOverdue =
    task.due_date &&
    task.due_date < new Date().toISOString().slice(0, 10) &&
    task.status !== "completed";

  return (
    <Card
      className={`p-3 ${listMode ? "flex items-center gap-3" : ""} ${isOverdue ? "border-[#e31d3b]/30" : ""} hover:shadow-md transition-all`}
      data-testid={`task-card-${testIdx}`}
    >
      <div className={`${listMode ? "flex-1 min-w-0" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-bold text-black truncate">
            {task.title}
          </h4>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-300 hover:text-[#e31d3b] shrink-0"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        {task.project && (
          <p className="text-[10px] text-gray-400 mt-0.5">
            {task.project}
            {task.module ? ` · ${task.module}` : ""}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Badge className={`${pcfg.color} text-[9px] border-0`}>
            {task.priority}
          </Badge>
          <Badge className={`${scfg.color} text-[9px] border-0`}>
            {scfg.label}
          </Badge>
          {task.task_type !== "General" && (
            <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
              {task.task_type}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
          {task.assigned_to && (
            <span className="flex items-center gap-0.5">
              <User className="w-3 h-3" />
              {task.assigned_to}
            </span>
          )}
          {task.due_date && (
            <span
              className={`flex items-center gap-0.5 ${isOverdue ? "text-[#e31d3b] font-bold" : ""}`}
            >
              <Calendar className="w-3 h-3" />
              {task.due_date}
            </span>
          )}
        </div>
      </div>
      {listMode && (
        <Select
          value={task.status}
          onValueChange={(v) => onStatusChange(task.id, v)}
        >
          <SelectTrigger className="w-32 h-7 text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </Card>
  );
}

function AddTaskForm({ api, projects, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    project: "",
    module: "",
    assigned_to: "",
    due_date: "",
    priority: "medium",
    task_type: "General",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title required");
      return;
    }
    setSaving(true);
    try {
      const r = await api.post("/team-tasks", form);
      onSuccess(r.data);
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 py-2">
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Task Title *
        </Label>
        <Input
          value={form.title}
          onChange={(e) => u("title", e.target.value)}
          className="mt-1"
          data-testid="task-title-input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Project
          </Label>
          <Select value={form.project} onValueChange={(v) => u("project", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Assigned To
          </Label>
          <Input
            value={form.assigned_to}
            onChange={(e) => u("assigned_to", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Priority
          </Label>
          <Select value={form.priority} onValueChange={(v) => u("priority", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Type
          </Label>
          <Select
            value={form.task_type}
            onValueChange={(v) => u("task_type", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Due Date
          </Label>
          <Input
            type="date"
            value={form.due_date}
            onChange={(e) => u("due_date", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Description
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) => u("description", e.target.value)}
          className="mt-1"
          rows={2}
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="task-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}{" "}
          Add Task
        </Button>
      </div>
    </div>
  );
}
