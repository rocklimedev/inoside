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

  const [filters, setFilters] = useState({
    statuses: [],
    projects: [],
  });

  const [sortBy, setSortBy] = useState("total");

  const [selectedBoqId, setSelectedBoqId] = useState(null);
  const [boqToDelete, setBoqToDelete] = useState(null);

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

    if (filters.statuses.length) {
      result = result.filter((b) => filters.statuses.includes(b.status));
    }

    if (filters.projects.length) {
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

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => setFilters({ statuses: [], projects: [] });

  const handleDelete = async () => {
    if (!boqToDelete) return;

    try {
      await deleteBoq(boqToDelete).unwrap();
      toast.success("BOQ deleted");
      setBoqToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load BOQs
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* FILTER SIDEBAR */}
      {showFilters && (
        <aside className="w-72 bg-white border-r p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs uppercase tracking-widest text-gray-500">
              Filters
            </h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            <FilterSection
              title="Status"
              items={BOQ_STATUSES}
              selected={filters.statuses}
              onToggle={(v) => toggleFilter("statuses", v)}
            />

            <Separator />

            <FilterSection
              title="Projects"
              items={projects.map((p) => p.id)}
              getLabel={(id) => projectMap.get(id) || id}
              selected={filters.projects}
              onToggle={(v) => toggleFilter("projects", v)}
            />
          </div>

          {(filters.statuses.length || filters.projects.length) > 0 && (
            <button
              onClick={clearFilters}
              className="mt-6 text-sm text-gray-900 font-medium"
            >
              Clear filters
            </button>
          )}
        </aside>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                BOQ Management
              </h1>
              <p className="text-sm text-gray-500">
                {filteredBoqs.length} records
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search BOQs..."
                  className="border-0 bg-transparent focus:ring-0"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="total">Amount</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list" ? "bg-gray-900 text-white" : "bg-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={() => router.push("/boq/add")}
                className="bg-gray-900 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New BOQ
              </Button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {viewMode === "grid" ? (
              <GridView
                boqs={filteredBoqs}
                projectMap={projectMap}
                onQuickView={setSelectedBoqId}
                onView={(id) => router.push(`/boq/view?boqId=${id}`)}
                onEdit={(id) => router.push(`/boq/add?boqId=${id}`)}
                onDelete={setBoqToDelete}
              />
            ) : (
              <ListView
                boqs={filteredBoqs}
                projectMap={projectMap}
                onQuickView={setSelectedBoqId}
                onView={(id) => router.push(`/boq/view?boqId=${id}`)}
                onEdit={(id) => router.push(`/boq/add?boqId=${id}`)}
                onDelete={setBoqToDelete}
              />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* DELETE DIALOG */}
      <AlertDialog
        open={!!boqToDelete}
        onOpenChange={() => setBoqToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete BOQ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ================= FILTER ================= */

function FilterSection({
  title,
  items,
  selected,
  onToggle,
  getLabel = (v) => v,
}) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500 mb-3">{title}</p>

      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => onToggle(item)}
            />
            {getLabel(item)}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ================= GRID ================= */

function GridView({ boqs, projectMap, onQuickView, onView, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {boqs.map((b) => (
        <Card key={b.id} className="p-5 bg-white border hover:shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{b.title}</h3>
              <p className="text-xs text-gray-500">
                {projectMap.get(b.project_id)}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onQuickView(b.id)}>
                  Quick View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(b.id)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(b.id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(b.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2 mt-3">
            <Badge>{b.status}</Badge>
            <Badge variant="secondary">Rev {b.revision_no}</Badge>
          </div>

          <div className="mt-4 text-lg font-semibold text-gray-900">
            ₹{Number(b.grand_total || 0).toLocaleString()}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ================= LIST ================= */

function ListView({ boqs, projectMap, onQuickView, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 text-xs uppercase text-gray-500 bg-gray-50 p-3">
        <div className="col-span-5">Title</div>
        <div className="col-span-3">Project</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-right">Total</div>
        <div className="col-span-1"></div>
      </div>

      {boqs.map((b) => (
        <div
          key={b.id}
          className="grid grid-cols-12 p-4 border-t hover:bg-gray-50"
        >
          <div className="col-span-5">
            <p className="font-medium">{b.title}</p>
            <p className="text-xs text-gray-500">{b.revision_no}</p>
          </div>

          <div className="col-span-3 text-sm">
            {projectMap.get(b.project_id)}
          </div>

          <div className="col-span-2">
            <Badge>{b.status}</Badge>
          </div>

          <div className="col-span-1 text-right font-medium">
            ₹{Number(b.grand_total || 0).toLocaleString()}
          </div>

          <div className="col-span-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onView(b.id)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(b.id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(b.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
