"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  useGetBoqsQuery,
  useDeleteBoqMutation,
  useGetBoqByIdQuery,
} from "@/api/boqApi";

import { useGetProjectsQuery } from "@/api/projectsApi";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  X,
  Loader2,
} from "lucide-react";

const BOQ_STATUSES = ["draft", "submitted", "approved", "rejected", "revised"];

export default function BoqsPage() {
  const router = useRouter();

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ statuses: [], projects: [] });
  const [sortBy, setSortBy] = useState("total");
  const [selectedBoqId, setSelectedBoqId] = useState(null);
  const [boqToDelete, setBoqToDelete] = useState(null);

  // RTK Query
  const { data: boqs = [], isLoading, error } = useGetBoqsQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const [deleteBoq, { isLoading: isDeleting }] = useDeleteBoqMutation();
  const { data: selectedBoq } = useGetBoqByIdQuery(selectedBoqId, {
    skip: !selectedBoqId,
  });

  const projectMap = useMemo(() => {
    return new Map(projects.map((p) => [p.id, p.name]));
  }, [projects]);

  const filteredBoqs = useMemo(() => {
    let result = [...boqs];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((b) => b.title?.toLowerCase().includes(term));
    }

    if (filters.statuses.length > 0) {
      result = result.filter((b) => filters.statuses.includes(b.status));
    }
    if (filters.projects.length > 0) {
      result = result.filter((b) => filters.projects.includes(b.project_id));
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "total") {
        return Number(b.grand_total || 0) - Number(a.grand_total || 0);
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return result;
  }, [boqs, search, filters, sortBy]);

  const handleDelete = async () => {
    if (!boqToDelete) return;
    try {
      await deleteBoq(boqToDelete).unwrap();
      toast.success("BOQ deleted successfully");
      setBoqToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete BOQ");
    }
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => setFilters({ statuses: [], projects: [] });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Failed to load BOQs. Please try again.
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      {showFilters && (
        <div className="w-72 border-r border-gray-200 bg-white p-6 shrink-0 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Filters
            </h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            <FilterSection
              title="Status"
              items={BOQ_STATUSES}
              selected={filters.statuses}
              onToggle={(v) => toggleFilter("statuses", v)}
            />
            <Separator />
            <FilterSection
              title="Project"
              items={projects.map((p) => p.id)}
              getLabel={(id) => projectMap.get(id) || id}
              selected={filters.projects}
              onToggle={(v) => toggleFilter("projects", v)}
            />
          </div>

          {(filters.statuses.length > 0 || filters.projects.length > 0) && (
            <button
              onClick={clearFilters}
              className="mt-6 text-sm text-[#ef7f1b] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-black">Bill of Quantities (BOQ)</h1>

            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border focus-within:border-[#ef7f1b]">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search BOQs by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-0 focus-visible:ring-0 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "border-[#ef7f1b] text-[#ef7f1b]" : ""}
              >
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="name">Title</SelectItem>
                  <SelectItem value="total">Total Amount</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 ${viewMode === "grid" ? "bg-[#ef7f1b] text-white" : "hover:bg-gray-100"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 ${viewMode === "list" ? "bg-[#ef7f1b] text-white" : "hover:bg-gray-100"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={() => router.push("/boq/create")}
                className="bg-[#ef7f1b] hover:bg-[#d66e15]"
              >
                <Plus className="w-4 h-4 mr-2" /> New BOQ
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {filteredBoqs.length} BOQ{filteredBoqs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {viewMode === "grid" ? (
              <GridView
                boqs={filteredBoqs}
                projectMap={projectMap}
                onQuickView={setSelectedBoqId}
                onView={(id) => router.push(`/boq/view?boqId=${id}`)}
                onEdit={(id) => router.push(`/boq/${id}/edit`)}
                onDelete={setBoqToDelete}
              />
            ) : (
              <ListView
                boqs={filteredBoqs}
                projectMap={projectMap}
                onQuickView={setSelectedBoqId}
                onView={(id) => router.push(`/boq/view?boqId=${id}`)}
                onEdit={(id) => router.push(`/boq/${id}/edit`)}
                onDelete={setBoqToDelete}
              />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Detail Sheet - Quick View */}
      <Sheet open={!!selectedBoqId} onOpenChange={() => setSelectedBoqId(null)}>
        <SheetContent className="w-[440px] sm:w-[520px]">
          {selectedBoq && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedBoq.title}</SheetTitle>
                <p className="text-sm text-gray-500">
                  {projectMap.get(selectedBoq.project_id)}
                </p>
              </SheetHeader>

              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <InfoRow
                    icon={FileText}
                    label="Status"
                    value={selectedBoq.status}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Revision"
                    value={selectedBoq.revision_no}
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Grand Total"
                    value={`₹${Number(selectedBoq.grand_total || 0).toLocaleString()}`}
                  />
                  <InfoRow
                    icon={TrendingUp}
                    label="Items"
                    value={
                      selectedBoq.sections?.reduce((acc, section) => {
                        return (
                          acc +
                          (section.subheadings?.reduce(
                            (a, sh) => a + (sh.items?.length || 0),
                            0,
                          ) || 0)
                        );
                      }, 0) || 0
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/boq/view?boqId=${selectedBoq.id}`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Full BOQ
                  </Button>
                  <Button
                    className="flex-1 bg-[#ef7f1b] hover:bg-[#d66e15]"
                    onClick={() => router.push(`/boq/${selectedBoq.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit BOQ
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!boqToDelete}
        onOpenChange={() => setBoqToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete BOQ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the BOQ
              and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete BOQ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ===================== Helper Components ===================== */

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  items,
  selected,
  onToggle,
  getLabel = (v) => v,
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => onToggle(item)}
            />
            <span className="text-sm">{getLabel(item)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ===================== Updated Views ===================== */

function GridView({ boqs, projectMap, onQuickView, onView, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boqs.map((b) => (
        <Card
          key={b.id}
          className="p-5 hover:shadow-lg hover:border-[#ef7f1b]/30 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold truncate">{b.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {projectMap.get(b.project_id)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-md">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onQuickView(b.id)}>
                  <Eye className="w-4 h-4 mr-2" /> Quick View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(b.id)}>
                  <Eye className="w-4 h-4 mr-2" /> View Full BOQ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(b.id)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDelete(b.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-xs">
              {b.revision_no}
            </Badge>
            <Badge
              variant="secondary"
              className={
                b.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }
            >
              {b.status}
            </Badge>
          </div>

          <div className="text-xl font-bold text-[#ef7f1b] mb-1">
            ₹{Number(b.grand_total || 0).toLocaleString()}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ListView({ boqs, projectMap, onQuickView, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold uppercase text-gray-500 border-b">
        <div className="col-span-5">BOQ Title</div>
        <div className="col-span-3">Project</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-right">Total</div>
        <div className="col-span-1"></div>
      </div>

      {boqs.map((b) => (
        <div
          key={b.id}
          className="grid grid-cols-12 gap-4 px-6 py-4 border-b hover:bg-orange-50/50 items-center"
        >
          <div className="col-span-5">
            <p className="font-medium">{b.title}</p>
            <p className="text-xs text-gray-500">{b.revision_no}</p>
          </div>
          <div className="col-span-3 text-sm">
            {projectMap.get(b.project_id)}
          </div>
          <div className="col-span-2">
            <Badge
              className={
                b.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }
            >
              {b.status}
            </Badge>
          </div>
          <div className="col-span-1 text-right font-semibold">
            ₹{Number(b.grand_total || 0).toLocaleString()}
          </div>
          <div className="col-span-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onQuickView(b.id)}>
                  <Eye className="w-4 h-4 mr-2" /> Quick View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(b.id)}>
                  <Eye className="w-4 h-4 mr-2" /> View Full BOQ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(b.id)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDelete(b.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
