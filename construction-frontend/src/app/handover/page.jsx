import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Plus,
  ArrowLeft,
  FileText,
  Download,
  Loader2,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Printer,
  Send,
  PenLine,
} from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const STATUS_MAP = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Document Ready", color: "bg-blue-50 text-blue-600" },
  signed: { label: "Signed Off", color: "bg-green-50 text-green-600" },
};

const CHECKS = [
  {
    key: "execution_complete",
    label: "All execution work completed",
    icon: CheckCircle,
  },
  {
    key: "quality_cleared",
    label: "Final quality check cleared",
    icon: CheckCircle,
  },
  {
    key: "payments_settled",
    label: "Pending payments settled",
    icon: CheckCircle,
  },
  {
    key: "progress_100",
    label: "Work progress marked 100%",
    icon: CheckCircle,
  },
];

export default function HandoverPage() {
  const { api, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState("list");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const r = await api.get("/handovers");
      setItems(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/handovers/${id}`);
      setItems((p) => p.filter((x) => x.id !== id));
      if (active?.id === id) {
        setActive(null);
        setMode("list");
      }
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const openItem = (item) => {
    setActive(item);
    setMode(item.document_generated ? "document" : "form");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  if (mode === "form" && active)
    return (
      <HandoverForm
        item={active}
        api={api}
        user={user}
        onBack={() => {
          setMode("list");
          fetchData();
        }}
        onGenerated={(d) => {
          setActive(d);
          setMode("document");
        }}
      />
    );
  if (mode === "document" && active)
    return (
      <HandoverDocument
        item={active}
        api={api}
        user={user}
        onBack={() => {
          setMode("list");
          fetchData();
        }}
        onEdit={() => setMode("form")}
      />
    );

  return (
    <div className="flex flex-col h-full" data-testid="handover-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="handover-title"
            >
              Handover
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {items.length} handover{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          {user?.role !== "Client" && (
            <Button
              onClick={() => setShowNew(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
              data-testid="new-handover-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> New Handover
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <Lock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                No handover documents yet.
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Handover activates when execution, quality, and payments are
                complete.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, i) => {
                const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                const checks = item.activation_checks || {};
                const checksPassed =
                  Object.values(checks).filter(Boolean).length;
                const isActivated = checksPassed === 4;
                return (
                  <Card
                    key={item.id}
                    className={`p-4 transition-all cursor-pointer ${isActivated ? "hover:shadow-lg hover:border-[#ef7f1b]/20" : "opacity-75"}`}
                    onClick={() => openItem(item)}
                    data-testid={`handover-card-${i}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isActivated ? (
                          <Unlock className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                        <h3 className="text-sm font-bold text-black">
                          {item.project_name}
                        </h3>
                      </div>
                      <Badge className={`${st.color} text-[10px] border-0`}>
                        {st.label}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {item.client_name} &middot;{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${(checksPassed / 4) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">
                          {checksPassed}/4
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-400">
                        {isActivated
                          ? "Ready for handover"
                          : "Pending conditions"}
                      </p>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-gray-300 hover:text-[#e31d3b]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md" data-testid="new-handover-dialog">
          <DialogHeader>
            <DialogTitle>New Handover</DialogTitle>
          </DialogHeader>
          <NewHandoverForm
            api={api}
            onSuccess={(h) => {
              setItems((p) => [...p, h]);
              setShowNew(false);
              setActive(h);
              setMode("form");
              toast.success("Created");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewHandoverForm({ api, onSuccess }) {
  const [form, setForm] = useState({
    project_name: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    project_type: "",
    project_address: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.project_name.trim()) {
      toast.error("Project name required");
      return;
    }
    setSaving(true);
    try {
      const r = await api.post("/handovers", form);
      onSuccess(r.data);
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
          Project Name *
        </Label>
        <Input
          value={form.project_name}
          onChange={(e) =>
            setForm((p) => ({ ...p, project_name: e.target.value }))
          }
          className="mt-1"
          data-testid="handover-project-name"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Client Name
          </Label>
          <Input
            value={form.client_name}
            onChange={(e) =>
              setForm((p) => ({ ...p, client_name: e.target.value }))
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Client Email
          </Label>
          <Input
            value={form.client_email}
            onChange={(e) =>
              setForm((p) => ({ ...p, client_email: e.target.value }))
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
          data-testid="handover-create-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}{" "}
          Create
        </Button>
      </div>
    </div>
  );
}

function HandoverForm({ item, api, user, onBack, onGenerated }) {
  const [form, setForm] = useState({ ...item });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const checks = form.activation_checks || {};
  const checksPassed = Object.values(checks).filter(Boolean).length;
  const isActivated = checksPassed === 4;

  const toggleCheck = (key) => {
    if (user?.role === "Client") return;
    const newChecks = { ...checks, [key]: !checks[key] };
    setForm((p) => ({ ...p, activation_checks: newChecks }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/handovers/${item.id}`, form);
      toast.success("Saved");
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    if (!isActivated) {
      toast.error("Complete all checklist items first");
      return;
    }
    setGenerating(true);
    try {
      await api.put(`/handovers/${item.id}`, form);
      await api.post(`/handovers/${item.id}/generate`);
      const u = await api.get(`/handovers/${item.id}`);
      toast.success("Handover document generated");
      onGenerated(u.data);
    } catch {
      toast.error("Failed");
    } finally {
      setGenerating(false);
    }
  };

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col h-full" data-testid="handover-form">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">
                {form.project_name}
              </h1>
              <p className="text-[11px] text-gray-400">Module: Handover</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={save}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Edit3 className="w-3.5 h-3.5 mr-1" />
              )}{" "}
              Save
            </Button>
            <Button
              size="sm"
              onClick={generate}
              disabled={generating || !isActivated}
              className={
                isActivated
                  ? "bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
              data-testid="handover-generate-btn"
            >
              {generating ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 mr-1" />
              )}{" "}
              Generate Document
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
          {/* Activation Checklist */}
          <Card className="p-4" data-testid="handover-checklist">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black">
                Activation Checklist
              </h3>
              <Badge
                className={
                  isActivated
                    ? "bg-green-50 text-green-700 border-0"
                    : "bg-yellow-50 text-yellow-700 border-0"
                }
              >
                {isActivated ? "Activated" : `${checksPassed}/4 Complete`}
              </Badge>
            </div>
            <div className="space-y-2">
              {CHECKS.map((check) => {
                const done = checks[check.key];
                return (
                  <button
                    key={check.key}
                    onClick={() => toggleCheck(check.key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${done ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"}`}
                    data-testid={`check-${check.key}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-green-500" : "border-2 border-gray-300"}`}
                    >
                      {done && (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${done ? "text-green-700 font-medium" : "text-gray-600"}`}
                    >
                      {check.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Project & Client Details */}
          <Card className="p-4">
            <h3 className="text-sm font-bold text-black mb-3">
              Project & Client Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Project Type
                </Label>
                <Input
                  value={form.project_type || ""}
                  onChange={(e) => update("project_type", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Project Address
                </Label>
                <Input
                  value={form.project_address || ""}
                  onChange={(e) => update("project_address", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Client Name
                </Label>
                <Input
                  value={form.client_name || ""}
                  onChange={(e) => update("client_name", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Client Phone
                </Label>
                <Input
                  value={form.client_phone || ""}
                  onChange={(e) => update("client_phone", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Scope & Timeline */}
          <Card className="p-4">
            <h3 className="text-sm font-bold text-black mb-3">
              Scope & Timeline
            </h3>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Scope Summary
              </Label>
              <Textarea
                value={form.scope_summary || ""}
                onChange={(e) => update("scope_summary", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Planned Start
                </Label>
                <Input
                  type="date"
                  value={form.planned_start || ""}
                  onChange={(e) => update("planned_start", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Planned End
                </Label>
                <Input
                  type="date"
                  value={form.planned_end || ""}
                  onChange={(e) => update("planned_end", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Actual Start
                </Label>
                <Input
                  type="date"
                  value={form.actual_start || ""}
                  onChange={(e) => update("actual_start", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Actual End
                </Label>
                <Input
                  type="date"
                  value={form.actual_end || ""}
                  onChange={(e) => update("actual_end", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Completion & Warranty */}
          <Card className="p-4">
            <h3 className="text-sm font-bold text-black mb-3">
              Completion & Warranty
            </h3>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Outstanding Items
              </Label>
              <Textarea
                value={form.outstanding_items || ""}
                onChange={(e) => update("outstanding_items", e.target.value)}
                className="mt-1"
                rows={2}
                placeholder="Any pending items..."
              />
            </div>
            <div className="mt-3">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Warranty & Maintenance Notes
              </Label>
              <Textarea
                value={form.warranty_notes || ""}
                onChange={(e) => update("warranty_notes", e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
            <div className="mt-3">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Remarks
              </Label>
              <Textarea
                value={form.remarks || ""}
                onChange={(e) => update("remarks", e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

function HandoverDocument({ item, api, user, onBack, onEdit }) {
  const [data, setData] = useState(item);
  const st = STATUS_MAP[data.status] || STATUS_MAP.draft;

  const handleDownload = () => {
    if (data.document_url)
      window.open(`${BACKEND}${data.document_url}`, "_blank");
  };
  const handlePrint = () => {
    if (data.document_url) {
      const w = window.open(`${BACKEND}${data.document_url}`, "_blank");
      w?.print();
    }
  };

  const handleSign = async () => {
    try {
      const r = await api.post(`/handovers/${data.id}/sign`, {
        signature: user?.name,
      });
      setData(r.data);
      toast.success("Signed successfully");
    } catch {
      toast.error("Failed");
    }
  };

  const checks = data.activation_checks || {};

  return (
    <div className="flex flex-col h-full" data-testid="handover-document">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">
                {data.project_name}
              </h1>
              <p className="text-[11px] text-gray-400">Handover Document</p>
            </div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>
              {st.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {user?.role !== "Client" && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1" /> Print
            </Button>
            <Button
              size="sm"
              onClick={handleSign}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              data-testid="handover-sign-btn"
            >
              <PenLine className="w-3.5 h-3.5 mr-1" /> Sign Off
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>
              <h2 className="text-2xl font-bold text-black mt-4">
                Project Handover Document
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {data.project_name} &middot;{" "}
                {data.handover_date ||
                  new Date(data.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Project Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                  1. Project Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Project Name", data.project_name],
                    ["Type", data.project_type],
                    ["Address", data.project_address],
                  ].map(([l, v], i) => (
                    <div key={i} className={!v ? "opacity-40" : ""}>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        {l}
                      </p>
                      <p className="text-sm text-black mt-0.5">{v || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                  2. Client Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Name", data.client_name],
                    ["Email", data.client_email],
                    ["Phone", data.client_phone],
                  ].map(([l, v], i) => (
                    <div key={i} className={!v ? "opacity-40" : ""}>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        {l}
                      </p>
                      <p className="text-sm text-black mt-0.5">{v || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                  3. Scope Summary
                </h3>
                <p className="text-sm text-black whitespace-pre-wrap">
                  {data.scope_summary || "—"}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                  4. Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Planned Start", data.planned_start],
                    ["Planned End", data.planned_end],
                    ["Actual Start", data.actual_start],
                    ["Actual End", data.actual_end],
                  ].map(([l, v], i) => (
                    <div key={i} className={!v ? "opacity-40" : ""}>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        {l}
                      </p>
                      <p className="text-sm text-black mt-0.5">{v || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                  5. Completion Confirmation
                </h3>
                <div className="space-y-2">
                  {CHECKS.map((c) => (
                    <div
                      key={c.key}
                      className={`flex items-center gap-2 p-2 rounded-lg ${checks[c.key] ? "bg-green-50" : "bg-red-50"}`}
                    >
                      {checks[c.key] ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#e31d3b]" />
                      )}
                      <span className="text-xs">{c.label}</span>
                    </div>
                  ))}
                </div>
                {data.outstanding_items && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase text-gray-400 font-bold">
                      Outstanding Items
                    </p>
                    <p className="text-sm text-black">
                      {data.outstanding_items}
                    </p>
                  </div>
                )}
              </div>

              {/* Warranty */}
              {data.warranty_notes && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                    6. Warranty & Maintenance
                  </h3>
                  <p className="text-sm text-black whitespace-pre-wrap">
                    {data.warranty_notes}
                  </p>
                </div>
              )}

              {/* Sign-off */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                  7. Sign-Off
                </h3>
                <div className="grid grid-cols-2 gap-8 mt-6">
                  <div className="text-center">
                    <div className="h-16 border-b-2 border-gray-300 mb-2 flex items-end justify-center pb-1">
                      {data.client_signature ? (
                        <span className="text-sm font-medium text-black italic">
                          {data.client_signature}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">
                          Awaiting signature
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Client Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b-2 border-gray-300 mb-2 flex items-end justify-center pb-1">
                      {data.firm_signature ? (
                        <span className="text-sm font-medium text-black italic">
                          {data.firm_signature}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">
                          Awaiting signature
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Firm Signature</p>
                  </div>
                </div>
                {data.remarks && (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase text-gray-400 font-bold">
                      Remarks
                    </p>
                    <p className="text-sm text-black mt-1">{data.remarks}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">
                Generated by BUILDCON &middot; Confidential Document
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
