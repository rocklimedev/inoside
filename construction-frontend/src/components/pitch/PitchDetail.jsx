"use client";

import React, { useState, useRef } from "react";

import {
  useAddPitchCommentMutation,
  useReplacePitchFileMutation,
  useUploadPitchFileMutation,
} from "@/api/projectsApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";

import {
  ArrowLeft,
  Download,
  RefreshCw,
  Loader2,
  Send,
  Presentation,
  FileText,
  CalendarDays,
  User2,
  Palette,
  Gem,
} from "lucide-react";

export default function PitchDetail({ pitch, user, onBack }) {
  const [addPitchComment, { isLoading: commenting }] =
    useAddPitchCommentMutation();

  const [replacePitchFile, { isLoading: replacing }] =
    useReplacePitchFileMutation();

  const [uploadPitchFile, { isLoading: uploading }] =
    useUploadPitchFileMutation();

  const [data, setData] = useState(pitch);

  const [comment, setComment] = useState("");

  const replaceRef = useRef(null);

  // =================================================
  // COMMENT
  // =================================================

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await addPitchComment({
        pitchId: data.id,
        content: comment,
      }).unwrap();

      setData((prev) => ({
        ...prev,
        comments: res.comments,
      }));

      setComment("");

      toast.success("Comment added");
    } catch (err) {
      console.error(err);

      toast.error("Failed to add comment");
    }
  };

  // =================================================
  // REPLACE FILE
  // =================================================

  const handleReplace = async (file) => {
    try {
      const uploadRes = await uploadPitchFile(file).unwrap();

      const ver = data.version || "v1.0";

      const parts = ver.replace("v", "").split(".");

      const newVer = `v${parts[0]}.${parseInt(parts[1] || "0") + 1}`;

      await replacePitchFile({
        pitchId: data.id,
        file_id: uploadRes.file_id,
        filename: file.name,
        file_url: uploadRes.url,
        file_size: uploadRes.size,
        version: newVer,
      }).unwrap();

      setData((prev) => ({
        ...prev,
        filename: file.name,
        file_url: uploadRes.url,
        version: newVer,
      }));

      toast.success("Pitch replaced");
    } catch (err) {
      console.error(err);

      toast.error("Failed to replace pitch");
    }
  };

  // =================================================
  // DOWNLOAD
  // =================================================

  const handleDownload = () => {
    if (data.file_url) {
      window.open(data.file_url, "_blank");
    }
  };

  const fileUrl = data.file_url || data.pitch_pdf_url || "";

  const fileName = data.filename || fileUrl?.split("/").pop() || "Pitch File";

  const projectName =
    data.project_name || data.project?.name || "Untitled Project";

  const uploadedBy =
    data.uploaded_by || data.createdByUser?.name || "Unknown User";

  const isPdf = fileName?.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}

          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="
                w-10
                h-10
                rounded-xl
                border
                border-gray-200
                flex
                items-center
                justify-center
                text-gray-500
                hover:text-black
                hover:border-gray-300
                transition-all
              "
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Presentation className="w-6 h-6 text-[#ef7f1b]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-black">{projectName}</h1>

                <Badge className="bg-blue-50 text-blue-600 border-0 rounded-full">
                  {data.version || "v1.0"}
                </Badge>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Project Pitch Presentation
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            {user?.role !== "Client" && (
              <>
                <input
                  ref={replaceRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx,.key"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleReplace(e.target.files[0]);
                    }
                  }}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => replaceRef.current?.click()}
                  disabled={replacing || uploading}
                  className="rounded-xl"
                >
                  {replacing || uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Replace File
                </Button>
              </>
            )}

            <Button
              onClick={handleDownload}
              className="
                bg-[#ef7f1b]
                hover:bg-[#d66e15]
                text-white
                rounded-xl
              "
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* BODY */}
      {/* ================================================= */}

      <div className="flex-1 flex overflow-hidden">
        {/* ================================================= */}
        {/* PREVIEW */}
        {/* ================================================= */}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* INFO BAR */}

          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {/* FILE */}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">File</p>

                  <p className="text-sm font-medium text-black truncate">
                    {fileName}
                  </p>
                </div>
              </div>

              {/* UPLOADED BY */}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <User2 className="w-5 h-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Uploaded By</p>

                  <p className="text-sm font-medium text-black">{uploadedBy}</p>
                </div>
              </div>

              {/* DATE */}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Created</p>

                  <p className="text-sm font-medium text-black">
                    {new Date(data.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* LUXURY */}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Luxury Level</p>

                  <p className="text-sm font-medium text-black">
                    {data.luxury_level || "Not Set"}
                  </p>
                </div>
              </div>
            </div>

            {/* TAGS */}

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Badge
                className={`
                  rounded-full border-0
                  ${
                    data.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : data.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : data.status === "Pending Review"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {data.status || "Draft"}
              </Badge>

              {data.color_tone && (
                <Badge variant="outline" className="rounded-full">
                  <Palette className="w-3 h-3 mr-1" />

                  {data.color_tone}
                </Badge>
              )}
            </div>
          </div>

          {/* PREVIEW AREA */}

          <div className="flex-1 bg-gray-100 p-5 overflow-hidden">
            {isPdf && fileUrl ? (
              <iframe
                src={data.file_url}
                className="w-full h-full rounded-lg border border-gray-200 bg-white"
                title="Pitch Preview"
              />
            ) : (
              <div className="w-full h-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-center p-10">
                <Presentation className="w-16 h-16 text-gray-300 mb-5" />

                <h3 className="text-lg font-bold text-black">
                  Preview Not Available
                </h3>

                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  This file format cannot be previewed directly.
                </p>

                <Button
                  onClick={handleDownload}
                  className="
                    mt-6
                    bg-[#ef7f1b]
                    hover:bg-[#d66e15]
                    text-white
                    rounded-xl
                  "
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* COMMENTS */}
        {/* ================================================= */}

        <div className="w-[360px] border-l border-gray-200 bg-white flex flex-col">
          {/* HEADER */}

          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-black">Comments</h3>

              <Badge variant="secondary" className="rounded-full">
                {data.comments?.length || 0}
              </Badge>
            </div>
          </div>

          {/* COMMENTS */}

          <ScrollArea className="flex-1">
            <div className="p-5 space-y-4">
              {(data.comments || []).map((c, i) => (
                <div key={i} className="flex gap-3">
                  {/* AVATAR */}

                  <div className="w-9 h-9 rounded-full bg-orange-100 text-[#ef7f1b] flex items-center justify-center text-xs font-bold shrink-0">
                    {c.sender?.[0] || "U"}
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-black">
                          {c.sender}
                        </p>

                        <p className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(c.timestamp).toLocaleDateString()}
                        </p>
                      </div>

                      <p className="text-sm text-gray-700 mt-1 break-words">
                        {c.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {(!data.comments || data.comments.length === 0) && (
                <div className="flex flex-col items-center justify-center text-center py-20">
                  <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-[#ef7f1b]" />
                  </div>

                  <h3 className="text-sm font-bold text-black">
                    No Comments Yet
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Start the discussion on this pitch.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* INPUT */}

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !commenting) {
                    handleComment();
                  }
                }}
              />

              <Button
                onClick={handleComment}
                disabled={commenting || !comment.trim()}
                className="
                  bg-[#ef7f1b]
                  hover:bg-[#d66e15]
                  text-white
                  rounded-xl
                  shrink-0
                "
              >
                {commenting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
