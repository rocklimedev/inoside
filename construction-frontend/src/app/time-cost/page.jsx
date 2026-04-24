import React, { useState, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Plus,
  FileText,
  Save,
  Download,
  ChevronDown,
  ChevronRight,
  Check,
  Clock,
  DollarSign,
  CreditCard,
  ArrowLeft,
  Loader2,
  Edit3,
  Trash2,
} from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const SECTIONS = [
  {
    id: "timeline",
    title: "Project Timeline",
    icon: Clock,
    fields: [
      "design_duration",
      "execution_duration",
      "approval_milestones",
      "completion_deadline",
    ],
  },
  {
    id: "cost",
    title: "Cost Framework",
    icon: DollarSign,
    fields: [
      "design_cost",
      "execution_cost",
      "consultation_fees",
      "misc_budget",
    ],
  },
  {
    id: "payments",
    title: "Payment Milestones",
    icon: CreditCard,
    fields: [
      "advance_payment",
      "design_completion_payment",
      "execution_stage_payments",
      "final_payment",
    ],
  },
];

const STATUS_MAP = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Document Ready", color: "bg-blue-50 text-blue-600" },
  approved: { label: "Approved", color: "bg-green-50 text-green-600" },
};

const FIELD_LABELS = {
  design_duration: "Design Phase Duration",
  execution_duration: "Execution Duration",
  approval_milestones: "Approval Milestones",
  completion_deadline: "Completion Deadline",
  design_cost: "Estimated Design Cost",
  execution_cost: "Execution Cost Estimate",
  consultation_fees: "Consultation Fees",
  misc_budget: "Miscellaneous Budget",
  advance_payment: "Advance Payment",
  design_completion_payment: "Design Completion",
  execution_stage_payments: "Execution Stages",
  final_payment: "Final Payment",
};

export default function TimeCostPage() {
  const { api, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState("list");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const r = await api.get("/time-costs");
      setItems(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Project name required");
      return;
    }
    try {
      const r = await api.post("/time-costs", { project_name: newName });
      setItems((p) => [...p, r.data]);
      setActive(r.data);
      setMode("form");
      setShowNew(false);
      setNewName("");
      toast.success("Created");
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/time-costs/${id}`);
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
    setMode(
      user?.role === "Client"
        ? "document"
        : item.document_generated
          ? "document"
          : "form",
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  if (mode === "form" && active)
    return (
      <TCForm
        item={active}
        api={api}
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
      <TCDocument
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
    <div className="flex flex-col h-full" data-testid="timecost-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="timecost-title"
            >
              Time & Cost
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {items.length} estimate{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          {user?.role !== "Client" && (
            <Button
              onClick={() => setShowNew(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
              data-testid="new-timecost-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> New Estimate
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No estimates yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, i) => {
                const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                return (
                  <Card
                    key={item.id}
                    className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer"
                    onClick={() => openItem(item)}
                    data-testid={`timecost-card-${i}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-black">
                        {item.project_name}
                      </h3>
                      <Badge className={`${st.color} text-[10px] border-0`}>
                        {st.label}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      By {item.created_by} &middot;{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Time & Cost Estimate</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Project Name *
            </Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1"
              data-testid="new-timecost-name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              data-testid="new-timecost-submit"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TCForm({ item, api, onBack, onGenerated }) {
  const [form, setForm] = useState({ ...item });
  const [open, setOpen] = useState({ timeline: true });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const timer = useRef(null);

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save({ ...form, [k]: v }), 2000);
  };
  const save = async (d) => {
    setSaving(true);
    try {
      await api.put(`/time-costs/${item.id}`, d || form);
    } catch {
    } finally {
      setSaving(false);
    }
  };
  const generate = async () => {
    setGenerating(true);
    try {
      await api.put(`/time-costs/${item.id}`, form);
      await api.post(`/time-costs/${item.id}/generate`);
      const u = await api.get(`/time-costs/${item.id}`);
      toast.success("Document generated");
      onGenerated(u.data);
    } catch {
      toast.error("Failed");
    } finally {
      setGenerating(false);
    }
  };

  const allFields = SECTIONS.flatMap((s) => s.fields);
  const filled = allFields.filter(
    (f) => form[f] && String(form[f]).trim(),
  ).length;
  const prog = Math.round((filled / allFields.length) * 100);

  return (
    <div className="flex flex-col h-full" data-testid="timecost-form">
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
              <p className="text-[11px] text-gray-400">Module: Time & Cost</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">
              {saving ? "Saving..." : "Auto-saved"}
            </span>
            <Button variant="outline" size="sm" onClick={() => save()}>
              <Save className="w-3.5 h-3.5 mr-1" /> Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generate}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 mr-1" />
              )}{" "}
              Generate
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress
            value={prog}
            className="h-1.5 flex-1 bg-gray-100 progress-orange"
          />
          <span className="text-xs font-bold text-gray-500">{prog}%</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isOpen = open[s.id];
            const sF = s.fields.filter(
              (f) => form[f] && String(form[f]).trim(),
            ).length;
            const sP = Math.round((sF / s.fields.length) * 100);
            return (
              <Card key={s.id} className="overflow-hidden">
                <button
                  onClick={() => setOpen((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${sP === 100 ? "bg-green-50 text-green-600" : "bg-orange-50 text-[#ef7f1b]"}`}
                    >
                      {sP === 100 ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">
                        {s.title}
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        {sP}% complete
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100 animate-fadeInUp">
                    <div className="grid grid-cols-2 gap-4">
                      {s.fields.map((f) => (
                        <div key={f}>
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {FIELD_LABELS[f] || f.replace(/_/g, " ")}
                          </Label>
                          <Input
                            value={form[f] || ""}
                            onChange={(e) => update(f, e.target.value)}
                            className="mt-1"
                            placeholder={
                              s.id === "cost" || s.id === "payments"
                                ? "e.g. ₹5,00,000"
                                : "e.g. 3 months"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function TCDocument({ item, api, user, onBack, onEdit }) {
  const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
  const handleDownload = () => {
    if (item.document_url)
      window.open(`${BACKEND}${item.document_url}`, "_blank");
  };

  return (
    <div className="flex flex-col h-full" data-testid="timecost-document">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">
                {item.project_name}
              </h1>
              <p className="text-[11px] text-gray-400">Time & Cost Estimate</p>
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
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>
              <h2 className="text-2xl font-bold text-black mt-4">
                Time & Cost Estimate
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {item.project_name} &middot;{" "}
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-8 space-y-8">
              {SECTIONS.map((s, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                    {i + 1}. {s.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {s.fields.map((f, j) => (
                      <div key={j} className={!item[f] ? "opacity-40" : ""}>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                          {FIELD_LABELS[f] || f.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-black mt-0.5 font-medium">
                          {item[f] || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
