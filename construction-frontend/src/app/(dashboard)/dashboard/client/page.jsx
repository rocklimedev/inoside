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
// CLIENT DASHBOARD
// ─────────────────────────────────────
export default function ClientDashboard() {
  const { api } = useAuth();
  const navigate = useRouter();
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
