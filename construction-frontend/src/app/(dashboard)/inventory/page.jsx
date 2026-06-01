"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  useGetInventoryMasterQuery,
  useCreateInventoryMasterMutation,
  useUpdateInventoryMasterMutation,
  useDeleteInventoryMasterMutation,
  useGetBrandsQuery,
} from "@/api/inventoryApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
  Loader2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fmt = (n) => {
  const num = Number(n);
  if (!num && num !== 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { data: items = [], isLoading } = useGetInventoryMasterQuery();
  const [deleteInventory] = useDeleteInventoryMasterMutation();

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((i) => i.item_name?.toLowerCase().includes(term));
    }

    if (filterStatus === "active") {
      result = result.filter((i) => i.is_active);
    } else if (filterStatus === "inactive") {
      result = result.filter((i) => !i.is_active);
    }

    return result;
  }, [items, search, filterStatus]);

  const openCreate = () => {
    setEditItem(null);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteInventory(id).unwrap();
      toast.success("Item deleted successfully");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* HEADER */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Inventory Master</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredItems.length} items
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-[#ef7f1b] text-white" : "text-gray-500"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-[#ef7f1b] text-white" : "text-gray-500"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={openCreate}
              className="bg-[#ef7f1b] hover:bg-[#d96f18]"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
              No items found
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl text-[#ef7f1b] font-bold">
                      {item.item_code?.[0] || "I"}
                    </div>

                    <Badge
                      className={
                        item.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg truncate">
                    {item.item_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.brand?.name || "No Brand"}
                  </p>

                  <div className="mt-6">
                    <p className="text-xs text-gray-400">Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {fmt(item.default_rate)}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(item)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => openEdit(item)}
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl text-[#ef7f1b] font-bold">
                    {item.item_code?.[0] || "I"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{item.item_name}</p>
                    <p className="text-sm text-gray-500">
                      {item.brand?.name || "No Brand"} • {item.item_code || "—"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{fmt(item.default_rate)}</p>
                    <Badge
                      className={
                        item.is_active
                          ? "bg-green-100 text-green-700 text-xs"
                          : "bg-red-100 text-red-700 text-xs"
                      }
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(item)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* FORM DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <InventoryForm editItem={editItem} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================= INVENTORY FORM ================= */
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

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.item_name) {
      toast.error("Item name is required");
      return;
    }

    try {
      const payload = {
        ...form,
        default_rate: Number(form.default_rate || 0),
        brand_id: form.brand_id || null,
      };

      if (isEdit) {
        await updateInventory({ id: editItem.id, ...payload }).unwrap();
        toast.success("Item updated successfully");
      } else {
        await createInventory(payload).unwrap();
        toast.success("Item created successfully");
      }
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-4 py-2">
      <Input
        placeholder="Item Code"
        value={form.item_code}
        onChange={(e) => update("item_code", e.target.value)}
      />

      <Input
        placeholder="Item Name *"
        value={form.item_name}
        onChange={(e) => update("item_name", e.target.value)}
      />

      <Select
        value={form.brand_id}
        onValueChange={(v) => update("brand_id", v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">No Brand</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
        placeholder="Default Rate (₹)"
        value={form.default_rate}
        onChange={(e) => update("default_rate", e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#ef7f1b] hover:bg-[#d96f18] h-11"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : isEdit ? (
          "Update Item"
        ) : (
          "Create Item"
        )}
      </Button>
    </div>
  );
}
