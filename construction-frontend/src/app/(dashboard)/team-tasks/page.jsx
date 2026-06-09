"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import {
  ListTodo,
  Plus,
  Search,
  User,
  Loader2,
  Columns3,
  List,
  Calendar,
  AlertCircle,
} from "lucide-react";

// RTK Query
import {
  useGetAllTasksQuery,
  useGetProjectTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/api/taskApi";
import { useGetProjectsQuery } from "@/api/projectsApi";

import KanbanView from "@/components/tasks/KanbanView";
import ListView from "@/components/tasks/ListView";
import AddTaskForm from "@/components/tasks/AddTaskForm";

export default function TeamTasksPage() {
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState("list");
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // Queries
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

  // ==================== FILTERING ====================
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (search && !task.title?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // My Tasks Only
      if (myTasksOnly && task.assigned_to_user_id !== user?.id) {
        return false;
      }

      return true;
    });
  }, [tasks, search, myTasksOnly, user?.id]);

  // Auto switch to list view on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setViewMode("list");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask({ taskId, status }).unwrap();
      toast.success("Task status updated");
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
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="team-tasks-page">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-black">Team Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-2.5 ${viewMode === "kanban" ? "bg-gray-100" : ""}`}
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={() => setShowAdd(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
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
              placeholder="Search by task title..."
              className="pl-10"
            />
          </div>

          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={myTasksOnly ? "default" : "outline"}
            onClick={() => setMyTasksOnly(!myTasksOnly)}
            className={myTasksOnly ? "bg-[#ef7f1b] text-white" : ""}
          >
            <User className="w-4 h-4 mr-2" />
            My Tasks
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanView
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <ListView
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {/* Add Task Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
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
