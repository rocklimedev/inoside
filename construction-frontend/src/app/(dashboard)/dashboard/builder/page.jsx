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

// ───────────────────────────────────
// ─────────────────────────────────────
// BUILDER DASHBOARD
// ─────────────────────────────────────
export default function BuilderDashboard() {
  const { api } = useAuth();
  const navigate = useRouter();
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
