"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, ArrowLeft, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { BoqSectionForm } from "@/components/boq/BoqSectionForm";
import { BoqSubHeadingForm } from "@/components/boq/BoqSubHeadingForm";
import { BoqItemForm } from "@/components/boq/BoqItemForm";
import { BoqTreeView } from "@/components/boq/BoqTreeView";
import { BoqSummary } from "@/components/boq/BoqSummary";
import { ProjectSelector } from "@/components/projects/ProjectSelector";

import {
  useGetBoqCategoriesQuery,
  useCreateBoqMutation,
  useCreateSectionMutation,
  useCreateSubHeadingMutation,
  useCreateItemMutation,
} from "@/api/boqApi";

import {
  useGetInventoryMasterQuery,
  useGetUnitsQuery,
} from "@/api/inventoryApi";

export default function BoqPage({ projectId: initialProjectId, boqId }) {
  const router = useRouter();

  // ======================================================
  // STATE
  // ======================================================
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || "",
  );
  const [itemSearchTerm, setItemSearchTerm] = useState("");

  const [boq, setBoq] = useState({
    project_id: initialProjectId || "",
    boq_category_id: "",
    title: "",
    revision_no: "Rev-01",
    status: "draft",
    notes: "",
    sections: [],
  });

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [subheadingModalOpen, setSubheadingModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [isSavingStructure, setIsSavingStructure] = useState(false);

  // ======================================================
  // API HOOKS
  // ======================================================
  const [createBoq, { isLoading: isCreatingBoq }] = useCreateBoqMutation();
  const [createSection] = useCreateSectionMutation();
  const [createSubHeading] = useCreateSubHeadingMutation();
  const [createItem] = useCreateItemMutation();

  const { data: categories = [] } = useGetBoqCategoriesQuery();

  const { data: inventoryItems = [], isLoading: isLoadingInventory } =
    useGetInventoryMasterQuery(
      { search: itemSearchTerm },
      { skip: itemSearchTerm.length < 2 },
    );

  // New: Units API
  const { data: units = [], isLoading: isLoadingUnits } = useGetUnitsQuery();

  // ======================================================
  // EFFECTS
  // ======================================================
  useEffect(() => {
    setBoq((prev) => ({ ...prev, project_id: selectedProjectId }));
  }, [selectedProjectId]);

  // ======================================================
  // MEMOS
  // ======================================================
  const totals = useMemo(() => {
    let subtotal = 0;

    boq.sections.forEach((section) => {
      section.subheadings.forEach((subheading) => {
        subheading.items.forEach((item) => {
          const base = (item.qty || 0) * (item.rate || 0);
          const afterWastage = base * (1 + (item.wastage_percent || 0) / 100);
          const afterDiscount =
            afterWastage * (1 - (item.discount_percent || 0) / 100);
          subtotal += afterDiscount;
        });
      });
    });

    const tax = subtotal * 0.18;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax_amount: Math.round(tax * 100) / 100,
      grand_total: Math.round((subtotal + tax) * 100) / 100,
    };
  }, [boq.sections]);

  const itemCount = useMemo(
    () =>
      boq.sections
        .flatMap((s) => s.subheadings)
        .reduce((acc, sh) => acc + sh.items.length, 0),
    [boq.sections],
  );

  // ======================================================
  // HANDLERS
  // ======================================================
  const updateBoq = (patch) => {
    setBoq((prev) => ({ ...prev, ...patch }));
  };

  const addSection = (data) => {
    const newSection = {
      id: `temp_${Date.now()}`,
      title: data.title,
      description: data.description,
      sort_order: boq.sections.length,
      subheadings: [],
    };

    setBoq((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSectionModalOpen(false);
    toast.success("Section added");
  };

  const openAddSubheading = (sectionId) => {
    setCurrentSectionId(sectionId);
    setSubheadingModalOpen(true);
  };

  const handleSaveSubheading = (data) => {
    const newSubheading = {
      id: `temp_${Date.now()}`,
      title: data.title,
      description: data.description,
      sort_order: 0,
      items: [],
    };

    setBoq((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === currentSectionId || section.title === currentSectionId
          ? { ...section, subheadings: [...section.subheadings, newSubheading] }
          : section,
      ),
    }));

    setSubheadingModalOpen(false);
    toast.success("Subheading added");
  };

  const handleAddItem = (sectionId, subheadingId) => {
    setActiveItem({ sectionId, subheadingId, item: null });
  };

  const addOrUpdateItem = (sectionId, subheadingId, item) => {
    setBoq((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId && section.title !== sectionId)
          return section;

        return {
          ...section,
          subheadings: section.subheadings.map((sh) =>
            sh.id === subheadingId || sh.title === subheadingId
              ? {
                  ...sh,
                  items: item.id
                    ? sh.items.map((i) => (i.id === item.id ? item : i))
                    : [
                        ...sh.items,
                        {
                          ...item,
                          id: `temp_${Date.now()}`,
                          sort_order: sh.items.length,
                        },
                      ],
                }
              : sh,
          ),
        };
      }),
    }));

    setActiveItem(null);
    toast.success(item.id ? "Item updated" : "Item added");
  };

  const deleteItem = (sectionId, subheadingId, itemId) => {
    setBoq((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subheadings: section.subheadings.map((sh) =>
                sh.id === subheadingId
                  ? { ...sh, items: sh.items.filter((i) => i.id !== itemId) }
                  : sh,
              ),
            }
          : section,
      ),
    }));
  };

  // ======================================================
  // SAVE STRUCTURE
  // ======================================================
  const saveBoqStructure = async (boqIdCreated) => {
    setIsSavingStructure(true);
    try {
      await Promise.all(
        boq.sections.map(async (section) => {
          const createdSection = await createSection({
            boq_id: boqIdCreated,
            title: section.title,
            description: section.description || "",
            sort_order: section.sort_order || 0,
          }).unwrap();

          const sectionId = createdSection.id || createdSection.data?.id;

          for (const subheading of section.subheadings) {
            const createdSubheading = await createSubHeading({
              boq_id: boqIdCreated,
              section_id: sectionId,
              title: subheading.title,
              description: subheading.description || "",
              sort_order: subheading.sort_order || 0,
            }).unwrap();

            const subheadingId =
              createdSubheading.id || createdSubheading.data?.id;

            await Promise.all(
              subheading.items.map((item) =>
                createItem({
                  boq_id: boqIdCreated,
                  section_id: sectionId,
                  subheading_id: subheadingId,
                  inventory_master_id: item.inventory_master_id || undefined,
                  item_name: item.item_name?.trim() || "",
                  item_code: item.item_code || null,
                  description: item.description || null,
                  specification: item.specification || null,
                  brand: item.brand || null,
                  qty: Number(item.qty) || 0,
                  unit_id: item.unit_id || null,
                  rate: Number(item.rate) || 0,
                  wastage_percent: Number(item.wastage_percent) || 0,
                  discount_percent: Number(item.discount_percent) || 0,
                  tax_percent: Number(item.tax_percent) || 18,
                  remarks: item.remarks || null,
                  sort_order: item.sort_order || 0,
                }).unwrap(),
              ),
            );
          }
        }),
      );

      toast.success("BOQ structure saved successfully");
    } catch (err) {
      console.error("[BOQ SAVE STRUCTURE ERROR]", err);
      toast.error(
        err?.data?.message ||
          "Some items failed to save. Please review and retry.",
      );
    } finally {
      setIsSavingStructure(false);
    }
  };

  const handleSave = async () => {
    if (!selectedProjectId) return toast.error("Please select a project");
    if (!boq.title.trim()) return toast.error("BOQ title is required");
    if (!boq.boq_category_id) return toast.error("Please select a category");

    try {
      const createdBoq = await createBoq({
        project_id: selectedProjectId,
        boq_category_id: boq.boq_category_id,
        title: boq.title,
        notes: boq.notes,
      }).unwrap();

      const boqIdCreated = createdBoq.id || createdBoq.data?.id;
      if (!boqIdCreated) throw new Error("Failed to retrieve BOQ ID");

      toast.success("BOQ created successfully");

      if (boq.sections.length > 0) {
        await saveBoqStructure(boqIdCreated);
      }

      router.push(`/boq/${boqIdCreated}`);
    } catch (error) {
      console.error("[BOQ SAVE ERROR]", error);
      toast.error(error?.data?.message || "Failed to save BOQ");
    }
  };

  const isSaving = isCreatingBoq || isSavingStructure;

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-xl">
        <div className="px-4 md:px-8 py-5">
          <PageHeader
            title={boqId ? "Edit BOQ" : "New Bill of Quantities"}
            subtitle="Build a professional hierarchical BOQ structure"
            actions={
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-[#ef7f1b] hover:bg-[#d66e15] text-white shadow-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save BOQ"}
                </Button>
              </div>
            }
          />
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">
        <ProjectSelector
          value={selectedProjectId}
          onChange={setSelectedProjectId}
          disabled={!!boqId}
        />

        {/* BOQ Information */}
        <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-black">BOQ Information</h2>
                <p className="text-sm text-muted-foreground">
                  Configure metadata and project details
                </p>
              </div>
            </div>

            <Separator className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-2 space-y-2">
                <Label>BOQ Title *</Label>
                <Input
                  value={boq.title}
                  onChange={(e) => updateBoq({ title: e.target.value })}
                  placeholder="Interior Works - Villa Phase 1"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={boq.boq_category_id}
                  onValueChange={(v) => updateBoq({ boq_category_id: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl">
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

              <div className="space-y-2">
                <Label>Revision No</Label>
                <Input
                  value={boq.revision_no}
                  onChange={(e) => updateBoq({ revision_no: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={boq.status}
                  onValueChange={(v) => updateBoq({ status: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="revised">Revised</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 xl:col-span-4 space-y-2">
                <Label>Notes / Remarks</Label>
                <Textarea
                  value={boq.notes}
                  onChange={(e) => updateBoq({ notes: e.target.value })}
                  placeholder="Additional notes and clarifications..."
                  className="min-h-[120px] rounded-2xl resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure Builder */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4">
            <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
              <div className="border-b px-6 py-5 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg">Structure Builder</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sections, subheadings and items
                    </p>
                  </div>
                  <Badge className="rounded-full bg-orange-100 text-[#ef7f1b] border-0">
                    {itemCount} items
                  </Badge>
                </div>
              </div>

              <ScrollArea className="h-[700px]">
                <div className="p-5">
                  <BoqTreeView
                    sections={boq.sections}
                    onAddSection={() => setSectionModalOpen(true)}
                    onAddSubheading={openAddSubheading}
                    onEditItem={(sectionId, subheadingId, item) =>
                      setActiveItem({ sectionId, subheadingId, item })
                    }
                    onDeleteItem={deleteItem}
                    onAddItem={handleAddItem}
                  />
                </div>
              </ScrollArea>
            </Card>
          </div>

          <div className="xl:col-span-8">
            <Card className="rounded-3xl border-0 shadow-sm min-h-[700px] overflow-hidden">
              {!activeItem ? (
                <div className="flex flex-col items-center justify-center py-28 px-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                    <FileSpreadsheet className="w-12 h-12 text-[#ef7f1b]" />
                  </div>
                  <h3 className="text-3xl font-black mb-3">
                    Start Building Your BOQ
                  </h3>
                  <p className="text-muted-foreground max-w-lg leading-relaxed">
                    Create sections and subheadings from the left panel, then
                    add BOQ items with rates, quantities and specifications.
                  </p>
                  <Button
                    className="mt-8 rounded-xl bg-[#ef7f1b] hover:bg-[#d66e15]"
                    onClick={() => setSectionModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Section
                  </Button>
                </div>
              ) : (
                <div className="p-6 md:p-8">
                  <BoqItemForm
                    item={activeItem.item}
                    inventoryItems={inventoryItems}
                    units={units} // ← Dynamic Units
                    isLoadingInventory={isLoadingInventory}
                    isLoadingUnits={isLoadingUnits} // ← Loading state
                    searchTerm={itemSearchTerm}
                    onSearchChange={setItemSearchTerm}
                    onSave={(item) =>
                      addOrUpdateItem(
                        activeItem.sectionId,
                        activeItem.subheadingId,
                        item,
                      )
                    }
                    onCancel={() => setActiveItem(null)}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>

        <BoqSummary totals={totals} itemCount={itemCount} />
      </div>

      {/* Modals */}
      <BoqSectionForm
        open={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        onSave={addSection}
      />

      <BoqSubHeadingForm
        open={subheadingModalOpen}
        onClose={() => setSubheadingModalOpen(false)}
        onSave={handleSaveSubheading}
        sectionTitle={
          boq.sections.find(
            (s) => s.id === currentSectionId || s.title === currentSectionId,
          )?.title
        }
      />
    </div>
  );
}
