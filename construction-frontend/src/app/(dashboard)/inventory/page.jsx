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

import { Plus, Search, Loader2, Trash2, Package, Pencil } from "lucide-react";

import {
  useGetInventoryMasterQuery,
  useCreateInventoryMasterMutation,
  useUpdateInventoryMasterMutation,
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
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

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

  const openCreate = () => {
    setEditItem(null);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-muted/30 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory Master</h1>
          <p className="text-sm text-muted-foreground">
            Manage items, pricing & brands
          </p>
        </div>

        <Button
          onClick={openCreate}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* SEARCH */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <Card className="rounded-2xl overflow-hidden">
        <ScrollArea className="h-[65vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Package className="w-10 h-10 mb-3 opacity-40" />
              No items found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/20 border-b">
                <tr className="text-xs text-muted-foreground">
                  <th className="p-4 text-left">Code</th>
                  <th className="text-left">Item</th>
                  <th className="text-left">Brand</th>
                  <th className="text-left">Rate</th>
                  <th className="text-left">Status</th>
                  <th className="text-right pr-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-muted/40 group"
                  >
                    <td className="p-4 text-muted-foreground">
                      {item.item_code || "—"}
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

                    {/* ACTIONS */}
                    <td className="text-right pr-4 space-x-2">
                      {/* EDIT */}
                      <button
                        onClick={() => openEdit(item)}
                        className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"
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

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>

          <InventoryForm editItem={editItem} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- FORM (CREATE + UPDATE) ---------------- */

function InventoryForm({ editItem, onClose }) {
  const isEdit = !!editItem;

  const [form, setForm] = useState({
    item_code: editItem?.item_code || "",
    item_name: editItem?.item_name || "",
    description: editItem?.description || "",
    specification: editItem?.specification || "",
    default_rate: editItem?.default_rate || "",
    brand_id: editItem?.brand_id || "",
  });

  const { data: brands = [] } = useGetBrandsQuery();

  const [createInventory, { isLoading: creating }] =
    useCreateInventoryMasterMutation();

  const [updateInventory, { isLoading: updating }] =
    useUpdateInventoryMasterMutation();

  const loading = creating || updating;

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    try {
      if (!form.item_name) {
        toast.error("Item name required");
        return;
      }

      const payload = {
        ...form,
        default_rate: Number(form.default_rate || 0),
        brand_id: form.brand_id || null,
      };

      if (isEdit) {
        await updateInventory({
          id: editItem.id,
          ...payload,
        }).unwrap();

        toast.success("Item updated");
      } else {
        await createInventory(payload).unwrap();
        toast.success("Item created");
      }

      onClose();
    } catch {
      toast.error("Operation failed");
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
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isEdit ? (
          "Update Item"
        ) : (
          "Save Item"
        )}
      </Button>
    </div>
  );
}
