import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  ArrowLeft,
  Plus,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  GripVertical,
  Trash2,
  Download,
} from "lucide-react";

import {
  useGetExecutionStagesQuery,
  useGetExecutionActivitiesQuery,
} from "@/api/projects/executionApi";

import {
  useGetProjectTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/api/taskApi";

import AddReportForm from "./AddReportForm";
import AddTaskForm from "./AddTaskForm";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "border-red-500", bg: "bg-red-50" },
  {
    id: "in_progress",
    title: "In Progress",
    color: "border-[#ef7f1b]",
    bg: "bg-orange-50",
  },
  { id: "review", title: "Review", color: "border-blue-500", bg: "bg-blue-50" },
  { id: "done", title: "Done", color: "border-green-500", bg: "bg-green-50" },
];

const PRIORITY_MAP = {
  high: { label: "High", color: "bg-red-100 text-red-700" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "Low", color: "bg-green-100 text-green-700" },
};

const BACKEND = "http://localhost:5000/api";

export default function ExecutionWorkspace({
  projectId,
  project,
  user,
  onBack,
}) {
  const isClient = user?.role === "Client";

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");

  // ================= RTK Query =================
  const { data: tasks = [], isLoading: tasksLoading } =
    useGetProjectTasksQuery(projectId);

  const { data: stages = [], isLoading: stagesLoading } =
    useGetExecutionStagesQuery(projectId);
  const { data: activities = [] } = useGetExecutionActivitiesQuery(projectId);

  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // ================= Handlers =================
  const handleDragEnd = async (result) => {
    if (!result.destination || isClient) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    try {
      await updateTask({ taskId: draggableId, status: newStatus }).unwrap();
      toast.success("Task moved successfully");
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (tid) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(tid).unwrap();
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // ================= KPI =================
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter(
    (t) => t.deadline && t.deadline.startsWith(todayStr),
  ).length;
  const completionPct = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const kpi = {
    total_tasks: tasks.length,
    completed: completedTasks,
    in_progress: inProgressTasks,
    delayed: tasks.filter(
      (t) =>
        t.deadline && new Date(t.deadline) < new Date() && t.status !== "done",
    ).length,
    completion_pct: completionPct,
    today_tasks: todayTasks,
  };

  // Reports & drawings are removed since no API exists — tabs kept as placeholders
  const reports = [];
  const drawings = [];
  const openIssues = 0;

  return (
    <div className="flex flex-col h-full" data-testid="execution-workspace">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">
                {project?.name}
              </h1>
              <p className="text-[11px] text-gray-400">Execution Workspace</p>
            </div>
          </div>

          {!isClient && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddReport(true)}
                data-testid="add-report-btn"
              >
                <FileText className="w-3.5 h-3.5 mr-1" /> Daily Report
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddTask(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                data-testid="add-task-btn"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-4 md:px-6 bg-gray-50/50 border-b border-gray-100">
        {[
          { label: "Today's Tasks", value: kpi.today_tasks, icon: Calendar },
          { label: "In Progress", value: kpi.in_progress, icon: Clock },
          { label: "Completed", value: kpi.completed, icon: CheckCircle },
          { label: "Delayed", value: kpi.delayed, icon: AlertTriangle },
          {
            label: "Progress",
            value: `${kpi.completion_pct}%`,
            icon: TrendingUp,
          },
          { label: "Issues", value: openIssues, icon: AlertTriangle },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <Card key={i} className="p-3 text-center">
              <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-black text-black">{k.value}</p>
              <p className="text-[9px] text-gray-400">{k.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="mx-4 mt-3 bg-gray-100 p-0.5 rounded-lg w-fit">
          <TabsTrigger value="kanban" className="text-xs px-3 py-1.5">
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="stages" className="text-xs px-3 py-1.5">
            Stages
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs px-3 py-1.5">
            Daily Reports
          </TabsTrigger>
          <TabsTrigger value="drawings" className="text-xs px-3 py-1.5">
            Drawings
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs px-3 py-1.5">
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* ================= KANBAN ================= */}
        <TabsContent value="kanban" className="flex-1 overflow-hidden m-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 p-4 h-full overflow-x-auto">
              {COLUMNS.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <Droppable key={col.id} droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-w-[280px] max-w-[360px] rounded-xl border-t-2 ${col.color} ${col.bg} ${
                          snapshot.isDraggingOver
                            ? "ring-2 ring-[#ef7f1b]/20"
                            : ""
                        } flex flex-col`}
                      >
                        <div className="p-3 flex items-center justify-between sticky top-0 bg-inherit z-10">
                          <h3 className="text-xs font-bold text-black">
                            {col.title}
                          </h3>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-gray-500 font-medium">
                            {colTasks.length}
                          </span>
                        </div>

                        <ScrollArea className="flex-1 px-3 pb-3">
                          <div className="space-y-2">
                            {colTasks.map((task, idx) => (
                              <Draggable
                                key={task.id}
                                draggableId={String(task.id)}
                                index={idx}
                                isDragDisabled={isClient}
                              >
                                {(prov, snap) => (
                                  <div
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    className={`bg-white rounded-lg p-3 border border-gray-100 ${
                                      snap.isDragging
                                        ? "shadow-lg ring-2 ring-[#ef7f1b]/20"
                                        : "shadow-sm"
                                    } transition-shadow`}
                                  >
                                    <div className="flex items-start gap-2">
                                      {!isClient && (
                                        <div
                                          {...prov.dragHandleProps}
                                          className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab"
                                        >
                                          <GripVertical className="w-3.5 h-3.5" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-black">
                                          {task.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                          <Badge
                                            className={`${
                                              (
                                                PRIORITY_MAP[task.priority] ||
                                                PRIORITY_MAP.medium
                                              ).color
                                            } text-[9px] border-0`}
                                          >
                                            {
                                              (
                                                PRIORITY_MAP[task.priority] ||
                                                PRIORITY_MAP.medium
                                              ).label
                                            }
                                          </Badge>
                                          <span className="text-[9px] text-gray-400">
                                            {task.category}
                                          </span>
                                        </div>
                                        {task.assigned_to && (
                                          <p className="text-[9px] text-gray-400 mt-1">
                                            <Users className="w-3 h-3 inline mr-0.5" />{" "}
                                            {task.assigned_to}
                                          </p>
                                        )}
                                        {task.deadline && (
                                          <p className="text-[9px] text-gray-400 mt-0.5">
                                            <Calendar className="w-3 h-3 inline mr-0.5" />{" "}
                                            {task.deadline}
                                          </p>
                                        )}
                                      </div>
                                      {!isClient && (
                                        <button
                                          onClick={() =>
                                            handleDeleteTask(task.id)
                                          }
                                          className="text-gray-300 hover:text-[#e31d3b] shrink-0"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </TabsContent>

        {/* ================= STAGES ================= */}
        <TabsContent value="stages" className="flex-1 overflow-hidden m-0 p-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-bold mb-6">Project Execution Stages</h2>

            {stagesLoading ? (
              <p className="text-center py-10 text-gray-500">
                Loading stages and activities...
              </p>
            ) : stages.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No stages created yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {stages.map((stage) => {
                  const stageActivities = activities.filter(
                    (a) => a.stage_id === stage.id,
                  );
                  return (
                    <Card key={stage.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-black">
                            {stage.name}
                          </h3>
                          {stage.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {stage.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {stage.status || "Active"}
                        </Badge>
                      </div>

                      <div className="pl-4 border-l-2 border-[#ef7f1b]">
                        <h4 className="uppercase text-xs font-bold text-gray-500 mb-3">
                          Activities
                        </h4>
                        {stageActivities.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No activities in this stage
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {stageActivities.map((act) => (
                              <div
                                key={act.id}
                                className="bg-gray-50 p-4 rounded-lg"
                              >
                                <p className="font-medium text-sm">
                                  {act.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Status:{" "}
                                  <span className="capitalize">
                                    {act.status}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ================= DAILY REPORTS ================= */}
        <TabsContent value="reports" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 max-w-3xl">
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">No daily reports submitted yet</p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ================= DRAWINGS ================= */}
        <TabsContent value="drawings" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">No drawings uploaded yet</p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ================= TIMELINE ================= */}
        <TabsContent value="timeline" className="flex-1 overflow-hidden m-0">
          <div className="p-4 max-w-2xl">
            <Card className="p-8">
              <h3 className="text-lg font-bold mb-6">
                Project Execution Timeline
              </h3>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="font-bold text-[#ef7f1b]">
                      {kpi.completion_pct}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ef7f1b] rounded-full transition-all"
                      style={{ width: `${kpi.completion_pct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400">
                      Total Tasks
                    </p>
                    <p className="text-4xl font-black text-black mt-1">
                      {kpi.total_tasks}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400">
                      Completed
                    </p>
                    <p className="text-4xl font-black text-green-600 mt-1">
                      {kpi.completed}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400">
                      In Progress
                    </p>
                    <p className="text-4xl font-black text-[#ef7f1b] mt-1">
                      {kpi.in_progress}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400">
                      Delayed
                    </p>
                    <p className="text-4xl font-black text-red-600 mt-1">
                      {kpi.delayed}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <AddTaskForm
            projectId={projectId}
            projectName={project?.name}
            onSuccess={() => {
              setShowAddTask(false);
              toast.success("Task added successfully");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Daily Report Dialog */}
      <Dialog open={showAddReport} onOpenChange={setShowAddReport}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Daily Progress Report</DialogTitle>
          </DialogHeader>
          <AddReportForm
            projectId={projectId}
            onSuccess={() => {
              setShowAddReport(false);
              toast.success("Daily report submitted");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
