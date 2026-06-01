"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";

import { useGetProjectsQuery } from "@/api/projectsApi";

import {
  useGetAllRekiReportsQuery,
  useDeleteRekiMutation,
  useMarkRekiAsDoneMutation,
  useMarkRekiAsPendingMutation,
} from "@/api/projects/rekiApi";

export default function SiteRekiPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: projects = [] } = useGetProjectsQuery();
  const {
    data: rekiReports = [],
    isLoading,
    refetch,
  } = useGetAllRekiReportsQuery();

  const [deleteReki] = useDeleteRekiMutation();
  const [markAsDone] = useMarkRekiAsDoneMutation();
  const [markAsPending] = useMarkRekiAsPendingMutation();

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");

  // =================================================
  // FILTERED DATA
  // =================================================
  const filteredReports = useMemo(() => {
    let result = [...rekiReports];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((item) =>
        [item.project?.name, item.project?.client?.name]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    return result;
  }, [rekiReports, search]);

  // =================================================
  // ACTIONS
  // =================================================
  const handleNew = () => {
    if (!projects.length) {
      toast.error("No projects available");
      return;
    }
    router.push("/site-reki/add");
  };

  const handleEdit = (item) => {
    router.push(`/site-reki/add?id=${item.id}&projectId=${item.project_id}`);
  };

  const handleView = (id) => {
    router.push(`/site-reki/view?id=${id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Reki report?")) return;
    try {
      await deleteReki(id).unwrap();
      toast.success("Reki report deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete report");
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await markAsDone(id).unwrap();
      toast.success("Marked as Done");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleMarkPending = async (id) => {
    try {
      await markAsPending(id).unwrap();
      toast.success("Marked as Pending");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* HEADER */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Site Reki Reports</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredReports.length} reports
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
                onClick={handleNew}
                className="bg-[#ef7f1b] hover:bg-[#d96f18]"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Site Reki
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects or clients..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filteredReports.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold">No Reki Reports Found</h3>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredReports.map((item) => (
                <Card
                  key={item.id}
                  className="group rounded-2xl border bg-white p-5 hover:-translate-y-1 hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleView(item.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#ef7f1b]" />
                    </div>

                    <Badge
                      className={
                        item.reki_pdf_url
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {item.reki_pdf_url ? "Generated" : "Draft"}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[#ef7f1b]">
                    {item.project?.name || "Untitled Project"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {item.project?.client?.name || "No Client"}
                  </p>

                  <div className="mt-6 text-xs text-gray-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-IN")
                      : "N/A"}
                  </div>

                  {user?.role !== "Client" && (
                    <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition">
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
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {item.reki_pdf_url ? (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkPending(item.id);
                              }}
                            >
                              <Clock className="mr-2 h-4 w-4" /> Mark Pending
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkDone(item.id);
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Mark Done
                            </DropdownMenuItem>
                          )}
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
              ))}
            </div>
          ) : (
            /* ================= LIST VIEW ================= */
            <div className="space-y-3">
              {filteredReports.map((item) => (
                <Card
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleView(item.id)}
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#ef7f1b]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">
                      {item.project?.name || "Untitled Project"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {item.project?.client?.name || "No Client"}
                    </p>
                  </div>

                  <Badge
                    className={
                      item.reki_pdf_url
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {item.reki_pdf_url ? "Generated" : "Draft"}
                  </Badge>

                  <div className="text-xs text-gray-400 hidden sm:block">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-IN")
                      : "N/A"}
                  </div>

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
                        {item.reki_pdf_url ? (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkPending(item.id);
                            }}
                          >
                            Mark Pending
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkDone(item.id);
                            }}
                          >
                            Mark Done
                          </DropdownMenuItem>
                        )}
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
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
