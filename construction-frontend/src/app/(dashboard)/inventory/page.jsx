"use client";

import React, { useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";

import { Plus, Search, Loader2, Trash2, Package } from "lucide-react";

import {
  useGetInventoryMasterQuery,
  useCreateInventoryMasterMutation,
  useDeleteInventoryMasterMutation,
  useGetBrandsQuery,
} from "@/api/inventoryApi";

/* ---------------- FORMAT ---------------- */

const fmt = (n) => {
  const num = Number(n);
  if (!num && num !== 0) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

/* ---------------- PAGE ---------------- */

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const { data: items = [], isLoading } = useGetInventoryMasterQuery();
  const [deleteInventory] = useDeleteInventoryMasterMutation();

  const handleDelete = async (id) => {
    try {
      await deleteInventory(id).unwrap();
      toast.success("Item deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = items.filter((i) =>
    search ? i.item_name?.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Inventory Master</h1>
          <p className="text-xs text-muted-foreground">
            Manage all inventory items
          </p>
        </div>

        <Button
          onClick={() => setShowAdd(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search inventory items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE CARD */}
      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Package className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">No items found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/40 backdrop-blur">
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-left p-3">Code</th>
                  <th className="text-left">Item</th>
                  <th className="text-left">Brand</th>
                  <th className="text-left">Rate</th>
                  <th className="text-left">Status</th>
                  <th className="text-right pr-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="
                      border-b
                      hover:bg-muted/40
                      transition
                    "
                  >
                    <td className="p-3 text-muted-foreground">
                      {item.item_code}
                    </td>

                    <td className="font-medium">{item.item_name}</td>

                    <td className="text-muted-foreground">
                      {item.brand?.name || "—"}
                    </td>

                    <td>{fmt(item.default_rate)}</td>

                    <td>
                      <Badge
                        className={
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    <td className="text-right pr-3">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="
                          text-muted-foreground
                          hover:text-red-500
                          transition
                        "
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ScrollArea>
      </Card>

      {/* ADD MODAL */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>

          <AddInventoryForm onClose={() => setShowAdd(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- FORM ---------------- */

function AddInventoryForm({ onClose }) {
  const [form, setForm] = useState({
    item_code: "",
    item_name: "",
    description: "",
    specification: "",
    default_rate: "",
    brand_id: "",
  });

  const { data: brands = [] } = useGetBrandsQuery();
  const [createInventory, { isLoading }] = useCreateInventoryMasterMutation();

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.item_name) {
      toast.error("Item name required");
      return;
    }

    try {
      await createInventory({
        ...form,
        default_rate: Number(form.default_rate || 0),
        brand_id: form.brand_id || null,
      }).unwrap();

      toast.success("Item created");
      onClose();
    } catch {
      toast.error("Create failed");
    }
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Item Code"
        value={form.item_code}
        onChange={(e) => update("item_code", e.target.value)}
      />

      <Input
        placeholder="Item Name"
        value={form.item_name}
        onChange={(e) => update("item_name", e.target.value)}
      />

      <select
        className="w-full border rounded-md p-2 text-sm"
        value={form.brand_id}
        onChange={(e) => update("brand_id", e.target.value)}
      >
        <option value="">Select Brand</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <Input
        placeholder="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <Input
        placeholder="Specification"
        value={form.specification}
        onChange={(e) => update("specification", e.target.value)}
      />

      <Input
        type="number"
        placeholder="Default Rate"
        value={form.default_rate}
        onChange={(e) => update("default_rate", e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Item"}
      </Button>
    </div>
  );
}
