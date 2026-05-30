"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetAllScopesQuery,
  useApproveScopeMutation,
  useRejectScopeMutation,
  useDeleteScopeMutation,
} from "@/api/projects/scopeApi";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Plus,
  X,
  Loader2,
  Trash2,
  Pencil,
  ClipboardList,
  Building2,
  CheckCircle2,
  XCircle,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";

const STATUS_MAP = {
  scope_done: { label: "Scope Done", color: "bg-green-50 text-green-600" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Document Ready", color: "bg-blue-50 text-blue-600" },
  approved: { label: "Approved", color: "bg-green-50 text-green-600" },
  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};

const STATUSES = Object.keys(STATUS_MAP);

export default function ScopePage() {
  const router = useRouter();
  const { user } = useAuth();

  // ======================================================
  // STATE
  // ======================================================
  const [viewMode, setViewMode] = useState("list" > "grid");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("status" > "date");
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    statuses: [],
  });

  // ======================================================
  // API
  // ======================================================
  const {
    data: scopes = [],
    isLoading,
    error,
    refetch,
  } = useGetAllScopesQuery();
  const [approveScope, { isLoading: approving }] = useApproveScopeMutation();
  const [rejectScope, { isLoading: rejecting }] = useRejectScopeMutation();
  const [deleteScope, { isLoading: deleting }] = useDeleteScopeMutation();

  // ======================================================
  // MAP DATA (Fixed for your real structure)
  // ======================================================
  const mappedScopes = useMemo(() => {
    return scopes.map((item) => ({
      id: item.id,
      project_id: item.project_id,
      project_name: item?.project?.name || "Untitled Project",
      client_name: item?.project?.client?.name || "No Client",
      stage: item?.project?.current_stage || "Not Available",
      status: item?.project?.status || "draft", // Using project.status
      scope_summary: item.scope_summary,
      area_summary: item.area_summary,
      created_at: item.created_at,
      raw: item,
    }));
  }, [scopes]);

  // ======================================================
  // FILTER + SEARCH + SORT
  // ======================================================
  const filteredScopes = useMemo(() => {
    let result = [...mappedScopes];

    // Search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((item) =>
        [item.project_name, item.client_name, item.stage, item.status].some(
          (field) => field?.toLowerCase().includes(term),
        ),
      );
    }

    // Filters
    if (filters.statuses.length > 0) {
      result = result.filter((item) => filters.statuses.includes(item.status));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name")
        return a.project_name.localeCompare(b.project_name);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "date")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      return 0;
    });

    return result;
  }, [mappedScopes, search, filters, sortBy]);

  // ======================================================
  // HELPERS
  // ======================================================
  const toggleFilter = (value) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(value)
        ? prev.statuses.filter((v) => v !== value)
        : [...prev.statuses, value],
    }));
  };

  const clearFilters = () => setFilters({ statuses: [] });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredScopes.length
        ? []
        : filteredScopes.map((s) => s.id),
    );
  };

  const clearSelection = () => setSelectedIds([]);

  // ======================================================
  // ACTIONS
  // ======================================================
  const handleNewScope = () => router.push("/scopes/add");
  const handleEdit = (item) =>
    router.push(`/scopes/add?id=${item.id}&projectId=${item.project_id}`);
  const openItem = (item) => router.push(`/scopes/view?scopeId=${item.id}`);

  const handleApprove = async (projectId) => {
    try {
      await approveScope(projectId).unwrap();
      toast.success("Scope approved successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve scope");
    }
  };

  const handleReject = async (projectId) => {
    try {
      await rejectScope({
        projectId,
        reason: "Changes requested by client",
      }).unwrap();
      toast.success("Changes requested");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject scope");
    }
  };

  const handleDelete = async (scopeId) => {
    if (!confirm("Delete this scope?")) return;
    try {
      await deleteScope(scopeId).unwrap();
      toast.success("Scope deleted");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} scopes?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteScope(id).unwrap()));
      toast.success("Selected scopes deleted");
      clearSelection();
      refetch();
    } catch (err) {
      toast.error("Bulk delete failed");
    }
  };

  // Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        document
          .querySelector('input[placeholder="Search scope documents..."]')
          ?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center h-screen">
        Failed to load scopes.
      </div>
    );

  return (
    <div className="flex h-full">
      {/* Filters Sidebar */}
      {showFilters && (
        <div className="w-72 border-r bg-white p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold uppercase tracking-wider text-sm">
              Filters
            </h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-3">
              Status
            </h4>
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => toggleFilter(status)}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition ${
                  filters.statuses.includes(status)
                    ? "bg-orange-50 border border-[#ef7f1b] text-[#ef7f1b]"
                    : "hover:bg-gray-50"
                }`}
              >
                {STATUS_MAP[status].label}
              </button>
            ))}
          </div>

          {filters.statuses.length > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-[#ef7f1b] hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div>
              <h1 className="text-3xl font-black">Scope Documents</h1>
              <p className="text-gray-500 mt-1">
                {filteredScopes.length} document
                {filteredScopes.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-gray-50 border rounded-xl px-4 py-2.5 focus-within:border-[#ef7f1b]">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scope documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-1.5">
                  <span>{selectedIds.length} selected</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Cancel
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
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

              {user?.role !== "Client" && (
                <Button
                  onClick={handleNewScope}
                  className="bg-[#ef7f1b] hover:bg-[#d66e15]"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Scope
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {filteredScopes.length === 0 ? (
              <div className="text-center py-20">
                <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No scope documents found.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredScopes.map((item) => {
                  const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                  return (
                    <Card
                      key={item.id}
                      className="p-5 hover:shadow-xl transition-all"
                    >
                      <div
                        onClick={() => openItem(item.raw)}
                        className="cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">
                              {item.project_name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <Building2 className="w-4 h-4" />
                              {item.client_name}
                            </div>
                          </div>
                          <Badge className={st.color}>{st.label}</Badge>
                        </div>

                        {item.scope_summary && (
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                            {item.scope_summary}
                          </p>
                        )}

                        <div className="mt-4 text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-[#ef7f1b]">
                            {item.stage}
                          </span>
                        </div>
                      </div>

                      {user?.role !== "Client" && (
                        <div className="flex justify-end mt-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(item.raw)}
                              >
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleApprove(item.project_id)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />{" "}
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleReject(item.project_id)}
                              >
                                <XCircle className="w-4 h-4 mr-2 text-red-600" />{" "}
                                Request Changes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              // List View (similar structure, you can expand if needed)
              <div className="space-y-3">
                {filteredScopes.map((item) => {
                  const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                  return (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div
                          onClick={() => openItem(item.raw)}
                          className="flex-1 cursor-pointer"
                        >
                          <h3 className="font-bold">{item.project_name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.client_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.stage}
                          </p>
                        </div>
                        <Badge className={st.color}>{st.label}</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
