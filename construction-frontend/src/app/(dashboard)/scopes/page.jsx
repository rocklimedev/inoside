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
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-600",
  },
  completed: {
    label: "Document Ready",
    color: "bg-blue-50 text-blue-600",
  },
  approved: {
    label: "Approved",
    color: "bg-green-50 text-green-600",
  },
  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};

const STATUSES = ["draft", "completed", "approved", "changes_requested"];

export default function ScopePage() {
  const router = useRouter();
  const { user } = useAuth();

  // ======================================================
  // STATE
  // ======================================================

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
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
  // MAP DATA
  // ======================================================

  const mappedScopes = useMemo(() => {
    return scopes.map((item) => ({
      id: item.id,
      project_id: item.project_id,
      project_name: item?.project?.name || "Untitled Project",
      client_name: item?.project?.client?.name || "No Client",
      stage: item?.project?.current_stage || "Not Available",
      status: item.status || "draft",
      created_at: item.created_at,
      raw: item,
    }));
  }, [scopes]);

  // ======================================================
  // FILTER + SEARCH + SORT
  // ======================================================

  const filteredScopes = useMemo(() => {
    let result = [...mappedScopes];

    // SEARCH
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((item) =>
        [item.project_name, item.client_name, item.stage, item.status].some(
          (field) => field?.toLowerCase().includes(term),
        ),
      );
    }

    // FILTERS
    if (filters.statuses.length > 0) {
      result = result.filter((item) => filters.statuses.includes(item.status));
    }

    // SORTING
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.project_name.localeCompare(b.project_name);
      }
      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      if (sortBy === "date") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
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

  const clearFilters = () => {
    setFilters({ statuses: [] });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredScopes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredScopes.map((s) => s.id));
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // ======================================================
  // ACTIONS
  // ======================================================

  const handleNewScope = () => {
    router.push("/scopes/add");
  };

  const handleEdit = (item) => {
    router.push(`/scopes/add?id=${item.id}&projectId=${item.project_id}`);
  };

  const openItem = (item) => {
    router.push(`/scopes/view?scopeId=${item.id}`);
  };

  const handleApprove = async (projectId) => {
    try {
      await approveScope(projectId).unwrap();
      toast.success("Scope approved successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve scope");
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
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject scope");
    }
  };

  const handleDelete = async (scopeId) => {
    if (!window.confirm("Are you sure you want to delete this scope?")) {
      return;
    }
    try {
      await deleteScope(scopeId).unwrap();
      toast.success("Scope deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete scope");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} scope documents?`)) {
      return;
    }
    try {
      await Promise.all(selectedIds.map((id) => deleteScope(id).unwrap()));
      toast.success(`${selectedIds.length} scope documents deleted`);
      clearSelection();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete scopes");
    }
  };

  // ======================================================
  // SHORTCUTS
  // ======================================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        const input = document.querySelector(
          'input[placeholder="Search scope documents..."]',
        );
        input?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ======================================================
  // LOADING & ERROR
  // ======================================================

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
        Failed to load scope documents.
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="flex h-full">
      {/* FILTER SIDEBAR */}
      {showFilters && (
        <div className="w-72 border-r border-gray-200 bg-white p-6 shrink-0 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-4">
                Status
              </h4>
              <div className="space-y-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilter(status)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition ${
                      filters.statuses.includes(status)
                        ? "border-[#ef7f1b] bg-orange-50 text-[#ef7f1b]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span>{STATUS_MAP[status]?.label}</span>
                    {filters.statuses.includes(status) && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <Separator />
          </div>

          {filters.statuses.length > 0 && (
            <button
              onClick={clearFilters}
              className="mt-6 text-sm text-[#ef7f1b] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black">Scope Documents</h1>
              <p className="text-sm text-gray-500 mt-2">
                {filteredScopes.length} document
                {filteredScopes.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border focus-within:border-[#ef7f1b]">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scope documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedIds.length} selected
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
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
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
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
                {[
                  { mode: "grid", icon: LayoutGrid },
                  { mode: "list", icon: List },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2.5 ${
                      viewMode === mode
                        ? "bg-[#ef7f1b] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {user?.role !== "Client" && (
                <Button
                  onClick={handleNewScope}
                  className="bg-[#ef7f1b] hover:bg-[#d66e15]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Scope
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {filteredScopes.length === 0 ? (
              <div className="text-center py-20">
                <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  No scope documents found.
                </p>
              </div>
            ) : (
              <>
                {/* GRID VIEW */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredScopes.map((item) => {
                      const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                      return (
                        <Card
                          key={item.id}
                          className="p-5 hover:shadow-xl hover:border-[#ef7f1b]/30 transition-all duration-300"
                        >
                          <div
                            className="cursor-pointer"
                            onClick={() => openItem(item.raw)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-base font-bold text-black">
                                  {item.project_name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                  <Building2 className="w-3 h-3" />
                                  <span>{item.client_name}</span>
                                </div>
                              </div>
                              <Badge
                                className={`${st.color} text-[10px] border-0`}
                              >
                                {st.label}
                              </Badge>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </div>

                            <div className="mt-4">
                              <p className="text-xs text-gray-500 mb-1">
                                Current Stage
                              </p>
                              <p className="text-sm font-semibold text-[#ef7f1b]">
                                {item.stage}
                              </p>
                            </div>
                          </div>

                          {/* THREE DOTS DROPDOWN */}
                          {user?.role !== "Client" && (
                            <div className="flex justify-end mt-5">
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
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleApprove(item.project_id)
                                    }
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleReject(item.project_id)
                                    }
                                  >
                                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                    Request Changes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* LIST VIEW */}
                {viewMode === "list" && (
                  <div className="space-y-3">
                    {filteredScopes.map((item) => {
                      const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                      return (
                        <Card
                          key={item.id}
                          className="p-4 hover:border-[#ef7f1b]/40 transition"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div
                              className="flex items-center gap-4 flex-1 cursor-pointer"
                              onClick={() => openItem(item.raw)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => toggleSelect(item.id)}
                              />

                              <div className="flex-1">
                                <h3 className="font-bold">
                                  {item.project_name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                  <Building2 className="w-4 h-4" />
                                  <span>{item.client_name}</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">Stage</p>
                                <p className="text-sm font-semibold text-[#ef7f1b]">
                                  {item.stage}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">Created</p>
                                <p className="text-sm">
                                  {new Date(
                                    item.created_at,
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              <Badge className={`${st.color} border-0`}>
                                {st.label}
                              </Badge>
                            </div>

                            {/* THREE DOTS DROPDOWN - LIST VIEW */}
                            {user?.role !== "Client" && (
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
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleApprove(item.project_id)
                                    }
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleReject(item.project_id)
                                    }
                                  >
                                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                    Request Changes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
