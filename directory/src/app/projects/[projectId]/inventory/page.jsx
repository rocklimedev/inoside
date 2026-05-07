"use client";

import React, { useMemo, useState } from "react";

import { useParams } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

import { useGetProjectByIdQuery } from "@/api/projectApi";

import {
  useGetInventoryByProjectQuery,
  useCreateInventoryMutation,
  useDeleteInventoryMutation,
} from "@/api/inventoryApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Loader2,
  Plus,
  Trash2,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  IndianRupee,
} from "lucide-react";

import { toast } from "sonner";

// ======================================================
// CONSTANTS
// ======================================================

const CATEGORIES = [
  "Civil",
  "Electrical",
  "Plumbing",
  "Furniture",
  "Fixtures",
  "Finishes",
  "Hardware",
  "Tools",
  "Other",
];

const UNITS = [
  "nos",
  "pcs",
  "box",
  "bag",
  "kg",
  "ltr",
  "sqm",
  "sqft",
  "rft",
  "set",
];

const TRANSACTION_TYPES = ["IN", "OUT"];

const fmt = (n) => {
  const num = Number(n || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (date) => {
  if (!date || date === "0000-00-00") return "—";

  const d = new Date(date);

  if (isNaN(d)) return "—";

  return d.toLocaleDateString("en-IN");
};

// ======================================================
// PAGE
// ======================================================

export default function InventoryPage() {
  const { projectId } = useParams();

  const { user } = useAuth();

  return <InventoryWorkspace projectId={projectId} user={user} />;
}

// ======================================================
// WORKSPACE
// ======================================================

function InventoryWorkspace({ projectId, user }) {
  const [showAdd, setShowAdd] = useState(false);

  const [activeTab, setActiveTab] = useState("ledger");

  const { data: project, isLoading: projectLoading } =
    useGetProjectByIdQuery(projectId);

  const { data: inventoryResponse, isLoading: inventoryLoading } =
    useGetInventoryByProjectQuery(projectId);

  const [createInventory] = useCreateInventoryMutation();

  const [deleteInventory] = useDeleteInventoryMutation();

  const inventoryItems =
    inventoryResponse?.inventories || inventoryResponse || [];

  // ======================================================
  // GROUP & CALCULATE STOCK
  // ======================================================

  const stockLedger = useMemo(() => {
    const grouped = {};

    inventoryItems.forEach((item) => {
      const key = item.item_name?.trim()?.toUpperCase();

      if (!key) return;

      if (!grouped[key]) {
        grouped[key] = {
          item_name: item.item_name,
          total_in: 0,
          total_out: 0,
          balance: 0,
          transactions: [],
          vendors: new Set(),
          receivers: new Set(),
        };
      }

      const qty = Number(item.quantity || 0);

      if (item.in) {
        grouped[key].total_in += qty;

        grouped[key].vendors.add(item.in);
      }

      if (item.out) {
        grouped[key].total_out += qty;

        grouped[key].receivers.add(item.receiver_name || item.out);
      }

      // if no in/out, assume incoming stock
      if (!item.in && !item.out) {
        grouped[key].total_in += qty;
      }

      grouped[key].transactions.push(item);

      grouped[key].balance = grouped[key].total_in - grouped[key].total_out;
    });

    return Object.values(grouped).sort((a, b) =>
      a.item_name.localeCompare(b.item_name),
    );
  }, [inventoryItems]);

  // ======================================================
  // SUMMARY
  // ======================================================

  const summary = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    let totalBalance = 0;

    stockLedger.forEach((i) => {
      totalIn += i.total_in;
      totalOut += i.total_out;
      totalBalance += i.balance;
    });

    return {
      totalItems: stockLedger.length,
      totalIn,
      totalOut,
      totalBalance,
    };
  }, [stockLedger]);

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id) => {
    try {
      await deleteInventory(id).unwrap();

      toast.success("Inventory entry deleted");
    } catch (err) {
      toast.error("Failed to delete entry");
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (projectLoading || !project) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* HEADER */}

      <div className="border-b bg-white px-4 md:px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-black">{project.name}</h1>

            <p className="text-xs text-gray-400 mt-1">
              Project Inventory Management
            </p>
          </div>

          {user?.role !== "Client" && (
            <Button
              onClick={() => setShowAdd(true)}
              className="bg-[#ef7f1b] hover:bg-[#d56d16] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          )}
        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <SummaryCard
            title="Materials"
            value={summary.totalItems}
            icon={Boxes}
          />

          <SummaryCard
            title="Stock In"
            value={summary.totalIn}
            icon={ArrowDownCircle}
          />

          <SummaryCard
            title="Stock Out"
            value={summary.totalOut}
            icon={ArrowUpCircle}
          />

          <SummaryCard
            title="Balance"
            value={summary.totalBalance}
            icon={Package}
          />
        </div>
      </div>

      {/* TABS */}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="m-4 w-fit bg-gray-100">
          <TabsTrigger value="ledger">Material Ledger</TabsTrigger>

          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* ====================================================== */}
        {/* LEDGER */}
        {/* ====================================================== */}

        <TabsContent value="ledger" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {inventoryLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
                </div>
              ) : stockLedger.length === 0 ? (
                <EmptyState />
              ) : (
                <Card className="overflow-hidden border-0 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                          <th className="px-4 py-3 text-left font-bold">
                            Material
                          </th>

                          <th className="px-4 py-3 text-right font-bold">In</th>

                          <th className="px-4 py-3 text-right font-bold">
                            Out
                          </th>

                          <th className="px-4 py-3 text-right font-bold">
                            Balance
                          </th>

                          <th className="px-4 py-3 text-left font-bold">
                            Vendors
                          </th>

                          <th className="px-4 py-3 text-left font-bold">
                            Receivers
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {stockLedger.map((item, idx) => (
                          <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-black text-xs">
                                {item.item_name}
                              </div>

                              <div className="text-[10px] text-gray-400 mt-1">
                                {item.transactions.length} transactions
                              </div>
                            </td>

                            <td className="px-4 py-3 text-right text-xs font-medium text-green-600">
                              {item.total_in}
                            </td>

                            <td className="px-4 py-3 text-right text-xs font-medium text-red-500">
                              {item.total_out}
                            </td>

                            <td className="px-4 py-3 text-right">
                              <Badge className="bg-[#ef7f1b]/10 text-[#ef7f1b] border-0">
                                {item.balance}
                              </Badge>
                            </td>

                            <td className="px-4 py-3 text-xs text-gray-600">
                              {[...item.vendors].join(", ") || "—"}
                            </td>

                            <td className="px-4 py-3 text-xs text-gray-600">
                              {[...item.receivers].join(", ") || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ====================================================== */}
        {/* TRANSACTIONS */}
        {/* ====================================================== */}

        <TabsContent
          value="transactions"
          className="flex-1 overflow-hidden m-0"
        >
          <ScrollArea className="h-full">
            <div className="p-4">
              {inventoryItems.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-3">
                  {inventoryItems.map((item) => {
                    const isIn = !!item.in || !item.out;

                    return (
                      <Card key={item.id} className="p-4 border-0 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-black">
                                {item.item_name}
                              </h3>

                              <Badge
                                className={
                                  isIn
                                    ? "bg-green-50 text-green-700 border-0"
                                    : "bg-red-50 text-red-600 border-0"
                                }
                              >
                                {isIn ? "IN" : "OUT"}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-4 gap-3 mt-4">
                              <Info label="Quantity" value={item.quantity} />

                              <Info
                                label="Date"
                                value={formatDate(item.date_added)}
                              />

                              <Info
                                label="Vendor / Source"
                                value={item.in || "—"}
                              />

                              <Info
                                label="Receiver / Site"
                                value={item.receiver_name || item.out || "—"}
                              />
                            </div>

                            {item.remarks && (
                              <div className="mt-3 text-xs text-gray-500">
                                {item.remarks}
                              </div>
                            )}
                          </div>

                          {user?.role !== "Client" && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-gray-300 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* ====================================================== */}
      {/* ADD DIALOG */}
      {/* ====================================================== */}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Inventory Entry</DialogTitle>
          </DialogHeader>

          <AddInventoryForm
            projectId={projectId}
            projectName={project.name}
            createInventory={createInventory}
            onSuccess={() => {
              setShowAdd(false);

              toast.success("Inventory added successfully");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <Card className="p-4 border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
            {title}
          </p>

          <h3 className="text-xl font-black text-black mt-2">{value}</h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#ef7f1b]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#ef7f1b]" />
        </div>
      </div>
    </Card>
  );
}

// ======================================================
// INFO
// ======================================================

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
        {label}
      </p>

      <p className="text-xs font-medium text-black mt-1">{value || "—"}</p>
    </div>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState() {
  return (
    <div className="py-20 text-center">
      <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />

      <h3 className="text-sm font-semibold text-black">
        No inventory records found
      </h3>

      <p className="text-xs text-gray-400 mt-1">
        Add inventory transactions to track stock movement
      </p>
    </div>
  );
}

// ======================================================
// ADD FORM
// ======================================================

function AddInventoryForm({
  projectId,
  projectName,
  createInventory,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    item_name: "",
    quantity: "",
    transaction_type: "IN",
    in: "",
    out: "",
    receiver_name: "",
    remarks: "",
    category: "Other",
    unit: "nos",
  });

  const u = (k, v) => {
    setForm((p) => ({
      ...p,
      [k]: v,
    }));
  };

  const handleSubmit = async () => {
    if (!form.item_name.trim()) {
      toast.error("Item name required");
      return;
    }

    if (!form.quantity) {
      toast.error("Quantity required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        projectId,
        project_name: projectName,
        item_name: form.item_name,
        quantity: Number(form.quantity),
        receiver_name: form.receiver_name,
        remarks: form.remarks,
        date_added: new Date(),

        in: form.transaction_type === "IN" ? form.in : null,

        out: form.transaction_type === "OUT" ? projectName : null,
      };

      await createInventory(payload).unwrap();

      onSuccess();
    } catch (err) {
      console.log(err);

      toast.error("Failed to save inventory");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Item Name
          </Label>

          <Input
            value={form.item_name}
            onChange={(e) => u("item_name", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Quantity
          </Label>

          <Input
            type="number"
            value={form.quantity}
            onChange={(e) => u("quantity", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Transaction Type
          </Label>

          <Select
            value={form.transaction_type}
            onValueChange={(v) => u("transaction_type", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {TRANSACTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Receiver Name
          </Label>

          <Input
            value={form.receiver_name}
            onChange={(e) => u("receiver_name", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {form.transaction_type === "IN" && (
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Vendor / Source
          </Label>

          <Input
            value={form.in}
            onChange={(e) => u("in", e.target.value)}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
          Remarks
        </Label>

        <Input
          value={form.remarks}
          onChange={(e) => u("remarks", e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex justify-end">
        <Button
          disabled={saving}
          onClick={handleSubmit}
          className="bg-[#ef7f1b] hover:bg-[#d56d16] text-white"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Save Entry
        </Button>
      </div>
    </div>
  );
}
