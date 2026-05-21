"use client";

import React, { useState } from "react";

import {
  useGetAllPitchesQuery,
  useDeletePitchMutation,
} from "@/api/projectsApi";

import { useAuth } from "@/contexts/AuthContext";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";

import {
  Plus,
  Presentation,
  Trash2,
  FileText,
  CalendarDays,
  User2,
} from "lucide-react";

import UploadArea from "@/components/pitch/UploadArea";
import PitchDetail from "@/components/pitch/PitchDetail";

export default function PitchPage() {
  const { user } = useAuth();

  const { data: pitches = [], isLoading, refetch } = useGetAllPitchesQuery();

  const [deletePitch] = useDeletePitchMutation();

  const [activePitch, setActivePitch] = useState(null);

  const [mode, setMode] = useState("list");

  const [showNewDialog, setShowNewDialog] = useState(false);

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id) => {
    try {
      await deletePitch(id).unwrap();

      toast.success("Pitch deleted");

      if (activePitch?.id === id) {
        setActivePitch(null);
        setMode("list");
      }

      refetch();
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete pitch");
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  // ======================================================
  // DETAIL VIEW
  // ======================================================

  if (mode === "detail" && activePitch) {
    return (
      <PitchDetail
        pitch={activePitch}
        user={user}
        onBack={() => {
          setMode("list");
          refetch();
        }}
      />
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-[#ef7f1b]" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-black">
                Project Pitches
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {pitches.length} pitch
                {pitches.length !== 1 ? "es" : ""}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          {user?.role !== "Client" && (
            <Button
              onClick={() => setShowNewDialog(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white rounded-xl h-11 px-5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Pitch
            </Button>
          )}
        </div>
      </div>

      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {pitches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-5">
                <Presentation className="w-10 h-10 text-[#ef7f1b]" />
              </div>

              <h2 className="text-xl font-bold text-black">
                No Pitches Uploaded
              </h2>

              <p className="text-sm text-gray-500 mt-2 max-w-md">
                Upload your first project pitch presentation to begin
                collaborating with your team.
              </p>

              {user?.role !== "Client" && (
                <Button
                  onClick={() => setShowNewDialog(true)}
                  className="mt-6 bg-[#ef7f1b] hover:bg-[#d66e15] text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First Pitch
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {pitches.map((p) => {
                const fileName =
                  p.pitch_pdf_url?.split("/").pop() || "Pitch File";

                return (
                  <Card
                    key={p.id}
                    onClick={() => {
                      setActivePitch({
                        ...p,
                        filename: fileName,
                        file_url: p.pitch_pdf_url,
                        project_name: p.project?.name,
                        uploaded_by: p.createdByUser?.name,
                        version: p.version || "v1.0",
                      });

                      setMode("detail");
                    }}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      border-gray-200
                      bg-white
                      p-5
                      cursor-pointer
                      transition-all
                      duration-300
                      hover:shadow-2xl
                      hover:-translate-y-1
                      hover:border-[#ef7f1b]/30
                    "
                  >
                    {/* TOP */}

                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <Presentation className="w-6 h-6 text-[#ef7f1b]" />
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-50 text-blue-600 border-0 rounded-full">
                          {p.version || "v1.0"}
                        </Badge>

                        {user?.role !== "Client" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p.id);
                            }}
                            className="
                              opacity-0
                              group-hover:opacity-100
                              transition-opacity
                              text-red-500
                              hover:text-red-700
                            "
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* BODY */}

                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-black line-clamp-1">
                        {p.project?.name || "Untitled Project"}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4 shrink-0" />

                        <span className="line-clamp-1">{fileName}</span>
                      </div>
                    </div>

                    {/* STATUS */}

                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <Badge
                        className={`
                          rounded-full border-0
                          ${
                            p.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : p.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : p.status === "Pending Review"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {p.status || "Draft"}
                      </Badge>

                      {p.luxury_level && (
                        <Badge variant="outline" className="rounded-full">
                          {p.luxury_level} Luxury
                        </Badge>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="mt-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User2 className="w-3.5 h-3.5" />

                        <span className="truncate">
                          {p.createdByUser?.name || "Unknown User"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays className="w-3.5 h-3.5" />

                        <span>
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* FOOTER */}

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        {p.comments?.length || 0} comments
                      </div>

                      {p.color_tone && (
                        <div className="text-xs font-medium text-[#ef7f1b]">
                          {p.color_tone}
                        </div>
                      )}
                    </div>

                    {/* HOVER GLOW */}

                    <div
                      className="
                        absolute
                        inset-0
                        rounded-3xl
                        ring-1
                        ring-transparent
                        group-hover:ring-[#ef7f1b]/20
                        pointer-events-none
                      "
                    />
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ====================================================== */}
      {/* UPLOAD DIALOG */}
      {/* ====================================================== */}

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent
          className="
            w-[98vw]
            max-w-7xl
            h-[95vh]
            p-0
            overflow-hidden
            rounded-3xl
            border-0
          "
        >
          <div className="flex flex-col h-full bg-white">
            {/* BODY */}

            <div className="flex-1 overflow-hidden">
              <UploadArea
                onUploaded={() => {
                  setShowNewDialog(false);

                  refetch();
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
