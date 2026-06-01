"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  useGetAllPitchesQuery,
  useDeletePitchMutation,
  useApprovePitchMutation,
  useRejectPitchMutation,
} from "@/api/projects/pitchesApi";

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
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Eye,
  Download,
  CheckCircle2,
  FileText,
  XCircle,
  Trash2,
  Presentation,
  Loader2,
} from "lucide-react";

import UploadArea from "@/components/pitch/UploadArea";

export default function PitchPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: pitches = [], isLoading, refetch } = useGetAllPitchesQuery();

  const [deletePitch] = useDeletePitchMutation();
  const [approvePitch] = useApprovePitchMutation();
  const [rejectPitch] = useRejectPitchMutation();

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");

  // ======================================================
  // NORMALIZED DATA
  // ======================================================
  const mappedPitches = useMemo(() => {
    return pitches.map((p) => ({
      id: p.id,
      project_id: p.project_id,
      project_name: p?.project?.name || "Untitled Project",
      client_name: p?.project?.client?.name || "No Client",
      file_name: p?.pitch_pdf_url?.split("/").pop() || "Pitch File",
      file_url: p?.pitch_pdf_url,
      status: p.status || "Draft",
      created_at: p.created_at,
      raw: p,
    }));
  }, [pitches]);

  // ======================================================
  // FILTERED PITCHES
  // ======================================================
  const filteredPitches = useMemo(() => {
    let result = [...mappedPitches];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((p) =>
        [p.project_name, p.client_name, p.file_name]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    return result;
  }, [mappedPitches, search]);

  // ======================================================
  // ACTIONS
  // ======================================================
  const handleDelete = async (id) => {
    if (!confirm("Delete this pitch?")) return;
    try {
      await deletePitch(id).unwrap();
      toast.success("Pitch deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete pitch");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approvePitch(id).unwrap();
      toast.success("Pitch approved");
      refetch();
    } catch {
      toast.error("Failed to approve pitch");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPitch(id).unwrap();
      toast.success("Pitch rejected");
      refetch();
    } catch {
      toast.error("Failed to reject pitch");
    }
  };

  const openPDF = (url) => {
    if (!url) return toast.error("No file found");
    window.open(url, "_blank");
  };

  const openView = (id) => {
    router.push(`/pitches/view?pitchId=${id}`);
  };

  // ======================================================
  // LOADING
  // ======================================================
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
            <h1 className="text-2xl font-black">Project Pitches</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredPitches.length} pitches found
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
                onClick={() => setShowNewDialog(true)}
                className="bg-[#ef7f1b] hover:bg-[#d96f18]"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Upload Pitch
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
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
          {filteredPitches.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Presentation className="w-12 h-12 mx-auto mb-4 opacity-40" />
              No pitches found
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredPitches.map((p) => (
                <Card
                  key={p.id}
                  className="group rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  onClick={() => openView(p.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <Presentation className="h-6 w-6 text-[#ef7f1b]" />
                    </div>

                    <Badge
                      className={
                        p.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : p.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg truncate group-hover:text-[#ef7f1b] transition-colors">
                    {p.project_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {p.client_name}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{p.file_name}</span>
                  </div>

                  <div className="mt-6 text-xs text-gray-400">
                    {new Date(p.created_at).toLocaleDateString("en-IN")}
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
                              openView(p.id);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openPDF(p.file_url);
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" /> Open PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(p.id);
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />{" "}
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(p.id);
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />{" "}
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p.id);
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
              {filteredPitches.map((p) => (
                <Card
                  key={p.id}
                  className="flex items-center gap-4 p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => openView(p.id)}
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <Presentation className="h-6 w-6 text-[#ef7f1b]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{p.project_name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {p.client_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {p.file_name}
                    </p>
                  </div>

                  <Badge
                    className={
                      p.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }
                  >
                    {p.status}
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
                            openView(p.id);
                          }}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openPDF(p.file_url);
                          }}
                        >
                          Open PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(p.id);
                          }}
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(p.id);
                          }}
                        >
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
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

      {/* UPLOAD DIALOG */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="w-[98vw] max-w-6xl h-[95vh] p-0 rounded-3xl">
          <UploadArea
            onUploaded={() => {
              setShowNewDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
