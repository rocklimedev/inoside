// src/app/dashboard/page.jsx

"use client";

import { useState, useEffect } from "react";

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

export default function ArchitectDashboard() {
  const { token } = useAuth();

  const [kpis, setKpis] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [projects, setProjects] = useState([]);
  const [actions, setActions] = useState([]);
  const [approvals, setApprovals] = useState({
    design: [],
    execution: [],
  });

  const [documents, setDocuments] = useState([]);
  const [siteProgress, setSiteProgress] = useState([]);
  const [clientComms, setClientComms] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token]);

  const fetchData = async (url) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }

    return res.json();
  };

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [k, p, proj, act, apr, doc, sp, cc, al] = await Promise.all([
        fetchData("/dashboard/kpis"),
        fetchData("/dashboard/pipeline"),
        fetchData("/dashboard/projects"),
        fetchData("/dashboard/priority-actions"),
        fetchData("/dashboard/approvals"),
        fetchData("/dashboard/documents"),
        fetchData("/dashboard/site-progress"),
        fetchData("/dashboard/client-comms"),
        fetchData("/dashboard/alerts"),
      ]);

      setKpis(k);
      setPipeline(p);
      setProjects(proj);
      setActions(act);
      setApprovals(apr);
      setDocuments(doc);
      setSiteProgress(sp);
      setClientComms(cc);
      setAlerts(al);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-400">Loading dashboard...</p>
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
      color: kpis?.delay_flags > 0 ? "#e31d3b" : "#94a3b8",
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
              className="border-l-[3px] p-4 md:p-5 hover:shadow-md transition-all cursor-pointer animate-fadeInUp"
              style={{
                borderLeftColor: kpi.color,
                animationDelay: `${i * 80}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-tight">
                    {kpi.label}
                  </p>

                  <p className="mt-1.5 text-2xl md:text-3xl font-black text-black">
                    {kpi.value}
                  </p>
                </div>

                <Icon
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: kpi.color }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project Pipeline */}
      <Card className="p-5 md:p-6">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-black">
          Project Pipeline
        </h2>

        <div className="flex items-start overflow-x-auto pb-3 -mx-1">
          {pipeline.map((stage, i) => (
            <div key={i} className="flex items-center shrink-0">
              <div
                className="flex flex-col items-center min-w-[72px] md:min-w-[80px] cursor-pointer group px-1 animate-fadeInUp"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all group-hover:scale-110 ${
                    stage.count > 0
                      ? "border-[#ef7f1b] bg-[#ef7f1b] text-white shadow-sm shadow-orange-200"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {stage.count}
                </div>

                <span className="mt-2 text-[9px] md:text-[10px] font-medium text-gray-500 text-center leading-tight max-w-[70px]">
                  {stage.name}
                </span>

                {stage.has_overdue && (
                  <span className="w-1.5 h-1.5 mt-1 rounded-full bg-[#e31d3b]" />
                )}
              </div>

              {i < pipeline.length - 1 && (
                <div className="w-4 md:w-6 h-px bg-gray-200 mt-[-20px] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Priority Actions + Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <PriorityActions actions={actions} />

        <ApprovalsPanel approvals={approvals} />
      </div>

      {/* Document Center + Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <DocumentCenter documents={documents} />

        <ActiveProjects projects={projects} />
      </div>

      {/* Site Progress + Client Comms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <SiteProgress data={siteProgress} />

        <ClientComms data={clientComms} />
      </div>

      {/* Alerts */}
      <AlertsPanel alerts={alerts} />
    </div>
  );
}
