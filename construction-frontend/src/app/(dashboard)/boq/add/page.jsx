"use client";

import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";

import { Plus, Save, Trash2, Search } from "lucide-react";

import { AgGridReact } from "ag-grid-react";

import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ================= API =================

import {
  useCreateBoqMutation,
  useGetBoqByIdQuery,
  useGetBoqCategoriesQuery,
  useCreateSectionMutation,
  useCreateSubHeadingMutation,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useUpdateBoqMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useUpdateSubHeadingMutation,
  useDeleteSubHeadingMutation,
} from "@/api/boqApi";

import {
  useGetInventoryMasterQuery,
  useGetUnitsQuery,
} from "@/api/inventoryApi";

import { useGetClientsQuery, useCreateClientMutation } from "@/api/clientsApi";

import ClientForm from "@/components/client/ClientForm";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function CreateBOQPage() {
  const gridRef = useRef(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const urlBoqId = searchParams.get("boqId");

  // ================= STATE =================

  const [boqId, setBoqId] = useState(null);

  const [boqTitle, setBoqTitle] = useState("");

  const [selectedClientId, setSelectedClientId] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [clientModalOpen, setClientModalOpen] = useState(false);

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);

  const [currentRowId, setCurrentRowId] = useState(null);

  const [inventorySearch, setInventorySearch] = useState("");

  const [deletedRows, setDeletedRows] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  // ================= API =================

  const { data: clients = [] } = useGetClientsQuery();

  const { data: categories = [] } = useGetBoqCategoriesQuery();

  const { data: inventoryMaster = [] } = useGetInventoryMasterQuery({});

  const { data: units = [] } = useGetUnitsQuery({});

  const [createBoq] = useCreateBoqMutation();

  const [updateBoq] = useUpdateBoqMutation();

  const [createSection] = useCreateSectionMutation();

  const [updateSection] = useUpdateSectionMutation();

  const [deleteSection] = useDeleteSectionMutation();

  const [createSubHeading] = useCreateSubHeadingMutation();

  const [updateSubHeading] = useUpdateSubHeadingMutation();

  const [deleteSubHeading] = useDeleteSubHeadingMutation();

  const [createItem] = useCreateItemMutation();

  const [updateItem] = useUpdateItemMutation();

  const [deleteItem] = useDeleteItemMutation();

  const [createClient] = useCreateClientMutation();

  // ================= DATA =================

  const [rowData, setRowData] = useState([]);

  // ================= EDIT MODE =================

  const isEditMode = !!urlBoqId;

  useEffect(() => {
    if (urlBoqId) {
      setBoqId(urlBoqId);
    }
  }, [urlBoqId]);

  // ================= LOAD BOQ =================

  const { data: boqData } = useGetBoqByIdQuery(boqId, {
    skip: !boqId,
  });

  useEffect(() => {
    if (!boqData?.sections) return;

    const flattened = [];

    boqData.sections.forEach((section) => {
      flattened.push({
        id: section.id,

        type: "Heading",

        description: section.title,

        dbType: "section",

        isNew: false,
      });

      section.subheadings?.forEach((sub) => {
        flattened.push({
          id: sub.id,

          type: "Subheading",

          description: sub.title,

          section_id: section.id,

          dbType: "subheading",

          isNew: false,
        });

        sub.items?.forEach((item) => {
          flattened.push({
            id: item.id,

            type: "Item",

            description: item.item_name,

            scope: item.specification,

            quantity: item.qty,

            rate: item.rate,

            remarks: item.remarks,

            inventory_master_id: item.inventory_master_id,

            unit: item.unit?.short_name || "",

            unit_id: item.unit_id,

            section_id: section.id,

            subheading_id: sub.id,

            dbType: "item",

            isNew: false,
          });
        });
      });
    });

    setRowData(flattened);

    setBoqTitle(boqData.title || "");

    setSelectedClientId(boqData.client_id || "");

    setCategoryId(boqData.boq_category_id || "");
  }, [boqData]);

  // ================= HELPERS =================

  const unitOptions = useMemo(() => {
    return units.map((u) => ({
      label: u.short_name || u.name,
      value: u.id,
    }));
  }, [units]);

  const totalAmount = useMemo(() => {
    return rowData.reduce((sum, row) => {
      if (row.type !== "Item") return sum;

      return sum + Number(row.quantity || 0) * Number(row.rate || 0);
    }, 0);
  }, [rowData]);

  const filteredInventory = useMemo(() => {
    return inventoryMaster.filter((item) =>
      item.item_name?.toLowerCase().includes(inventorySearch.toLowerCase()),
    );
  }, [inventoryMaster, inventorySearch]);

  // ================= GRID =================

  const columnDefs = useMemo(
    () => [
      {
        field: "drag",

        headerName: "",

        width: 50,

        rowDrag: true,

        editable: false,

        cellRenderer: () => (
          <div className="flex items-center justify-center h-full">⋮⋮</div>
        ),
      },

      {
        field: "type",

        headerName: "Type",

        width: 140,

        editable: true,

        cellEditor: "agSelectCellEditor",

        cellEditorParams: {
          values: ["Heading", "Subheading", "Item"],
        },
      },

      {
        field: "description",

        headerName: "Description / Item",

        flex: 3,

        minWidth: 350,

        editable: true,

        cellRenderer: (params) => {
          if (params.data?.type !== "Item") {
            return (
              <div className="font-semibold h-full flex items-center">
                {params.value}
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2 h-full">
              <span className="flex-1 truncate">{params.value || "—"}</span>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();

                  setCurrentRowId(params.data.id);

                  setInventorySearch("");

                  setInventoryModalOpen(true);
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          );
        },

        cellStyle: (params) => {
          if (params.data?.type === "Heading") {
            return {
              fontWeight: 700,
              background: "#f1f5f9",
            };
          }

          if (params.data?.type === "Subheading") {
            return {
              fontWeight: 600,
              background: "#f8fafc",
            };
          }

          return {};
        },
      },

      {
        field: "scope",

        headerName: "Specification",

        flex: 2,

        editable: (p) => p.data?.type === "Item",
      },

      {
        field: "unit",

        headerName: "Unit",

        width: 100,

        editable: false,
      },

      {
        field: "quantity",

        headerName: "Qty",

        width: 120,

        editable: (p) => p.data?.type === "Item",

        valueParser: (p) => Number(p.newValue || 0),
      },

      {
        field: "rate",

        headerName: "Rate",

        width: 140,

        editable: (p) => p.data?.type === "Item",

        valueParser: (p) => Number(p.newValue || 0),
      },

      {
        field: "amount",

        headerName: "Amount",

        width: 160,

        valueGetter: (p) => {
          return Number(p.data?.quantity || 0) * Number(p.data?.rate || 0);
        },

        valueFormatter: (p) =>
          `₹${Number(p.value || 0).toLocaleString("en-IN")}`,
      },

      {
        field: "remarks",

        headerName: "Remarks",

        flex: 1.5,

        editable: (p) => p.data?.type === "Item",
      },
    ],
    [],
  );

  // ================= EVENTS =================

  const onCellValueChanged = useCallback((params) => {
    setRowData((prev) =>
      prev.map((row) =>
        row.id === params.data.id
          ? {
              ...row,
              [params.colDef.field]: params.newValue,
            }
          : row,
      ),
    );
  }, []);

  const onRowDragEnd = useCallback(() => {
    if (!gridRef.current) return;

    const api = gridRef.current.api;

    const rows = [];

    api.forEachNode((node) => rows.push(node.data));

    setRowData(rows);
  }, []);

  // ================= ADD ROW =================

  const addNewRow = (type = "Item") => {
    const row = {
      id: `temp-${Date.now()}`,

      type,

      description: type === "Item" ? "" : `New ${type}`,

      scope: "",

      unit: "",

      unit_id: null,

      quantity: 1,

      rate: 0,

      remarks: "",

      inventory_master_id: null,

      isNew: true,

      dbType:
        type === "Heading"
          ? "section"
          : type === "Subheading"
            ? "subheading"
            : "item",
    };

    setRowData((prev) => [...prev, row]);
  };

  // ================= DELETE =================

  const deleteSelectedRows = async () => {
    if (!gridRef.current) return;

    const selectedNodes = gridRef.current.api.getSelectedNodes();

    const rowsToDelete = selectedNodes.map((n) => n.data);

    setDeletedRows((prev) => [...prev, ...rowsToDelete]);

    setRowData((prev) =>
      prev.filter((row) => !rowsToDelete.some((d) => d.id === row.id)),
    );
  };

  // ================= INVENTORY =================

  const handleSelectInventory = (invItem) => {
    if (!currentRowId) return;

    const updatedRow = {
      description: invItem.item_name,

      scope: invItem.specification || invItem.description || "",

      unit: invItem.unit?.short_name || "",

      unit_id: invItem.unit_id || null,

      quantity: 1,

      rate: Number(invItem.default_rate) || 0,

      inventory_master_id: invItem.id,
    };

    setRowData((prev) =>
      prev.map((row) =>
        row.id === currentRowId ? { ...row, ...updatedRow } : row,
      ),
    );

    setInventoryModalOpen(false);

    setCurrentRowId(null);
  };

  // ================= SAVE =================

  // ================= SAVE =================
  const saveFullBoq = async () => {
    if (isSaving) return; // ← Prevents double save
    if (!boqTitle.trim()) {
      alert("BOQ Title is required");
      return;
    }

    try {
      setIsSaving(true);

      let currentBoqId = boqId;

      // Create or Update BOQ Header
      if (!currentBoqId) {
        const result = await createBoq({
          title: boqTitle,
          client_id: selectedClientId,
          boq_category_id: categoryId,
        }).unwrap();

        currentBoqId = result.id;
        setBoqId(currentBoqId);
      } else {
        await updateBoq({
          id: currentBoqId,
          title: boqTitle,
          client_id: selectedClientId,
          boq_category_id: categoryId,
        }).unwrap();
      }

      // Handle Deleted Rows
      for (const row of deletedRows) {
        try {
          if (row.dbType === "item" && !row.id.startsWith("temp-")) {
            await deleteItem(row.id).unwrap();
          } else if (
            row.dbType === "subheading" &&
            !row.id.startsWith("temp-")
          ) {
            await deleteSubHeading(row.id).unwrap();
          } else if (row.dbType === "section" && !row.id.startsWith("temp-")) {
            await deleteSection(row.id).unwrap();
          }
        } catch (err) {
          console.error("Delete error:", err);
        }
      }

      // ================= SAVE / UPDATE HIERARCHY (No Full Delete) =================
      let currentSectionId = null;
      let currentSubheadingId = null;

      for (let i = 0; i < rowData.length; i++) {
        const row = rowData[i];

        if (row.type === "Heading") {
          const payload = {
            boq_id: currentBoqId,
            title: row.description?.trim() || "Untitled Heading",
            sort_order: i,
          };

          let savedSection;
          if (row.isNew || row.id.startsWith("temp-")) {
            savedSection = await createSection(payload).unwrap();
          } else {
            savedSection = await updateSection({
              id: row.id,
              ...payload,
            }).unwrap();
          }

          currentSectionId = savedSection.id;
          currentSubheadingId = null;
          continue;
        }

        if (row.type === "Subheading") {
          if (!currentSectionId) continue; // safety

          const payload = {
            boq_id: currentBoqId,
            section_id: currentSectionId,
            title: row.description?.trim() || "Untitled Subheading",
            sort_order: i,
          };

          let savedSub;
          if (row.isNew || row.id.startsWith("temp-")) {
            savedSub = await createSubHeading(payload).unwrap();
          } else {
            savedSub = await updateSubHeading({
              id: row.id,
              ...payload,
            }).unwrap();
          }

          currentSubheadingId = savedSub.id;
          continue;
        }

        // Item
        if (row.type === "Item") {
          if (!currentSectionId) continue;

          const payload = {
            boq_id: currentBoqId,
            section_id: currentSectionId,
            subheading_id: currentSubheadingId || null,
            item_name: row.description?.trim() || "",
            specification: row.scope || "",
            qty: Number(row.quantity || 0),
            rate: Number(row.rate || 0),
            remarks: row.remarks || "",
            inventory_master_id: row.inventory_master_id || null,
            unit_id: row.unit_id || null,
            sort_order: i,
          };

          if (row.isNew || row.id.startsWith("temp-")) {
            await createItem(payload).unwrap();
          } else {
            await updateItem({ id: row.id, ...payload }).unwrap();
          }
        }
      }

      setDeletedRows([]);
      alert(
        isEditMode ? "BOQ updated successfully!" : "BOQ saved successfully!",
      );
      router.push(`/boq/view?boqId=${currentBoqId}`);
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save BOQ. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* HEADER */}

      <div className="sticky top-0 z-50 border-b bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500">
              Projects • BOQ Management
            </div>

            <h1 className="text-2xl font-semibold">
              {isEditMode ? "Edit BOQ" : "Create BOQ"}
            </h1>
          </div>

          <Button
            onClick={saveFullBoq}
            disabled={isSaving || !boqTitle.trim()}
            className="bg-zinc-900 hover:bg-black text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : isEditMode ? "Update BOQ" : "Save BOQ"}
          </Button>
        </div>
      </div>

      {/* BODY */}

      <div className="px-8 py-6 space-y-6">
        {/* FORM */}

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-6">
              {/* CLIENT */}

              <div>
                <label className="text-xs font-medium text-zinc-500">
                  CLIENT
                </label>

                <div className="flex gap-2">
                  <Select
                    value={selectedClientId}
                    onValueChange={setSelectedClientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>

                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setClientModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* TITLE */}

              <div>
                <label className="text-xs font-medium text-zinc-500">
                  BOQ TITLE
                </label>

                <Input
                  value={boqTitle}
                  onChange={(e) => setBoqTitle(e.target.value)}
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="text-xs font-medium text-zinc-500">
                  CATEGORY
                </label>

                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TOOLBAR */}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => addNewRow("Heading")}>
            Add Heading
          </Button>

          <Button variant="outline" onClick={() => addNewRow("Subheading")}>
            Add Subheading
          </Button>

          <Button
            onClick={() => addNewRow("Item")}
            className="bg-zinc-900 hover:bg-black text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>

          <Button variant="destructive" onClick={deleteSelectedRows}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        {/* GRID */}

        <div className="bg-white rounded-xl border overflow-hidden">
          <div style={{ height: "68vh" }}>
            <AgGridReact
              ref={gridRef}
              theme={themeQuartz}
              rowData={rowData}
              columnDefs={columnDefs}
              rowDragManaged
              rowSelection="multiple"
              rowHeight={42}
              headerHeight={44}
              quickFilterText={searchTerm}
              onCellValueChanged={onCellValueChanged}
              onRowDragEnd={onRowDragEnd}
              defaultColDef={{
                sortable: true,
                resizable: true,
                filter: true,
              }}
            />
          </div>
        </div>

        {/* TOTAL */}

        <div className="flex justify-end">
          <div className="bg-white border rounded-2xl px-10 py-6">
            <div className="text-sm text-zinc-500">Grand Total</div>

            <div className="text-4xl font-bold">
              ₹{totalAmount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* INVENTORY MODAL */}

      <Dialog open={inventoryModalOpen} onOpenChange={setInventoryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Inventory Item</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search inventory..."
            value={inventorySearch}
            onChange={(e) => setInventorySearch(e.target.value)}
          />

          <div className="max-h-[60vh] overflow-auto border rounded-lg mt-4">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="px-4 py-3 border-b cursor-pointer hover:bg-zinc-100"
                onClick={() => handleSelectInventory(item)}
              >
                <div className="font-medium">{item.item_name}</div>

                <div className="text-sm text-zinc-500">
                  ₹{item.default_rate || 0}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* CLIENT MODAL */}

      <Dialog open={clientModalOpen} onOpenChange={setClientModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Client</DialogTitle>
          </DialogHeader>

          <ClientForm
            onSubmit={async (values) => {
              const client = await createClient(values).unwrap();

              setSelectedClientId(client?.id);

              setClientModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
