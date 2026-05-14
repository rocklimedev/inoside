"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { Card } from "@/components/ui/card";

import {
  Briefcase,
  FileCheck2,
  PenLine,
  HardHat,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  PriorityActions,
  ApprovalsPanel,
  DocumentCenter,
} from "@/components/dashboard/WorkPanels";

import {
  ActiveProjects,
  SiteProgress,
  ClientComms,
  AlertsPanel,
} from "@/components/dashboard/MonitoringPanels";

const STAGE_LIST = [
  "Brief",
  "Pitch",
  "Site Reki",
  "Scope",
  "Time & Cost",
  "BOQ",
  "Design",
  "Execution",
  "Vendor",
  "Inventory",
  "Quality",
  "Handover",
];

export default function ArchitectDashboardPage() {
  const { api } = useAuth();

  const [kpis, setKpis] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [projects, setProjects] = useState([]);
  const [actions, setActions] = useState([]);
  const [approvals, setApprovals] = useState({ design: [], execution: [] });
  const [documents, setDocuments] = useState([]);
  const [siteProgress, setSiteProgress] = useState([]);
  const [clientComms, setClientComms] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    if (!api) {
      setLoading(false);
      return;
    }

    try {
      const [k, p, proj, act, apr, doc, sp, cc, al] = await Promise.all([
        api.get("/dashboard/kpis"),
        api.get("/dashboard/pipeline"),
        api.get("/dashboard/projects"),
        api.get("/dashboard/priority-actions"),
        api.get("/dashboard/approvals"),
        api.get("/dashboard/documents"),
        api.get("/dashboard/site-progress"),
        api.get("/dashboard/client-comms"),
        api.get("/dashboard/alerts"),
      ]);

      setKpis(k.data);
      setPipeline(p.data || []);
      setProjects(proj.data || []);
      setActions(act.data || []);
      setApprovals(apr.data || { design: [], execution: [] });
      setDocuments(doc.data || []);
      setSiteProgress(sp.data || []);
      setClientComms(cc.data || []);
      setAlerts(al.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Active Projects",
      value: kpis?.total_active || 0,
      icon: Briefcase,
      color: "#ef7f1b",
    },
    {
      label: "Pending Approvals",
      value: kpis?.pending_approvals || 0,
      icon: FileCheck2,
      color: "#ef7f1b",
    },
    {
      label: "Under Revision",
      value: kpis?.under_revision || 0,
      icon: PenLine,
      color: "#ef7f1b",
    },
    {
      label: "Execution Awaiting",
      value: kpis?.exec_awaiting || 0,
      icon: HardHat,
      color: "#ef7f1b",
    },
    {
      label: "Delay Flags",
      value: kpis?.delay_flags || 0,
      icon: AlertTriangle,
      color: (kpis?.delay_flags || 0) > 0 ? "#e31d3b" : "#94a3b8",
    },
    {
      label: "Handover Ready",
      value: kpis?.handover_ready || 0,
      icon: CheckCircle2,
      color: "#22c55e",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;

          return (
            <Card
              key={i}
              className="border-l-[3px] p-4 md:p-5 hover:shadow-md transition-all cursor-pointer"
              style={{ borderLeftColor: kpi.color }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {kpi.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-black mt-1.5">
                    {kpi.value}
                  </p>
                </div>

                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pipeline */}
      <Card className="p-5 md:p-6">
        <h2 className="text-sm font-bold mb-5 uppercase tracking-wider">
          Project Pipeline
        </h2>

        <div className="flex items-start overflow-x-auto pb-3">
          {pipeline.map((stage, i) => (
            <div key={i} className="flex items-center shrink-0">
              <div className="flex flex-col items-center min-w-[72px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    stage.count > 0
                      ? "border-[#ef7f1b] bg-[#ef7f1b] text-white"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  {stage.count}
                </div>

                <span className="text-[10px] text-gray-500 mt-2 text-center">
                  {stage.name}
                </span>
              </div>

              {i < pipeline.length - 1 && (
                <div className="w-6 h-px bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityActions actions={actions} />
        <ApprovalsPanel approvals={approvals} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentCenter documents={documents} />
        <ActiveProjects projects={projects} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SiteProgress data={siteProgress} />
        <ClientComms data={clientComms} />
      </div>

      <AlertsPanel alerts={alerts} />
    </div>
  );
}
