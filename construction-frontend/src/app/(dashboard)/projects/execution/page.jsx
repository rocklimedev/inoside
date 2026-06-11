"use client";
import React, { useState, useEffect, useRef } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  ArrowLeft,
  Search,
  Loader2,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Camera,
  FileText,
  Upload,
  Trash2,
  GripVertical,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Image,
  X,
  Download,
} from "lucide-react";
import ExecutionWorkspace from "@/components/execution/ExecutionWorkspace";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const COLUMNS = [
  { id: "todo", title: "To Do", color: "border-gray-300", bg: "bg-gray-50" },
  {
    id: "in_progress",
    title: "In Progress",
    color: "border-[#ef7f1b]",
    bg: "bg-orange-50/30",
  },
  {
    id: "done",
    title: "Completed",
    color: "border-green-500",
    bg: "bg-green-50/30",
  },
];

const PRIORITY_MAP = {
  high: { label: "High", color: "bg-red-50 text-[#e31d3b]" },
  medium: { label: "Medium", color: "bg-yellow-50 text-yellow-700" },
  low: { label: "Low", color: "bg-blue-50 text-blue-600" },
};

const TASK_CATEGORIES = [
  "Foundation",
  "Structure",
  "Masonry",
  "Electrical",
  "Plumbing",
  "Flooring",
  "Painting",
  "Fixtures",
  "Finishing",
  "General",
];

export default function ExecutionPage() {
  const { api, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!api) {
      setLoading(false);
      return;
    }

    api
      .get("/projects")
      .then((r) => setProjects(r.data))
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        toast.error("Failed to load projects");
      })
      .finally(() => setLoading(false));
  }, [api]); // ← Important: depend on api
  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  if (selectedProject)
    return (
      <ExecutionWorkspace
        project={selectedProject}
        api={api}
        user={user}
        onBack={() => setSelectedProject(null)}
      />
    );

  return (
    <div className="flex flex-col h-full" data-testid="execution-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <h1
          className="text-xl font-black text-black"
          data-testid="execution-title"
        >
          Execution
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Select a project to manage execution
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
            data-testid="exec-project-search"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects
            .filter(
              (p) =>
                !search || p.name?.toLowerCase().includes(search.toLowerCase()),
            )
            .map((p, i) => (
              <Card
                key={p.id}
                className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer"
                onClick={() => setSelectedProject(p)}
                data-testid={`exec-project-${i}`}
              >
                <h3 className="text-sm font-bold text-black">{p.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1">
                  {p.client} &middot; {p.stage}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
