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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Loader2,
} from "lucide-react";

const STATUS_MAP = {
  scope_done: { label: "Scope Done", color: "bg-green-100 text-green-700" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  completed: { label: "Document Ready", color: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-100 text-red-700",
  },
};

export default function ScopePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    data: scopes = [],
    isLoading,
    error,
    refetch,
  } = useGetAllScopesQuery();

  const [approveScope] = useApproveScopeMutation();
  const [rejectScope] = useRejectScopeMutation();
  const [deleteScope] = useDeleteScopeMutation();

  // ======================================================
  // MAPPED DATA
  // ======================================================
  const mappedScopes = useMemo(() => {
    return scopes.map((item) => ({
      id: item.id,
      project_id: item.project_id,
      project_name: item?.project?.name || "Untitled Project",
      client_name: item?.project?.client?.name || "No Client",
      stage: item?.project?.current_stage || "Not Available",
      status: item?.status || item?.project?.status || "draft",
      scope_summary: item.scope_summary,
      created_at: item.created_at,
      raw: item,
    }));
  }, [scopes]);

  // ======================================================
  // FILTERED & SORTED
  // ======================================================
  const filteredScopes = useMemo(() => {
    let result = [...mappedScopes];

    // Search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((item) =>
        [item.project_name, item.client_name, item.stage, item.status]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    // Status Filter
    if (filterStatus !== "all") {
      result = result.filter((item) => item.status === filterStatus);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name")
        return a.project_name.localeCompare(b.project_name);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      // Default: Latest first
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return result;
  }, [mappedScopes, search, filterStatus, sortBy]);

  // ======================================================
  // ACTIONS
  // ======================================================
  const handleNewScope = () => router.push("/scopes/add");

  const handleEdit = (item) => {
    router.push(`/scopes/add?id=${item.id}&projectId=${item.project_id}`);
  };

  const openItem = (id) => {
    router.push(`/scopes/view?scopeId=${id}`);
  };

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
      toast.success("Scope deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        document.querySelector('input[placeholder*="Search"]')?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa] text-red-500">
        Failed to load scopes.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* HEADER */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Scope Documents</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredScopes.length} documents
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

            {user?.role !== "Client" && (
              <Button
                onClick={handleNewScope}
                className="bg-[#ef7f1b] hover:bg-[#d96f18]"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Scope
              </Button>
            )}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scope documents..."
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STATUS_MAP).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Latest First</SelectItem>
              <SelectItem value="name">Project Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filteredScopes.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold">
                No scope documents found
              </h3>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredScopes.map((item) => {
                const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.draft;
                return (
                  <Card
                    key={item.id}
                    className="group rounded-2xl border bg-white p-5 hover:-translate-y-1 hover:shadow-lg transition cursor-pointer"
                    onClick={() => openItem(item.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <ClipboardList className="h-6 w-6 text-[#ef7f1b]" />
                      </div>
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[#ef7f1b] transition-colors">
                      {item.project_name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.client_name}
                    </p>

                    {item.scope_summary && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {item.scope_summary}
                      </p>
                    )}

                    <div className="mt-4 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString("en-IN")}
                    </div>

                    {user?.role !== "Client" && (
                      <div className="mt-5 flex justify-end opacity-0 group-hover:opacity-100 transition">
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(item.project_id);
                              }}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />{" "}
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(item.project_id);
                              }}
                            >
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />{" "}
                              Request Changes
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
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            /* ================= LIST VIEW ================= */
            <div className="space-y-3">
              {filteredScopes.map((item) => {
                const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.draft;
                return (
                  <Card
                    key={item.id}
                    className="flex items-center gap-4 p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => openItem(item.id)}
                  >
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <ClipboardList className="h-6 w-6 text-[#ef7f1b]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{item.project_name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {item.client_name}
                      </p>
                    </div>

                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>

                    {user?.role !== "Client" && (
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
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(item.project_id);
                            }}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(item.project_id);
                            }}
                          >
                            Request Changes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
