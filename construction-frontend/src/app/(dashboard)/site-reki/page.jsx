"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MapPin,
  User2,
  Building2,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Grid3X3,
  List,
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

  const [viewMode, setViewMode] = useState("table");

  // =================================================
  // CREATE NEW
  // =================================================
  const handleNew = () => {
    if (!projects.length) {
      toast.error("No projects available");
      return;
    }
    router.push("/site-reki/add");
  };

  // =================================================
  // ROUTING HELPERS
  // =================================================
  const handleEdit = (item) => {
    router.push(`/site-reki/add?id=${item.id}&projectId=${item.project_id}`);
  };

  const handleView = (id) => {
    router.push(`/site-reki/view?id=${id}`);
  };

  const handleRowClick = (item) => {
    handleView(item.id);
  };

  // =================================================
  // ACTIONS
  // =================================================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Reki report?")) return;
    try {
      await deleteReki(id).unwrap();
      toast.success("Reki report deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await markAsDone(id).unwrap();
      toast.success("Marked as Done");
      refetch();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleMarkPending = async (id) => {
    try {
      await markAsPending(id).unwrap();
      toast.success("Marked as Pending");
      refetch();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f8f8]">
      {/* HEADER */}
      <div className="p-4 md:p-5 border-b bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Site Reki Reports</h1>
          <p className="text-sm text-gray-400 mt-1">
            {rekiReports.length} report{rekiReports.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {user?.role !== "Client" && (
            <Button
              onClick={handleNew}
              className="bg-[#ef7f1b] hover:bg-[#d96f0f] text-white whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Site Reki
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-5 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </Card>
              ))}

            {!isLoading && rekiReports.length === 0 && (
              <div className="col-span-full text-center py-20">
                <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-gray-700">No Reports</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Create your first site reki report.
                </p>
              </div>
            )}

            {!isLoading &&
              rekiReports.map((item) => (
                <Card
                  key={item.id}
                  className="p-5 hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  onClick={() => handleRowClick(item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base line-clamp-2">
                        {item.project?.name || "Untitled Project"}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-600">
                        <User2 className="w-4 h-4" />
                        <span className="line-clamp-1">
                          {item.project?.client?.name || "No Client"}
                        </span>
                      </div>
                    </div>

                    <Badge
                      className={`text-xs ${
                        item.reki_pdf_url
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.reki_pdf_url ? "Generated" : "Draft"}
                    </Badge>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN")
                        : "N/A"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item.id);
                      }}
                      className="text-[#ef7f1b] font-medium hover:underline"
                    >
                      View →
                    </button>
                  </div>

                  {user?.role !== "Client" && (
                    <div
                      className="absolute top-4 right-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Report
                          </DropdownMenuItem>
                          {item.reki_pdf_url ? (
                            <DropdownMenuItem
                              onClick={() => handleMarkPending(item.id)}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Mark as Pending
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleMarkDone(item.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Done
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        )}

        {/* TABLE VIEW - Responsive Cards on Mobile */}
        {viewMode === "table" && (
          <div className="p-4 md:p-5">
            <Card className="overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">
                        Project Name
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        Client
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        Created Date
                      </th>
                      <th className="w-32 p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rekiReports.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(item)}
                      >
                        <td className="p-4 font-medium">
                          {item.project?.name || "Untitled"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {item.project?.client?.name || "No Client"}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              item.reki_pdf_url
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {item.reki_pdf_url ? "Generated" : "Draft"}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-500">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "en-IN",
                              )
                            : "N/A"}
                        </td>
                        <td
                          className="p-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Desktop Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleView(item.id)}
                              >
                                View Report
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {item.reki_pdf_url ? (
                                <DropdownMenuItem
                                  onClick={() => handleMarkPending(item.id)}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Mark Pending
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleMarkDone(item.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Done
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-4">
                {rekiReports.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 active:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-base">
                          {item.project?.name || "Untitled Project"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.project?.client?.name || "No Client"}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs ${
                          item.reki_pdf_url
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.reki_pdf_url ? "Generated" : "Draft"}
                      </Badge>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN")
                        : "N/A"}
                    </div>

                    {user?.role !== "Client" && (
                      <div
                        className="mt-4 flex justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(item.id)}
                            >
                              View Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              Edit Report
                            </DropdownMenuItem>
                            {item.reki_pdf_url ? (
                              <DropdownMenuItem
                                onClick={() => handleMarkPending(item.id)}
                              >
                                Mark as Pending
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleMarkDone(item.id)}
                              >
                                Mark as Done
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600"
                            >
                              Delete Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
