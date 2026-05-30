"use client";

import { useState, useEffect, useMemo } from "react";
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
  User,
  Loader2,
  Trash2,
  List,
  Columns3,
  Calendar,
} from "lucide-react";

// RTK Query Imports
import {
  useGetAllTasksQuery,
  useGetProjectTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/api/taskApi";
import { useGetUsersQuery } from "@/api/usersApi";
import { useGetProjectsQuery } from "@/api/projectsApi";
import KanbanView from "@/components/tasks/KanbanView";
import ListView from "@/components/tasks/ListView";
import AddTaskForm from "@/components/tasks/AddTaskForm";

export default function TeamTasksPage() {
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState("list"); // default to list on mobile
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // RTK Query (same as before)
  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();

  const { data: allTasksData = [], isLoading: allTasksLoading } =
    useGetAllTasksQuery(undefined, { skip: filterProject !== "all" });

  const projectId = filterProject === "all" ? undefined : filterProject;
  const { data: projectTasks = [], isLoading: projectTasksLoading } =
    useGetProjectTasksQuery(projectId, {
      skip: filterProject === "all" || !projectId,
    });

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks = filterProject === "all" ? allTasksData : projectTasks;

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title?.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (myTasksOnly && t.assigned_to_user_id === user?.id) return false;
      return true;
    });
  }, [tasks, search, myTasksOnly, user?.name]);

  // Auto switch view mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("list");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask({ taskId, status }).unwrap();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const isLoading =
    projectsLoading ||
    (filterProject === "all" ? allTasksLoading : projectTasksLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="team-tasks-page">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-black text-black">Team Tasks</h1>
            <p className="text-xs text-gray-400 mt-1">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-2 ${viewMode === "kanban" ? "bg-gray-100" : ""}`}
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={() => setShowAdd(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10"
            />
          </div>

          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full sm:w-44 h-10">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={() => setMyTasksOnly(!myTasksOnly)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              myTasksOnly
                ? "bg-[#ef7f1b] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <User className="w-4 h-4" /> My Tasks
          </button>
        </div>
      </div>

      {/* Views */}
      {viewMode === "kanban" ? (
        <KanbanView
          tasks={filtered}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <ListView
          tasks={filtered}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {/* Add Task Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <AddTaskForm
            projects={projects}
            onSuccess={() => setShowAdd(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
