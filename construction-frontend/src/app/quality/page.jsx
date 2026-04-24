import React, { useState, useEffect, useRef } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus,
  Search,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Upload,
  Camera,
  X,
  RefreshCw,
  Zap,
} from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const CHECK_STATUS = {
  pending: {
    label: "Pending",
    color: "bg-yellow-50 text-yellow-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-50 text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-[#e31d3b]",
    icon: XCircle,
  },
  rectification: {
    label: "Needs Rectification",
    color: "bg-orange-50 text-[#ef7f1b]",
    icon: RefreshCw,
  },
};

export default function QualityPage() {
  const { api, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/projects")
      .then((r) => setProjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  if (selectedProject)
    return (
      <QualityWorkspace
        project={selectedProject}
        api={api}
        user={user}
        onBack={() => setSelectedProject(null)}
      />
    );

  return (
    <div className="flex flex-col h-full" data-testid="quality-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <h1
          className="text-xl font-black text-black"
          data-testid="quality-title"
        >
          Quality & Progress
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Select a project to manage quality
        </p>
      </div>
      <div className="p-4 md:p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-10"
            data-testid="quality-project-search"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects
            .filter(
              (p) =>
                !search || p.name?.toLowerCase().includes(search.toLowerCase()),
            )
            .map((p, i) => (
              <Card
                key={p.id}
                className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer"
                onClick={() => setSelectedProject(p)}
                data-testid={`quality-project-${i}`}
              >
                <h3 className="text-sm font-bold text-black">{p.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1">
                  {p.client} &middot; {p.stage}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

function QualityWorkspace({ project, api, user, onBack }) {
  const [checklist, setChecklist] = useState([]);
  const [issues, setIssues] = useState([]);
  const [progress, setProgress] = useState(null);
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [showAddCheck, setShowAddCheck] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [generating, setGenerating] = useState(false);
  const isClient = user?.role === "Client";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cl, iss, prog] = await Promise.all([
        api.get(`/quality/checklist?project_id=${project.id}`),
        api.get(`/quality/issues?project_id=${project.id}`),
        api.get(`/quality/progress/${project.id}`),
      ]);
      setChecklist(cl.data);
      setIssues(iss.data);
      setProgress(prog.data);
    } catch (e) {
      console.error(e);
    }
  };

  const autoGenerate = async () => {
    setGenerating(true);
    try {
      const r = await api.post(`/quality/auto-generate/${project.id}`);
      toast.success(`${r.data.created} checklist items generated`);
      loadData();
    } catch {
      toast.error("Failed");
    } finally {
      setGenerating(false);
    }
  };

  const updateCheckStatus = async (cid, status) => {
    try {
      await api.put(`/quality/checklist/${cid}`, {
        check_status: status,
        approved_by: user?.name || "",
      });
      loadData();
      toast.success(`Status: ${status}`);
    } catch {
      toast.error("Failed");
    }
  };

  const p = progress || {
    total_checks: 0,
    approved: 0,
    rejected: 0,
    pending_checks: 0,
    open_issues: 0,
    closed_issues: 0,
    completion_pct: 0,
    quality_pct: 0,
  };

  return (
    <div className="flex flex-col h-full" data-testid="quality-workspace">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">{project.name}</h1>
              <p className="text-[11px] text-gray-400">Quality & Progress</p>
            </div>
          </div>
          {!isClient && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={autoGenerate}
                disabled={generating}
                data-testid="auto-generate-btn"
              >
                {generating ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 mr-1" />
                )}{" "}
                Auto-Generate Checklist
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddIssue(true)}
                data-testid="add-issue-btn"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Report Issue
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddCheck(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                data-testid="add-check-btn"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Check
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dashboard Strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-4 md:px-6 bg-gray-50/50 border-b border-gray-100">
        {[
          {
            label: "Completion",
            value: `${p.completion_pct}%`,
            icon: TrendingUp,
          },
          {
            label: "Quality Score",
            value: `${p.quality_pct}%`,
            icon: CheckCircle,
          },
          { label: "Approved", value: p.approved, icon: CheckCircle },
          { label: "Pending", value: p.pending_checks, icon: Clock },
          { label: "Open Issues", value: p.open_issues, icon: AlertTriangle },
          { label: "Resolved", value: p.closed_issues, icon: CheckCircle },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <Card
              key={i}
              className="p-3 text-center"
              data-testid={`quality-kpi-${i}`}
            >
              <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-black text-black">{k.value}</p>
              <p className="text-[9px] text-gray-400">{k.label}</p>
            </Card>
          );
        })}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="mx-4 mt-3 bg-gray-100 p-0.5 rounded-lg w-fit">
          <TabsTrigger value="dashboard" className="text-xs px-3 py-1.5">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="checklist" className="text-xs px-3 py-1.5">
            Quality Checklist
          </TabsTrigger>
          <TabsTrigger value="issues" className="text-xs px-3 py-1.5">
            Issues & Rectification
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="flex-1 overflow-hidden m-0">
          <div className="p-4 max-w-3xl">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="text-sm font-bold text-black mb-4">
                  Overall Progress
                </h3>
                <div className="relative w-32 h-32 mx-auto">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#ef7f1b"
                      strokeWidth="8"
                      strokeDasharray={`${p.completion_pct * 2.64} 264`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-black">
                      {p.completion_pct}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Task Completion
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-bold text-black mb-4">
                  Quality Score
                </h3>
                <div className="relative w-32 h-32 mx-auto">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={`${p.quality_pct * 2.64} 264`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-black">
                      {p.quality_pct}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Quality Approved
                </p>
              </Card>
            </div>

            <Card className="p-4 mt-4">
              <h3 className="text-sm font-bold text-black mb-3">
                Checklist Summary
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Checks",
                    value: p.total_checks,
                    color: "text-black",
                  },
                  {
                    label: "Approved",
                    value: p.approved,
                    color: "text-green-600",
                  },
                  {
                    label: "Pending",
                    value: p.pending_checks,
                    color: "text-yellow-600",
                  },
                  {
                    label: "Rejected",
                    value: p.rejected,
                    color: "text-[#e31d3b]",
                  },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Checklist */}
        <TabsContent value="checklist" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2 max-w-3xl">
              {checklist.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No checklist items</p>
                  {!isClient && (
                    <p className="text-xs text-gray-300 mt-1">
                      Click "Auto-Generate" to create from tasks
                    </p>
                  )}
                </div>
              ) : (
                checklist.map((c, i) => {
                  const st =
                    CHECK_STATUS[c.check_status] || CHECK_STATUS.pending;
                  const StIcon = st.icon;
                  return (
                    <Card
                      key={c.id}
                      className="p-3 flex items-center gap-3"
                      data-testid={`check-item-${i}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${st.color}`}
                      >
                        <StIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-black">
                          {c.task_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                          {c.stage && <span>{c.stage}</span>}
                          {c.responsible_party && (
                            <span>&middot; {c.responsible_party}</span>
                          )}
                          {c.approved_by && (
                            <span>&middot; Approved by {c.approved_by}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={`${st.color} text-[9px] border-0`}>
                        {st.label}
                      </Badge>
                      {!isClient && c.check_status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateCheckStatus(c.id, "approved")}
                            className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100"
                            data-testid={`approve-check-${i}`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => updateCheckStatus(c.id, "rejected")}
                            className="w-7 h-7 rounded-full bg-red-50 text-[#e31d3b] flex items-center justify-center hover:bg-red-100"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              updateCheckStatus(c.id, "rectification")
                            }
                            className="w-7 h-7 rounded-full bg-orange-50 text-[#ef7f1b] flex items-center justify-center hover:bg-orange-100"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Issues */}
        <TabsContent value="issues" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3 max-w-3xl">
              {issues.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No issues reported</p>
                </div>
              ) : (
                issues.map((iss, i) => (
                  <Card
                    key={iss.id}
                    className="p-4"
                    data-testid={`issue-card-${i}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-black">
                          {iss.description}
                        </h4>
                        {iss.linked_task && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Linked: {iss.linked_task}
                          </p>
                        )}
                      </div>
                      <Badge
                        className={
                          iss.status === "open"
                            ? "bg-red-50 text-[#e31d3b] border-0"
                            : "bg-green-50 text-green-700 border-0"
                        }
                      >
                        {iss.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                      {iss.responsible_party && (
                        <div>
                          <span className="font-bold uppercase">
                            Responsible:
                          </span>{" "}
                          {iss.responsible_party}
                        </div>
                      )}
                      {iss.target_date && (
                        <div>
                          <span className="font-bold uppercase">Target:</span>{" "}
                          {iss.target_date}
                        </div>
                      )}
                    </div>
                    {(iss.before_photo || iss.after_photo) && (
                      <div className="flex gap-3 mt-2">
                        {iss.before_photo && (
                          <div>
                            <p className="text-[9px] text-gray-400 mb-1">
                              Before
                            </p>
                            <img
                              src={`${BACKEND}${iss.before_photo}`}
                              alt=""
                              className="w-20 h-20 rounded-lg object-cover border"
                            />
                          </div>
                        )}
                        {iss.after_photo && (
                          <div>
                            <p className="text-[9px] text-gray-400 mb-1">
                              After
                            </p>
                            <img
                              src={`${BACKEND}${iss.after_photo}`}
                              alt=""
                              className="w-20 h-20 rounded-lg object-cover border"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {!isClient && iss.status === "open" && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={async () => {
                            try {
                              await api.put(`/quality/issues/${iss.id}`, {
                                status: "closed",
                              });
                              loadData();
                              toast.success("Issue closed");
                            } catch {
                              toast.error("Failed");
                            }
                          }}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Mark Resolved
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Add Issue Dialog */}
      <Dialog open={showAddIssue} onOpenChange={setShowAddIssue}>
        <DialogContent className="max-w-md" data-testid="add-issue-dialog">
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
          </DialogHeader>
          <AddIssueForm
            api={api}
            projectId={project.id}
            onSuccess={() => {
              setShowAddIssue(false);
              loadData();
              toast.success("Issue reported");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Check Dialog */}
      <Dialog open={showAddCheck} onOpenChange={setShowAddCheck}>
        <DialogContent className="max-w-md" data-testid="add-check-dialog">
          <DialogHeader>
            <DialogTitle>Add Quality Check</DialogTitle>
          </DialogHeader>
          <AddCheckForm
            api={api}
            projectId={project.id}
            onSuccess={() => {
              setShowAddCheck(false);
              loadData();
              toast.success("Check added");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddIssueForm({ api, projectId, onSuccess }) {
  const [form, setForm] = useState({
    description: "",
    linked_task: "",
    responsible_party: "",
    target_date: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.description.trim()) {
      toast.error("Description required");
      return;
    }
    setSaving(true);
    try {
      await api.post("/quality/issues", { ...form, project_id: projectId });
      onSuccess();
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 py-2">
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Description *
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          className="mt-1"
          rows={2}
          data-testid="issue-desc-input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Linked Task
          </Label>
          <Input
            value={form.linked_task}
            onChange={(e) =>
              setForm((p) => ({ ...p, linked_task: e.target.value }))
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Responsible
          </Label>
          <Input
            value={form.responsible_party}
            onChange={(e) =>
              setForm((p) => ({ ...p, responsible_party: e.target.value }))
            }
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Target Date
        </Label>
        <Input
          type="date"
          value={form.target_date}
          onChange={(e) =>
            setForm((p) => ({ ...p, target_date: e.target.value }))
          }
          className="mt-1"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="issue-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <AlertTriangle className="w-4 h-4 mr-1" />
          )}{" "}
          Report
        </Button>
      </div>
    </div>
  );
}

function AddCheckForm({ api, projectId, onSuccess }) {
  const [form, setForm] = useState({
    task_name: "",
    stage: "",
    responsible_party: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.task_name.trim()) {
      toast.error("Task name required");
      return;
    }
    setSaving(true);
    try {
      await api.post("/quality/checklist", { ...form, project_id: projectId });
      onSuccess();
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 py-2">
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Task / Check Name *
        </Label>
        <Input
          value={form.task_name}
          onChange={(e) =>
            setForm((p) => ({ ...p, task_name: e.target.value }))
          }
          className="mt-1"
          data-testid="check-name-input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Stage
          </Label>
          <Input
            value={form.stage}
            onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Responsible Party
          </Label>
          <Input
            value={form.responsible_party}
            onChange={(e) =>
              setForm((p) => ({ ...p, responsible_party: e.target.value }))
            }
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="check-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}{" "}
          Add Check
        </Button>
      </div>
    </div>
  );
}
