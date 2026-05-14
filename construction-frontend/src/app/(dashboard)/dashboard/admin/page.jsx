"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Briefcase,
  FileCheck2,
  ThumbsUp,
  FileText,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Package,
  Truck,
  Users,
  HardHat,
  Wrench,
  ClipboardList,
  ArrowRight,
  Eye,
  BarChart3,
  PenTool,
  Building2,
  ListTodo,
  StickyNote,
  Star,
} from "lucide-react";

// ─────────────────────────────────────
// TEAM MEMBER DASHBOARD
// ─────────────────────────────────────
export default function TeamDashboard() {
  const { api, user } = useAuth();
  const navigate = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/team-tasks"),
      api.get("/internal-notes"),
      api.get("/calendar/events"),
      api.get("/projects"),
      api.get("/revision-logs/all"),
    ])
      .then(([t, n, e, p, a]) => {
        setTasks(t.data);
        setNotes(n.data);
        setEvents(e.data);
        setProjects(p.data);
        setRecentActivity(a.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const myTasks = tasks.filter((t) => t.assigned_to === user?.name);
  const myTasksTodo = myTasks.filter((t) => t.status === "todo");
  const myTasksInProgress = myTasks.filter((t) => t.status === "in_progress");
  const overdueTasks = myTasks.filter(
    (t) =>
      t.due_date &&
      t.due_date < new Date().toISOString().slice(0, 10) &&
      t.status !== "completed",
  );
  const upcomingDeadlines = myTasks
    .filter((t) => t.due_date && t.status !== "completed")
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5);
  const upcomingEvents = events
    .filter((e) => new Date(e.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 5);
  const pinnedNotes = notes.filter((n) => n.pinned);

  return (
    <div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      data-testid="team-member-dashboard"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black">My Workspace</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Tasks, deadlines & activity
          </p>
        </div>
        <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-xs border">
          Team Member
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "My Tasks",
            value: myTasks.length,
            icon: ListTodo,
            color: "#ef7f1b",
          },
          {
            label: "To Do",
            value: myTasksTodo.length,
            icon: ClipboardList,
            color: "#3b82f6",
          },
          {
            label: "In Progress",
            value: myTasksInProgress.length,
            icon: TrendingUp,
            color: "#10b981",
          },
          {
            label: "Overdue",
            value: overdueTasks.length,
            icon: AlertTriangle,
            color: overdueTasks.length > 0 ? "#e31d3b" : "#94a3b8",
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={i}
              className="border-l-[3px] p-4 hover:shadow-md transition-all"
              style={{ borderLeftColor: kpi.color }}
              data-testid={`team-kpi-${i}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-black text-black mt-1">
                    {kpi.value}
                  </p>
                </div>
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Assigned Tasks */}
        <Card className="p-5" data-testid="team-tasks">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              My Tasks
            </h2>
            <button
              onClick={() => navigate("/team-tasks")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View Board
            </button>
          </div>
          <div className="space-y-2">
            {myTasks
              .filter((t) => t.status !== "completed")
              .slice(0, 6)
              .map((t, i) => {
                const isOverdue =
                  t.due_date &&
                  t.due_date < new Date().toISOString().slice(0, 10) &&
                  t.status !== "completed";
                const stCfg = {
                  todo: "bg-gray-100 text-gray-600",
                  in_progress: "bg-blue-50 text-blue-600",
                  review: "bg-purple-50 text-purple-600",
                  blocked: "bg-red-50 text-[#e31d3b]",
                };
                return (
                  <div
                    key={t.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border ${isOverdue ? "border-[#e31d3b]/20 bg-red-50/10" : "border-gray-100"} hover:bg-gray-50 transition-colors cursor-pointer`}
                    onClick={() => navigate("/team-tasks")}
                    data-testid={`team-task-${i}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${t.status === "in_progress" ? "bg-blue-500" : t.status === "blocked" ? "bg-[#e31d3b]" : "bg-gray-300"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-black truncate">
                        {t.title}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {t.project}
                        {t.due_date ? ` · Due ${t.due_date}` : ""}
                      </p>
                    </div>
                    <Badge
                      className={`${stCfg[t.status] || stCfg.todo} text-[9px] border-0`}
                    >
                      {t.status?.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })}
            {myTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No tasks assigned
              </p>
            )}
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="p-5" data-testid="team-deadlines">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Upcoming Deadlines
            </h2>
          </div>
          <div className="space-y-2">
            {upcomingDeadlines.map((t, i) => {
              const days = Math.ceil(
                (new Date(t.due_date) - new Date()) / (1000 * 60 * 60 * 24),
              );
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
                  data-testid={`team-deadline-${i}`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 ${days <= 1 ? "bg-red-50 text-[#e31d3b]" : days <= 3 ? "bg-orange-50 text-[#ef7f1b]" : "bg-gray-50 text-gray-600"}`}
                  >
                    <p className="text-sm font-black leading-none">{days}</p>
                    <p className="text-[8px] font-bold uppercase">days</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-black truncate">
                      {t.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t.project} · Due {t.due_date}
                    </p>
                  </div>
                </div>
              );
            })}
            {upcomingDeadlines.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No upcoming deadlines
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="p-5" data-testid="team-events">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Upcoming Events
            </h2>
            <button
              onClick={() => navigate("/calendar")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View Calendar
            </button>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((e, i) => (
              <div
                key={e.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate("/calendar")}
                data-testid={`team-event-${i}`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0"
                  style={{ backgroundColor: `${e.color || "#ef7f1b"}15` }}
                >
                  <p
                    className="text-[8px] font-bold"
                    style={{ color: e.color || "#ef7f1b" }}
                  >
                    {new Date(e.start_time).toLocaleDateString("en", {
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs font-black text-black leading-none">
                    {new Date(e.start_time).getDate()}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-black truncate">
                    {e.title}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(e.start_time).toLocaleTimeString("en", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No upcoming events
              </p>
            )}
          </div>
        </Card>

        {/* Recent Activity & Notes */}
        <Card className="p-5" data-testid="team-activity">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Pinned Notes
            </h2>
            <button
              onClick={() => navigate("/notes")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              All Notes
            </button>
          </div>
          <div className="space-y-2">
            {pinnedNotes.slice(0, 4).map((n, i) => (
              <div
                key={n.id}
                className="p-3 rounded-lg border border-[#ef7f1b]/10 bg-orange-50/10 cursor-pointer hover:bg-orange-50/20 transition-colors"
                onClick={() => navigate("/notes")}
                data-testid={`team-note-${i}`}
              >
                <p className="text-xs font-bold text-black">{n.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                  {n.content}
                </p>
              </div>
            ))}
            {pinnedNotes.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No pinned notes
              </p>
            )}
            {recentActivity.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Recent Activity
                </p>
                {recentActivity.slice(0, 3).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ef7f1b]" />
                    <p className="text-[10px] text-gray-600 truncate">
                      {a.action} — {a.document} ({a.module})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// SHARED LOADER
// ─────────────────────────────────────
function Loader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-gray-400 mt-4">Loading dashboard...</p>
      </div>
    </div>
  );
}
