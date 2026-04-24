import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
// CLIENT DASHBOARD
// ─────────────────────────────────────
export function ClientDashboard() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [events, setEvents] = useState([]);
  const [comms, setComms] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/approvals/all"),
      api.get("/pdfs/all"),
      api.get("/calendar/events"),
      api.get("/dashboard/client-comms"),
    ])
      .then(([p, a, d, e, c]) => {
        setProjects(p.data);
        setApprovals(a.data);
        setDocuments(d.data);
        setEvents(e.data);
        setComms(c.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const pendingApprovals = approvals.filter((a) =>
    ["pending", "pending_review"].includes(a.status),
  );
  const upcomingEvents = events
    .filter((e) => new Date(e.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 5);
  const recentDocs = documents.slice(0, 6);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6" data-testid="client-dashboard">
      {/* Welcome Strip */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black">Welcome Back</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Here's your project overview
          </p>
        </div>
        <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-xs border">
          Client
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "My Projects",
            value: projects.length,
            icon: Briefcase,
            color: "#ef7f1b",
          },
          {
            label: "Pending Approvals",
            value: pendingApprovals.length,
            icon: ThumbsUp,
            color: "#ef7f1b",
          },
          {
            label: "Documents Shared",
            value: documents.length,
            icon: FileText,
            color: "#3b82f6",
          },
          {
            label: "Upcoming Events",
            value: upcomingEvents.length,
            icon: Calendar,
            color: "#8b5cf6",
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={i}
              className="border-l-[3px] p-4 hover:shadow-md transition-all"
              style={{ borderLeftColor: kpi.color }}
              data-testid={`client-kpi-${i}`}
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
        {/* Project Status */}
        <Card className="p-5" data-testid="client-projects">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Project Status
            </h2>
            <button
              onClick={() => navigate("/projects")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50/30 transition-colors cursor-pointer"
                onClick={() => navigate("/projects")}
                data-testid={`client-project-${i}`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-black truncate">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {p.stage} &middot; {p.status}
                  </p>
                </div>
                <div className="w-20 shrink-0">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ef7f1b] rounded-full transition-all"
                      style={{ width: `${p.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 text-right mt-0.5">
                    {p.progress || 0}%
                  </p>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No projects yet
              </p>
            )}
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="p-5" data-testid="client-approvals">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Pending Your Review
            </h2>
            <button
              onClick={() => navigate("/approvals-list")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {pendingApprovals.slice(0, 5).map((a, i) => (
              <div
                key={`${a.id}-${i}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#ef7f1b]/20 transition-all cursor-pointer"
                onClick={() => navigate("/approvals-list")}
                data-testid={`client-approval-${i}`}
              >
                <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-black truncate">
                    {a.document}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {a.module} &middot; {a.project}
                  </p>
                </div>
                <Badge className="bg-yellow-50 text-yellow-700 text-[9px] border-0">
                  Awaiting
                </Badge>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                All caught up!
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card className="p-5" data-testid="client-docs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Recent Documents
            </h2>
            <button
              onClick={() => navigate("/pdfs")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentDocs.map((d, i) => (
              <div
                key={`${d.id}-${i}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => navigate("/pdfs")}
                data-testid={`client-doc-${i}`}
              >
                <div className="w-7 h-7 rounded bg-red-50 flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-black truncate">
                    {d.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{d.module}</p>
                </div>
                <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                  {d.version || "v1.0"}
                </Badge>
              </div>
            ))}
            {recentDocs.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No documents
              </p>
            )}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-5" data-testid="client-events">
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
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/calendar")}
                data-testid={`client-event-${i}`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0"
                  style={{ backgroundColor: `${e.color || "#ef7f1b"}15` }}
                >
                  <p
                    className="text-[9px] font-bold"
                    style={{ color: e.color || "#ef7f1b" }}
                  >
                    {new Date(e.start_time).toLocaleDateString("en", {
                      month: "short",
                    })}
                  </p>
                  <p className="text-sm font-black text-black leading-none">
                    {new Date(e.start_time).getDate()}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-black truncate">
                    {e.title}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(e.start_time).toLocaleTimeString("en", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    {e.location ? ` · ${e.location}` : ""}
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
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// BUILDER DASHBOARD
// ─────────────────────────────────────
export function BuilderDashboard() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [reports, setReports] = useState([]);
  const [siteProgress, setSiteProgress] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/team-tasks"),
      api.get("/vendors"),
      api.get("/inventory"),
      api.get("/reports/all"),
      api.get("/dashboard/site-progress"),
    ])
      .then(([p, t, v, inv, r, sp]) => {
        setProjects(p.data);
        setTasks(t.data);
        setVendors(v.data);
        setInventory(inv.data);
        setReports(r.data);
        setSiteProgress(sp.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const blockedTasks = tasks.filter((t) => t.status === "blocked");
  const dailyReports = reports.filter(
    (r) => r.report_type === "Daily Progress",
  );

  return (
    <div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      data-testid="builder-dashboard"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black">Builder Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Construction progress & operations
          </p>
        </div>
        <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-xs border">
          Builder
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Active Projects",
            value: projects.filter((p) => p.status === "active").length,
            icon: Briefcase,
            color: "#ef7f1b",
          },
          {
            label: "Tasks In Progress",
            value: inProgressTasks.length,
            icon: ListTodo,
            color: "#3b82f6",
          },
          {
            label: "Blocked Tasks",
            value: blockedTasks.length,
            icon: AlertTriangle,
            color: blockedTasks.length > 0 ? "#e31d3b" : "#94a3b8",
          },
          {
            label: "Vendors Active",
            value: vendors.length,
            icon: Users,
            color: "#8b5cf6",
          },
          {
            label: "Inventory Items",
            value: inventory.length,
            icon: Package,
            color: "#f59e0b",
          },
          {
            label: "Daily Reports",
            value: dailyReports.length,
            icon: BarChart3,
            color: "#10b981",
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={i}
              className="border-l-[3px] p-4 hover:shadow-md transition-all"
              style={{ borderLeftColor: kpi.color }}
              data-testid={`builder-kpi-${i}`}
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
        {/* Execution Tasks */}
        <Card className="p-5" data-testid="builder-tasks">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Active Tasks
            </h2>
            <button
              onClick={() => navigate("/team-tasks")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View Board
            </button>
          </div>
          <div className="space-y-2">
            {activeTasks.slice(0, 6).map((t, i) => {
              const stCfg = {
                todo: "bg-gray-100 text-gray-600",
                in_progress: "bg-blue-50 text-blue-600",
                review: "bg-purple-50 text-purple-600",
                blocked: "bg-red-50 text-[#e31d3b]",
              };
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate("/team-tasks")}
                  data-testid={`builder-task-${i}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${t.status === "in_progress" ? "bg-blue-500" : t.status === "blocked" ? "bg-[#e31d3b]" : "bg-gray-300"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-black truncate">
                      {t.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t.project}
                      {t.assigned_to ? ` · ${t.assigned_to}` : ""}
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
            {activeTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No active tasks
              </p>
            )}
          </div>
        </Card>

        {/* Site Progress */}
        <Card className="p-5" data-testid="builder-site">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Site Progress
            </h2>
            <button
              onClick={() => navigate("/site-coord")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View Sites
            </button>
          </div>
          <div className="space-y-3">
            {siteProgress.slice(0, 4).map((s, i) => (
              <div
                key={i}
                className="p-3 bg-gray-50 rounded-lg"
                data-testid={`builder-site-${i}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-black">
                    {s.project_name}
                  </h4>
                  <span className="text-xs font-bold text-[#ef7f1b]">
                    {s.completion || 0}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ef7f1b] rounded-full"
                    style={{ width: `${s.completion || 0}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                  <span>Stage: {s.stage}</span>
                  {s.manpower && <span>Manpower: {s.manpower}</span>}
                  {s.issues > 0 && (
                    <span className="text-[#e31d3b]">{s.issues} issues</span>
                  )}
                </div>
              </div>
            ))}
            {siteProgress.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No site progress data
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Summary */}
        <Card className="p-5" data-testid="builder-vendors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Vendor Coordination
            </h2>
            <button
              onClick={() => navigate("/vendors")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {vendors.slice(0, 5).map((v, i) => (
              <div
                key={v.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                data-testid={`builder-vendor-${i}`}
              >
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {v.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-black truncate">
                    {v.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{v.trade_type}</p>
                </div>
                {v.rating && (
                  <div className="flex items-center gap-0.5 text-[10px] text-yellow-600">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {v.rating}
                  </div>
                )}
              </div>
            ))}
            {vendors.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No vendors
              </p>
            )}
          </div>
        </Card>

        {/* Material / Inventory */}
        <Card className="p-5" data-testid="builder-inventory">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Material Tracking
            </h2>
            <button
              onClick={() => navigate("/inventory")}
              className="text-[10px] text-[#ef7f1b] font-medium hover:underline"
            >
              View Inventory
            </button>
          </div>
          <div className="space-y-2">
            {inventory.slice(0, 6).map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg border border-gray-100"
                data-testid={`builder-inv-${i}`}
              >
                <Package className="w-4 h-4 text-[#ef7f1b] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-black truncate">
                    {item.material_name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {item.quantity_purchased} {item.unit}
                  </p>
                </div>
                <Badge
                  className={
                    item.delivery_status === "delivered"
                      ? "bg-green-50 text-green-700 border-0"
                      : "bg-yellow-50 text-yellow-700 border-0"
                  }
                >
                  {item.delivery_status || "pending"}
                </Badge>
              </div>
            ))}
            {inventory.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No inventory items
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// SITE SUPERVISOR DASHBOARD
// ─────────────────────────────────────
export function SupervisorDashboard() {
  const { api } = useAuth();
  const navigate = useNavigate();
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
// TEAM MEMBER DASHBOARD
// ─────────────────────────────────────
export function TeamDashboard() {
  const { api, user } = useAuth();
  const navigate = useNavigate();
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
