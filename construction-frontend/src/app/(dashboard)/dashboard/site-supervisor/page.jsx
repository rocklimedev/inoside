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
// SITE SUPERVISOR DASHBOARD
// ─────────────────────────────────────
export default function SupervisorDashboard() {
  const { api } = useAuth();
  const navigate = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [siteProgress, setSiteProgress] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/team-tasks"),
      api.get("/quality/issues"),
      api.get("/quality/checklist"),
      api.get("/inventory"),
      api.get("/dashboard/site-progress"),
      api.get("/reports/all"),
    ])
      .then(([p, t, iss, ch, inv, sp, r]) => {
        setProjects(p.data);
        setTasks(t.data);
        setIssues(iss.data);
        setChecklist(ch.data);
        setInventory(inv.data);
        setSiteProgress(sp.data);
        setReports(r.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const openIssues = issues.filter((i) => i.status === "open");
  const pendingChecks = checklist.filter((c) => c.check_status === "pending");
  const todaysTasks = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "todo",
  );
  const pendingDeliveries = inventory.filter(
    (i) => i.delivery_status === "pending",
  );

  return (
    <div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      data-testid="site-supervisor-dashboard"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black">Site Supervisor</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Daily site operations & quality monitoring
          </p>
        </div>
        <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-xs border">
          Supervisor
        </Badge>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Active Projects",
            value: projects.filter((p) => p.status === "active").length,
            icon: Building2,
            color: "#ef7f1b",
          },
          {
            label: "Today's Tasks",
            value: todaysTasks.length,
            icon: ClipboardList,
            color: "#3b82f6",
          },
          {
            label: "Open Issues",
            value: openIssues.length,
            icon: AlertTriangle,
            color: openIssues.length > 0 ? "#e31d3b" : "#94a3b8",
          },
          {
            label: "Quality Checks",
            value: pendingChecks.length,
            icon: CheckCircle,
            color: "#10b981",
          },
          {
            label: "Pending Deliveries",
            value: pendingDeliveries.length,
            icon: Truck,
            color: "#f59e0b",
          },
          {
            label: "Reports Filed",
            value: reports.filter((r) => r.report_type === "Daily Progress")
              .length,
            icon: BarChart3,
            color: "#8b5cf6",
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={i}
              className="border-l-[3px] p-4 hover:shadow-md transition-all"
              style={{ borderLeftColor: kpi.color }}
              data-testid={`supervisor-kpi-${i}`}
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
        {/* Today's Tasks */}
        <Card className="p-5" data-testid="supervisor-tasks">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Today's Tasks
            </h2>
            <button
              onClick={() => navigate("/team-tasks")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {todaysTasks.slice(0, 6).map((t, i) => (
              <div
                key={t.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate("/team-tasks")}
                data-testid={`supervisor-task-${i}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${t.status === "in_progress" ? "bg-blue-500" : "bg-gray-300"}`}
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
                {t.priority === "urgent" && (
                  <Badge className="bg-red-50 text-[#e31d3b] text-[9px] border-0">
                    Urgent
                  </Badge>
                )}
                {t.priority === "high" && (
                  <Badge className="bg-orange-50 text-[#ef7f1b] text-[9px] border-0">
                    High
                  </Badge>
                )}
              </div>
            ))}
            {todaysTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No tasks for today
              </p>
            )}
          </div>
        </Card>

        {/* Open Issues */}
        <Card className="p-5" data-testid="supervisor-issues">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Open Issues
            </h2>
            <button
              onClick={() => navigate("/quality")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {openIssues.slice(0, 5).map((iss, i) => (
              <div
                key={iss.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-red-50/30 border border-red-100/50"
                data-testid={`supervisor-issue-${i}`}
              >
                <AlertTriangle className="w-4 h-4 text-[#e31d3b] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-black truncate">
                    {iss.description}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {iss.responsible_party}
                    {iss.target_date ? ` · Target: ${iss.target_date}` : ""}
                  </p>
                </div>
                <Badge className="bg-red-50 text-[#e31d3b] text-[9px] border-0">
                  Open
                </Badge>
              </div>
            ))}
            {openIssues.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">No open issues</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Checklist */}
        <Card className="p-5" data-testid="supervisor-quality">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Quality Checks Pending
            </h2>
            <button
              onClick={() => navigate("/quality")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {pendingChecks.slice(0, 5).map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100"
                data-testid={`supervisor-check-${i}`}
              >
                <CheckCircle className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-black truncate">
                    {c.task_name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {c.responsible_party}
                  </p>
                </div>
                <Badge className="bg-yellow-50 text-yellow-700 text-[9px] border-0">
                  Pending
                </Badge>
              </div>
            ))}
            {pendingChecks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                All checks completed
              </p>
            )}
          </div>
        </Card>

        {/* Pending Deliveries */}
        <Card className="p-5" data-testid="supervisor-deliveries">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Pending Deliveries
            </h2>
            <button
              onClick={() => navigate("/inventory")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View Inventory
            </button>
          </div>
          <div className="space-y-2">
            {pendingDeliveries.slice(0, 5).map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-yellow-100 bg-yellow-50/20"
                data-testid={`supervisor-del-${i}`}
              >
                <Truck className="w-4 h-4 text-[#ef7f1b] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-black truncate">
                    {d.material_name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {d.quantity_purchased} {d.unit}
                  </p>
                </div>
                <Badge className="bg-yellow-50 text-yellow-700 text-[9px] border-0">
                  Pending
                </Badge>
              </div>
            ))}
            {pendingDeliveries.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No pending deliveries
              </p>
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
