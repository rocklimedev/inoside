"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  useGetBoqsQuery,
  useDeleteBoqMutation,
  useGetBoqByIdQuery,
  useUpdateBoqStatusMutation,
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

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Grid3X3,
  List,
  Plus,
  MoreVertical,
  Loader2,
  Edit,
  Eye,
  Trash2,
  IndianRupee,
} from "lucide-react";

const BOQ_STATUSES = ["draft", "submitted", "approved", "rejected", "revised"];

export default function BoqsPage() {
  const router = useRouter();

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("total");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");

  const [selectedBoqId, setSelectedBoqId] = useState(null);
  const [boqToDelete, setBoqToDelete] = useState(null);

  const { data: boqs = [], isLoading, error } = useGetBoqsQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const [deleteBoq, { isLoading: isDeleting }] = useDeleteBoqMutation();

  const { data: selectedBoq } = useGetBoqByIdQuery(selectedBoqId, {
    skip: !selectedBoqId,
  });
  const [updateBoqStatus, { isLoading: isUpdatingStatus }] =
    useUpdateBoqStatusMutation();
  const projectMap = useMemo(() => {
    return new Map(projects.map((p) => [p.id, p.name]));
  }, [projects]);

  const filteredBoqs = useMemo(() => {
    let result = [...boqs];

    // Search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((b) => b.title?.toLowerCase().includes(term));
    }

    // Status Filter
    if (filterStatus !== "all") {
      result = result.filter((b) => b.status === filterStatus);
    }

    // Project Filter
    if (filterProject !== "all") {
      result = result.filter((b) => b.project_id === filterProject);
    }

    // Sorting
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
  }, [boqs, search, filterStatus, filterProject, sortBy]);
  const handleStatusChange = async (boqId, status) => {
    try {
      await updateBoqStatus({
        id: boqId,
        status,
      }).unwrap();

      toast.success(`BOQ ${status} successfully`);
    } catch (err) {
      toast.error(err?.data?.message || "Status update failed");
    }
  };
  const handleDelete = async () => {
    if (!boqToDelete) return;
    try {
      await deleteBoq(boqToDelete).unwrap();
      toast.success("BOQ deleted successfully");
      setBoqToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-[#fafafa]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <p className="text-red-500">Failed to load BOQs</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* HEADER */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">BOQs</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredBoqs.length} records found
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
              onClick={() => router.push("/boq/add")}
              className="bg-[#ef7f1b] hover:bg-[#d96f18]"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New BOQ
            </Button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search BOQs..."
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-44">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {BOQ_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Highest Amount</SelectItem>
              <SelectItem value="date">Newest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filteredBoqs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No BOQs found matching your criteria.
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredBoqs.map((boq) => (
                <Card
                  key={boq.id}
                  className="cursor-pointer rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg group"
                  onClick={() => router.push(`/boq/view?boqId=${boq.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-2xl text-[#ef7f1b]">
                      ₹
                    </div>

                    <Badge
                      className={`capitalize ${
                        boq.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : boq.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {boq.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg truncate">{boq.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {projectMap.get(boq.project_id)}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold">
                      ₹{Number(boq.grand_total || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-gray-400">
                    Rev {boq.revision_no} •{" "}
                    {new Date(boq.created_at).toLocaleDateString()}
                  </div>

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
                            router.push(`/boq/view?boqId=${boq.id}`);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        {boq.status !== "submitted" && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(boq.id, "submitted");
                            }}
                          >
                            Submit
                          </DropdownMenuItem>
                        )}

                        {boq.status !== "approved" && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(boq.id, "approved");
                            }}
                          >
                            Approve
                          </DropdownMenuItem>
                        )}

                        {boq.status !== "rejected" && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(boq.id, "rejected");
                            }}
                            className="text-red-600"
                          >
                            Reject
                          </DropdownMenuItem>
                        )}

                        {boq.status !== "revised" && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(boq.id, "revised");
                            }}
                          >
                            Mark Revised
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/boq/add?boqId=${boq.id}`);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBoqToDelete(boq.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
              {filteredBoqs.map((boq) => (
                <Card
                  key={boq.id}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:shadow-md transition"
                  onClick={() => router.push(`/boq/view?boqId=${boq.id}`)}
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-3xl text-[#ef7f1b]">
                    ₹
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{boq.title}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {projectMap.get(boq.project_id)} • Rev {boq.revision_no}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ₹{Number(boq.grand_total || 0).toLocaleString("en-IN")}
                    </p>
                    <Badge className="capitalize text-xs">{boq.status}</Badge>
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/boq/view?boqId=${boq.id}`);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      {boq.status !== "submitted" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(boq.id, "submitted");
                          }}
                        >
                          Submit
                        </DropdownMenuItem>
                      )}

                      {boq.status !== "approved" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(boq.id, "approved");
                          }}
                        >
                          Approve
                        </DropdownMenuItem>
                      )}

                      {boq.status !== "rejected" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(boq.id, "rejected");
                          }}
                          className="text-red-600"
                        >
                          Reject
                        </DropdownMenuItem>
                      )}

                      {boq.status !== "revised" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(boq.id, "revised");
                          }}
                        >
                          Mark Revised
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/boq/add?boqId=${boq.id}`);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBoqToDelete(boq.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* DELETE CONFIRMATION */}
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
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
