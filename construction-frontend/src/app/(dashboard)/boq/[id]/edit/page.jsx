"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Save, ArrowLeft, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

import { BoqSectionForm } from "@/components/boq/BoqSectionForm";
import { BoqSubHeadingForm } from "@/components/boq/BoqSubHeadingForm";
import { BoqItemForm } from "@/components/boq/BoqItemForm";
import { BoqTreeView } from "@/components/boq/BoqTreeView";
import { BoqSummary } from "@/components/boq/BoqSummary";
import { ProjectSelector } from "@/components/projects/ProjectSelector";

import {
  useGetBoqCategoriesQuery,
  useCreateBoqMutation,
  useUpdateBoqMutation,
  useGetBoqByIdQuery,
  useCreateSectionMutation,
  useCreateSubHeadingMutation,
  useCreateItemMutation,
} from "@/api/boqApi";

export default function BoqEditPage() {
  // ======================================================
  // ROUTER / PARAMS
  // ======================================================
  const params = useParams();
  const boqId = params.id;
  const router = useRouter();

  // ======================================================
  // STATE — all hooks unconditionally at the top
  // ======================================================
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [boq, setBoq] = useState({
    project_id: "",
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
  // API HOOKS — all unconditional
  // ======================================================

  // Renamed mutation hook to "updateBoqMutation" to avoid collision
  // with the local "updateBoqState" helper and the "updateBoq" RTK action
  const [createBoq, { isLoading: isCreatingBoq }] = useCreateBoqMutation();
  const [updateBoqMutation, { isLoading: isUpdatingBoq }] =
    useUpdateBoqMutation();
  const [createSection] = useCreateSectionMutation();
  const [createSubHeading] = useCreateSubHeadingMutation();
  const [createItem] = useCreateItemMutation();

  const { data: categories = [] } = useGetBoqCategoriesQuery();

  const { data: existingBoq, isLoading: isLoadingExisting } =
    useGetBoqByIdQuery(boqId, {
      skip: !boqId,
    });

  // ======================================================
  // EFFECTS — all before any conditional return
  // ======================================================

  // Populate form when existing BOQ data loads
  useEffect(() => {
    if (!existingBoq) return;

    setSelectedProjectId(existingBoq.project_id || "");
    setBoq({
      id: existingBoq.id,
      project_id: existingBoq.project_id || "",
      boq_category_id: existingBoq.boq_category_id || "",
      title: existingBoq.title || "",
      revision_no: existingBoq.revision_no || "Rev-01",
      status: existingBoq.status || "draft",
      notes: existingBoq.notes || "",
      sections: existingBoq.sections || [],
    });
  }, [existingBoq]);

  // Keep boq.project_id in sync with the project selector
  useEffect(() => {
    setBoq((prev) => ({ ...prev, project_id: selectedProjectId }));
  }, [selectedProjectId]);

  // ======================================================
  // MEMOS — all before any conditional return
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
  // CONDITIONAL RETURNS — only after all hooks
  // ======================================================
  if (boqId && isLoadingExisting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#ef7f1b] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading BOQ...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // HANDLERS
  // ======================================================
  const updateBoqState = (patch) => {
    setBoq((prev) => ({ ...prev, ...patch }));
  };

  // ── Sections ──────────────────────────────────────────
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

  // ── Subheadings ───────────────────────────────────────
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

  // ── Items ─────────────────────────────────────────────
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

  // ── Save structure ────────────────────────────────────

  /**
   * Sections saved in parallel (independent of each other).
   * Subheadings stay sequential (need sectionId from parent).
   * Items within a subheading saved in parallel (independent).
   */
  const saveBoqStructure = async (targetBoqId) => {
    setIsSavingStructure(true);
    try {
      await Promise.all(
        boq.sections.map(async (section) => {
          const createdSection = await createSection({
            boq_id: targetBoqId,
            title: section.title,
            description: section.description || "",
            sort_order: section.sort_order || 0,
          }).unwrap();

          const sectionId = createdSection.id || createdSection.data?.id;

          for (const subheading of section.subheadings) {
            const createdSubheading = await createSubHeading({
              boq_id: targetBoqId,
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
                  boq_id: targetBoqId,
                  section_id: sectionId,
                  subheading_id: subheadingId,
                  item_name: item.item_name,
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
      toast.error("BOQ saved, but some sections/items failed. Please review.");
    } finally {
      setIsSavingStructure(false);
    }
  };

  // ── Main save ─────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedProjectId) return toast.error("Please select a project");
    if (!boq.title.trim()) return toast.error("BOQ title is required");
    if (!boq.boq_category_id) return toast.error("Please select a category");

    const boqPayload = {
      project_id: selectedProjectId,
      boq_category_id: boq.boq_category_id,
      title: boq.title,
      revision_no: boq.revision_no,
      status: boq.status,
      notes: boq.notes,
      subtotal: totals.subtotal,
      tax_amount: totals.tax_amount,
      grand_total: totals.grand_total,
    };

    try {
      // ── UPDATE path ──
      if (boqId) {
        await updateBoqMutation({ id: boqId, ...boqPayload }).unwrap();
        toast.success("BOQ updated successfully");
        router.push(`/projects/${selectedProjectId}/boqs/${boqId}`);
        return;
      }

      // ── CREATE path ──
      const createdBoq = await createBoq(boqPayload).unwrap();
      const boqIdCreated = createdBoq.id || createdBoq.data?.id;

      if (!boqIdCreated) throw new Error("Failed to retrieve BOQ ID");

      toast.success("BOQ created successfully");

      if (boq.sections.length > 0) {
        await saveBoqStructure(boqIdCreated);
      }

      router.push(`/projects/${selectedProjectId}/boqs/${boqIdCreated}`);
    } catch (error) {
      console.error("[BOQ SAVE ERROR]", error);
      toast.error(error?.data?.message || "Failed to save BOQ");
    }
  };

  const isSaving = isCreatingBoq || isUpdatingBoq || isSavingStructure;

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <PageHeader
        title={boqId ? "Edit BOQ" : "New Bill of Quantities"}
        subtitle="Build hierarchical BOQ with sections, subheadings and items"
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : boqId ? "Update BOQ" : "Save BOQ"}
            </Button>
          </div>
        }
      />

      {/* ── Project Selector ── */}
      <ProjectSelector
        value={selectedProjectId}
        onChange={setSelectedProjectId}
        disabled={!!boqId}
      />

      {/* ── BOQ Info ── */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label>BOQ Title *</Label>
            <Input
              value={boq.title}
              onChange={(e) => updateBoqState({ title: e.target.value })}
              placeholder="Interior Works - Villa Phase 1"
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Select
              value={boq.boq_category_id}
              onValueChange={(v) => updateBoqState({ boq_category_id: v })}
            >
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

          <div>
            <Label>Revision No</Label>
            <Input
              value={boq.revision_no}
              onChange={(e) => updateBoqState({ revision_no: e.target.value })}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={boq.status}
              onValueChange={(v) => updateBoqState({ status: v })}
            >
              <SelectTrigger>
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
        </div>

        <div className="mt-4">
          <Label>Notes / Remarks</Label>
          <Textarea
            value={boq.notes}
            onChange={(e) => updateBoqState({ notes: e.target.value })}
            placeholder="Additional notes..."
          />
        </div>
      </Card>

      {/* ── BOQ Builder ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left — Tree */}
        <div className="lg:col-span-4">
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

        {/* Right — Item form / placeholder */}
        <div className="lg:col-span-8">
          <Card className="p-6 min-h-[500px]">
            {!activeItem ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-10 h-10 text-[#ef7f1b]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Build your BOQ</h3>
                <p className="text-muted-foreground max-w-md">
                  Add sections and subheadings from the left panel, then add
                  items.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => setSectionModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Section
                </Button>
              </div>
            ) : (
              <BoqItemForm
                item={activeItem.item}
                onSave={(item) =>
                  addOrUpdateItem(
                    activeItem.sectionId,
                    activeItem.subheadingId,
                    item,
                  )
                }
                onCancel={() => setActiveItem(null)}
              />
            )}
          </Card>
        </div>
      </div>

      {/* ── Summary ── */}
      <BoqSummary totals={totals} itemCount={itemCount} />

      {/* ── Modals ── */}
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
