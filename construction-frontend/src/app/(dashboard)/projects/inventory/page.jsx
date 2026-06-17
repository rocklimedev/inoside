"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useGetProjectMaterialsQuery,
  useCreateInventoryMasterMutation,
  useUpdateInventoryMasterMutation,
  useDeleteInventoryMasterMutation,
  useGetBrandsQuery,
  useGetProjectRequestsQuery,
  useCreateInventoryRequestMutation,
  useGetProjectDispatchesQuery,
  useCreateDispatchMutation,
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

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Loader2,
  Truck,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fmt = (n) => {
  const num = Number(n);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function ProjectInventoryPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id");

  const [activeTab, setActiveTab] = useState("items");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [openForm, setOpenForm] = useState(false);
  const [openRequest, setOpenRequest] = useState(false);
  const [openDispatch, setOpenDispatch] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Queries
  const { data: items = [], isLoading: itemsLoading } =
    useGetProjectMaterialsQuery(projectId, { skip: !projectId });

  const { data: requests = [], isLoading: requestsLoading } =
    useGetProjectRequestsQuery(projectId, { skip: !projectId });

  const { data: dispatches = [], isLoading: dispatchesLoading } =
    useGetProjectDispatchesQuery(projectId, { skip: !projectId });

  const [deleteInventory] = useDeleteInventoryMasterMutation();
  const [createRequest] = useCreateInventoryRequestMutation();
  const [createDispatchMut] = useCreateDispatchMutation();

  // Filtered Items
  const filteredItems = useMemo(() => {
    let result = [...items];
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.item_name?.toLowerCase().includes(term) ||
          i.item_code?.toLowerCase().includes(term) ||
          i.inventoryMaster?.item_name?.toLowerCase().includes(term),
      );
    }
    if (filterStatus === "active") {
      result = result.filter((i) => i.inventoryMaster?.is_active);
    } else if (filterStatus === "inactive") {
      result = result.filter((i) => !i.inventoryMaster?.is_active);
    }
    return result;
  }, [items, search, filterStatus]);

  const openCreate = () => {
    setEditItem(null);
    setOpenForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setOpenForm(true);
  };

  const openRequestModal = (item) => {
    setSelectedItem(item);
    setOpenRequest(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteInventory({ id, project_id: projectId }).unwrap();
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (!projectId) {
    return (
      <div className="flex h-full items-center justify-center text-red-600">
        Project ID is required
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* HEADER */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Project Inventory</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeTab === "items" && `${filteredItems.length} items`}
              {activeTab === "requests" && `${requests.length} requests`}
              {activeTab === "dispatches" && `${dispatches.length} dispatches`}
            </p>
          </div>

          {activeTab === "items" && (
            <Button
              onClick={openCreate}
              className="bg-[#ef7f1b] hover:bg-[#d96f18]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          )}
        </div>

        {/* Search & Filter - Items only */}
        {activeTab === "items" && (
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 mx-4 md:mx-6 mt-4 bg-white">
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" /> Items
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Requests
          </TabsTrigger>
          <TabsTrigger value="dispatches" className="flex items-center gap-2">
            <Truck className="h-4 w-4" /> Dispatches
          </TabsTrigger>
        </TabsList>

        {/* ITEMS TAB */}
        <TabsContent value="items" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6">
              {itemsLoading ? (
                <div className="text-center py-20">Loading...</div>
              ) : filteredItems.length === 0 ? (
                <EmptyState message="No inventory items found" />
              ) : (
                <ItemsTable
                  items={filteredItems}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onRequest={openRequestModal}
                />
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* REQUESTS TAB */}
        <TabsContent value="requests" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6">
              {requestsLoading ? (
                <div>Loading requests...</div>
              ) : (
                <RequestsTable requests={requests} />
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* DISPATCHES TAB */}
        <TabsContent value="dispatches" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6">
              {dispatchesLoading ? (
                <div>Loading dispatches...</div>
              ) : (
                <DispatchesTable dispatches={dispatches} />
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-md">
          <InventoryForm
            editItem={editItem}
            projectId={projectId}
            onClose={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

      <RequestModal
        open={openRequest}
        onClose={() => setOpenRequest(false)}
        item={selectedItem}
        projectId={projectId}
        createRequest={createRequest}
      />

      {/* You can add Dispatch Modal similarly */}
    </div>
  );
}

/* ====================== TABLES ====================== */

function ItemsTable({ items, onEdit, onDelete, onRequest }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Specification</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Est. Qty</TableHead>
            <TableHead className="text-right">Required</TableHead>
            <TableHead className="text-right">Received</TableHead>
            <TableHead className="text-right">Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const master = item.inventoryMaster || item;
            return (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-mono">
                  {item.item_code || master.item_code}
                </TableCell>
                <TableCell className="font-medium">
                  {item.item_name || master.item_name}
                </TableCell>
                <TableCell>
                  {item.brand?.name || master.brand?.name || "—"}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {item.specification || master.specification || "—"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {fmt(item.rate || master.default_rate)}
                </TableCell>
                <TableCell className="text-right">
                  {Number(item.quantity_estimated || 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {Number(item.quantity_required || 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {Number(item.quantity_received || 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-orange-600">
                  {Number(item.quantity_used || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={master.is_active ? "default" : "secondary"}>
                    {master.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRequest(item)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

function RequestsTable({ requests }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Requested Qty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell className="font-mono">
                {req.request_code || req.id}
              </TableCell>
              <TableCell>
                {req.inventoryMaster?.item_name || req.item_name}
              </TableCell>
              <TableCell>{req.quantity_requested}</TableCell>
              <TableCell>
                <Badge
                  variant={req.status === "approved" ? "default" : "secondary"}
                >
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(req.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function DispatchesTable({ dispatches }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dispatch ID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispatches.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-mono">
                {d.dispatch_code || d.id}
              </TableCell>
              <TableCell>{d.item_name}</TableCell>
              <TableCell>{d.quantity}</TableCell>
              <TableCell>{d.vehicle_number || "—"}</TableCell>
              <TableCell>
                {new Date(d.dispatched_at || d.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-20 text-gray-500">
      <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
      <p>{message}</p>
    </div>
  );
}

/* ====================== REQUEST MODAL ====================== */
function RequestModal({ open, onClose, item, projectId, createRequest }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!quantity || !item) return;
    setLoading(true);
    try {
      await createRequest({
        project_id: projectId,
        inventory_master_id: item.inventoryMaster?.id || item.id,
        quantity_requested: Number(quantity),
        request_type: "project",
      }).unwrap();
      toast.success("Request created successfully");
      onClose();
      setQuantity("");
    } catch {
      toast.error("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Request {item?.item_name}</DialogTitle>
        <div className="space-y-4 py-4">
          <Input
            type="number"
            placeholder="Quantity to request"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#ef7f1b]"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Keep your existing InventoryForm component */
/* ====================== INVENTORY FORM ====================== */
function InventoryForm({ editItem, projectId, onClose }) {
  const isEdit = !!editItem;

  const [form, setForm] = useState({
    item_code:
      editItem?.item_code || editItem?.inventoryMaster?.item_code || "",
    item_name:
      editItem?.item_name || editItem?.inventoryMaster?.item_name || "",
    description:
      editItem?.description || editItem?.inventoryMaster?.description || "",
    specification:
      editItem?.specification || editItem?.inventoryMaster?.specification || "",
    default_rate:
      editItem?.rate || editItem?.inventoryMaster?.default_rate || "",
    brand_id: editItem?.brand_id || editItem?.inventoryMaster?.brand_id || "",
  });

  const { data: brands = [] } = useGetBrandsQuery();
  const [createInventory, { isLoading: creating }] =
    useCreateInventoryMasterMutation();
  const [updateInventory, { isLoading: updating }] =
    useUpdateInventoryMasterMutation();

  const loading = creating || updating;

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.item_name?.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      const payload = {
        ...form,
        default_rate: Number(form.default_rate || 0),
        brand_id: form.brand_id || null,
        project_id: projectId,
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
      toast.error("Operation failed. Please try again.");
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
        value={form.brand_id || "none"}
        onValueChange={(v) => update("brand_id", v === "none" ? "" : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Brand</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b.id} value={String(b.id)}>
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
