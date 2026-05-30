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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Plus,
  Presentation,
  Trash2,
  FileText,
  CalendarDays,
  User2,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";

import UploadArea from "@/components/pitch/UploadArea";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PitchPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: pitches = [], isLoading, refetch } = useGetAllPitchesQuery();

  const [deletePitch] = useDeletePitchMutation();
  const [approvePitch] = useApprovePitchMutation();
  const [rejectPitch] = useRejectPitchMutation();

  const [showNewDialog, setShowNewDialog] = useState(false);

  const [viewMode, setViewMode] = useState("grid");

  // ======================================================
  // MAP DATA (normalize like scope page)
  // ======================================================
  const mappedPitches = useMemo(() => {
    return pitches.map((p) => ({
      id: p.id,
      project_id: p.project_id,
      project_name: p?.project?.name || "Untitled Project",
      client_name: p?.project?.client?.name || "No Client",
      file_name: p?.pitch_pdf_url?.split("/").pop() || "Pitch File",
      file_url: p?.pitch_pdf_url,
      status: p.status,
      created_by: p?.createdByUser?.name,
      created_at: p.created_at,
      luxury_level: p.luxury_level,
      color_tone: p.color_tone,
      raw: p,
    }));
  }, [pitches]);

  // ======================================================
  // ACTIONS
  // ======================================================
  const handleDelete = async (id) => {
    if (!confirm("Delete this pitch?")) return;

    try {
      await deletePitch(id).unwrap();
      toast.success("Pitch deleted");
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

  const openView = (item) => {
    router.push(`/pitches/view?pitchId=${item.id}`);
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Project Pitches</h1>
            <p className="text-sm text-gray-500">
              {mappedPitches.length} pitches
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* VIEW SWITCH */}
            <div className="flex border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid" ? "bg-[#ef7f1b] text-white" : ""
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list" ? "bg-[#ef7f1b] text-white" : ""
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {user?.role !== "Client" && (
              <Button
                onClick={() => setShowNewDialog(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {mappedPitches.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              No pitches found
            </div>
          ) : viewMode === "grid" ? (
            // ======================================================
            // GRID VIEW
            // ======================================================
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {mappedPitches.map((p) => (
                <Card key={p.id} className="p-5 hover:shadow-xl transition">
                  {/* HEADER */}
                  <div className="flex justify-between">
                    <Presentation className="text-[#ef7f1b]" />
                    <Badge>{p.status || "Draft"}</Badge>
                  </div>

                  {/* TITLE */}
                  <h3
                    onClick={() => openView(p)}
                    className="font-bold text-lg mt-3 cursor-pointer"
                  >
                    {p.project_name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">{p.client_name}</p>

                  {/* FILE */}
                  <div className="flex items-center gap-2 text-xs mt-2 text-gray-500">
                    <FileText className="w-4 h-4" />
                    {p.file_name}
                  </div>

                  {/* META */}
                  <div className="text-xs text-gray-400 mt-3">
                    {new Date(p.created_at).toLocaleDateString("en-IN")}
                  </div>

                  {/* DROPDOWN ACTIONS */}
                  {user?.role !== "Client" && (
                    <div className="flex justify-end mt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(p)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => openPDF(p.file_url)}>
                            <Download className="w-4 h-4 mr-2" />
                            Open PDF
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleApprove(p.id)}>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                            Approve
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleReject(p.id)}>
                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                            Reject
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            // ======================================================
            // LIST VIEW
            // ======================================================
            <div className="space-y-3">
              {mappedPitches.map((p) => (
                <Card key={p.id} className="p-4">
                  <div className="flex justify-between">
                    <div className="cursor-pointer" onClick={() => openView(p)}>
                      <h3 className="font-bold">{p.project_name}</h3>
                      <p className="text-sm text-gray-500">{p.client_name}</p>
                      <p className="text-xs text-gray-400">{p.file_name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge>{p.status}</Badge>

                      {user?.role !== "Client" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openView(p)}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openPDF(p.file_url)}
                            >
                              Open PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(p.id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* UPLOAD */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="w-[98vw] max-w-6xl h-[95vh] p-0">
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
