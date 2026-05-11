import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import {
  Plus,
  FileText,
  Save,
  Download,
  ArrowLeft,
  Loader2,
  Edit3,
  Trash2,
  Calculator,
  X,
} from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const CATEGORIES = [
  "Civil",
  "Electrical",
  "Plumbing",
  "Furniture",
  "Fixtures",
  "Finishes",
  "Other",
];
const UNITS = ["sqft", "sqm", "nos", "rft", "kg", "cum", "bag", "lot", "set"];
const STATUS_MAP = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Document Ready", color: "bg-blue-50 text-blue-600" },
  approved: { label: "Approved", color: "bg-green-50 text-green-600" },
};

const fmt = (n) => {
  const num = Number(n);
  if (!num && num !== 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function BOQPage() {
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
      const r = await api.get("/boqs");
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
      const r = await api.post("/boqs", { project_name: newName, items: [] });
      setItems((p) => [...p, r.data]);
      setActive(r.data);
      setMode("editor");
      setShowNew(false);
      setNewName("");
      toast.success("Created");
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/boqs/${id}`);
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
          : "editor",
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  if (mode === "editor" && active)
    return (
      <BOQEditor
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
      <BOQDocument
        item={active}
        api={api}
        user={user}
        onBack={() => {
          setMode("list");
          fetchData();
        }}
        onEdit={() => setMode("editor")}
      />
    );

  return (
    <div className="flex flex-col h-full" data-testid="boq-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="boq-title"
            >
              BOQ
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Bill of Quantities &middot; {items.length} document
              {items.length !== 1 ? "s" : ""}
            </p>
          </div>
          {user?.role !== "Client" && (
            <Button
              onClick={() => setShowNew(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
              data-testid="new-boq-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> New BOQ
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <Calculator className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No BOQ documents yet.</p>
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
                    data-testid={`boq-card-${i}`}
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
                      {(item.items || []).length} items &middot;{" "}
                      {item.final_cost ? fmt(item.final_cost) : "No estimate"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
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
            <DialogTitle>New BOQ</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Project Name *
            </Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1"
              data-testid="new-boq-name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              data-testid="new-boq-submit"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BOQEditor({ item, api, onBack, onGenerated }) {
  const [rows, setRows] = useState(item.items || []);
  const [taxes, setTaxes] = useState(item.taxes || 0);
  const [additionalCosts, setAdditionalCosts] = useState(
    item.additional_costs || 0,
  );
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const addRow = () =>
    setRows((p) => [
      ...p,
      {
        id: Date.now(),
        category: "Civil",
        material: "",
        quantity: 0,
        unit: "sqft",
        unit_cost: 0,
        total_cost: 0,
      },
    ]);

  const updateRow = (idx, key, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };
      if (key === "quantity" || key === "unit_cost") {
        const qty =
          key === "quantity" ? Number(value) : Number(updated[idx].quantity);
        const uc =
          key === "unit_cost" ? Number(value) : Number(updated[idx].unit_cost);
        updated[idx].total_cost = qty * uc;
      }
      return updated;
    });
  };

  const removeRow = (idx) => setRows((p) => p.filter((_, i) => i !== idx));

  const subtotal = rows.reduce((s, r) => s + (Number(r.total_cost) || 0), 0);
  const finalCost = subtotal + Number(taxes) + Number(additionalCosts);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/boqs/${item.id}`, {
        items: rows,
        subtotal,
        taxes: Number(taxes),
        additional_costs: Number(additionalCosts),
        final_cost: finalCost,
      });
      toast.success("Saved");
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      await api.put(`/boqs/${item.id}`, {
        items: rows,
        subtotal,
        taxes: Number(taxes),
        additional_costs: Number(additionalCosts),
        final_cost: finalCost,
      });
      await api.post(`/boqs/${item.id}/generate`);
      const u = await api.get(`/boqs/${item.id}`);
      toast.success("Document generated");
      onGenerated(u.data);
    } catch {
      toast.error("Failed");
    } finally {
      setGenerating(false);
    }
  };

  // Category-wise summary
  const catSummary = {};
  rows.forEach((r) => {
    catSummary[r.category] =
      (catSummary[r.category] || 0) + (Number(r.total_cost) || 0);
  });

  return (
    <div className="flex flex-col h-full" data-testid="boq-editor">
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
              <p className="text-[11px] text-gray-400">Module: BOQ</p>
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
                <Save className="w-3.5 h-3.5 mr-1" />
              )}{" "}
              Save
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
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {/* Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="boq-table">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                    <th className="py-3 px-3 text-left font-bold w-8">#</th>
                    <th className="py-3 px-3 text-left font-bold">Category</th>
                    <th className="py-3 px-3 text-left font-bold">Material</th>
                    <th className="py-3 px-3 text-right font-bold w-20">Qty</th>
                    <th className="py-3 px-3 text-left font-bold w-20">Unit</th>
                    <th className="py-3 px-3 text-right font-bold w-28">
                      Unit Cost
                    </th>
                    <th className="py-3 px-3 text-right font-bold w-28">
                      Total
                    </th>
                    <th className="py-3 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                      data-testid={`boq-row-${idx}`}
                    >
                      <td className="py-2 px-3 text-gray-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3">
                        <Select
                          value={row.category}
                          onValueChange={(v) => updateRow(idx, "category", v)}
                        >
                          <SelectTrigger className="h-8 text-xs border-0 bg-transparent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          value={row.material}
                          onChange={(e) =>
                            updateRow(idx, "material", e.target.value)
                          }
                          className="h-8 text-xs border-0 bg-transparent"
                          placeholder="Material name"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={row.quantity || ""}
                          onChange={(e) =>
                            updateRow(idx, "quantity", e.target.value)
                          }
                          className="h-8 text-xs border-0 bg-transparent text-right"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Select
                          value={row.unit}
                          onValueChange={(v) => updateRow(idx, "unit", v)}
                        >
                          <SelectTrigger className="h-8 text-xs border-0 bg-transparent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {UNITS.map((u) => (
                              <SelectItem key={u} value={u}>
                                {u}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={row.unit_cost || ""}
                          onChange={(e) =>
                            updateRow(idx, "unit_cost", e.target.value)
                          }
                          className="h-8 text-xs border-0 bg-transparent text-right"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-xs">
                        {fmt(row.total_cost)}
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => removeRow(idx)}
                          className="text-gray-300 hover:text-[#e31d3b]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={addRow}
                data-testid="boq-add-row"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
              </Button>
            </div>
          </Card>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Category breakdown */}
            <Card className="p-4" data-testid="boq-category-summary">
              <h3 className="text-sm font-bold text-black mb-3">
                Category Summary
              </h3>
              <div className="space-y-2">
                {Object.entries(catSummary).map(([cat, total]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{cat}</span>
                    <span className="text-xs font-medium text-black">
                      {fmt(total)}
                    </span>
                  </div>
                ))}
                {Object.keys(catSummary).length === 0 && (
                  <p className="text-xs text-gray-400">
                    Add items to see breakdown
                  </p>
                )}
              </div>
            </Card>

            {/* Cost summary */}
            <Card className="p-4" data-testid="boq-cost-summary">
              <h3 className="text-sm font-bold text-black mb-3">
                Cost Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-black">
                    {fmt(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Taxes</Label>
                  <Input
                    type="number"
                    value={taxes || ""}
                    onChange={(e) => setTaxes(e.target.value)}
                    className="w-32 h-8 text-xs text-right"
                    data-testid="boq-taxes-input"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">
                    Additional Costs
                  </Label>
                  <Input
                    type="number"
                    value={additionalCosts || ""}
                    onChange={(e) => setAdditionalCosts(e.target.value)}
                    className="w-32 h-8 text-xs text-right"
                    data-testid="boq-additional-input"
                  />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm font-bold text-black">
                    Final Project Cost
                  </span>
                  <span
                    className="text-lg font-black text-[#ef7f1b]"
                    data-testid="boq-final-cost"
                  >
                    {fmt(finalCost)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function BOQDocument({ item, api, user, onBack, onEdit }) {
  const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
  const handleDownload = () => {
    if (item.document_url)
      window.open(`${BACKEND}${item.document_url}`, "_blank");
  };
  const handleApprove = async () => {
    try {
      await api.post(`/boqs/${item.id}/approve`);
      toast.success("Approved");
    } catch {
      toast.error("Failed");
    }
  };

  const catSummary = {};
  (item.items || []).forEach((r) => {
    catSummary[r.category] =
      (catSummary[r.category] || 0) + (Number(r.total_cost) || 0);
  });

  return (
    <div className="flex flex-col h-full" data-testid="boq-document">
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
              <p className="text-[11px] text-gray-400">Bill of Quantities</p>
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
            {user?.role === "Client" && item.status !== "approved" && (
              <Button
                size="sm"
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>
              <h2 className="text-2xl font-bold text-black mt-4">
                Bill of Quantities
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {item.project_name} &middot;{" "}
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                Itemized Cost Table
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="py-2 px-3 text-left">#</th>
                      <th className="py-2 px-3 text-left">Category</th>
                      <th className="py-2 px-3 text-left">Material</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                      <th className="py-2 px-3 text-left">Unit</th>
                      <th className="py-2 px-3 text-right">Unit Cost</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(item.items || []).map((r, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                        <td className="py-2 px-3">{r.category}</td>
                        <td className="py-2 px-3">{r.material}</td>
                        <td className="py-2 px-3 text-right">{r.quantity}</td>
                        <td className="py-2 px-3">{r.unit}</td>
                        <td className="py-2 px-3 text-right">
                          {fmt(r.unit_cost)}
                        </td>
                        <td className="py-2 px-3 text-right font-medium">
                          {fmt(r.total_cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-3">
                    Category Summary
                  </h3>
                  {Object.entries(catSummary).map(([cat, total]) => (
                    <div
                      key={cat}
                      className="flex justify-between py-1 border-b border-gray-100"
                    >
                      <span className="text-xs text-gray-600">{cat}</span>
                      <span className="text-xs font-medium">{fmt(total)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-3">
                    Cost Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Subtotal</span>
                      <span className="text-xs font-medium">
                        {fmt(item.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Taxes</span>
                      <span className="text-xs font-medium">
                        {fmt(item.taxes)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">
                        Additional Costs
                      </span>
                      <span className="text-xs font-medium">
                        {fmt(item.additional_costs)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm font-bold">
                        Final Project Cost
                      </span>
                      <span className="text-lg font-black text-[#ef7f1b]">
                        {fmt(item.final_cost)}
                      </span>
                    </div>
                  </div>
                </div>
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
