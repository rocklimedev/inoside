"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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

export default function PitchDetail({ pitch, onBack }) {
  const router = useRouter();

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
      toast.success("Comment added successfully");
    } catch (err) {
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

      toast.success("Pitch file replaced successfully");
    } catch (err) {
      toast.error("Failed to replace pitch file");
    }
  };

  const handleDownload = () => {
    if (data.file_url) {
      window.open(data.file_url, "_blank");
    } else {
      toast.error("No file available to download");
    }
  };

  const fileUrl = data.file_url || data.pitch_pdf_url || "";
  const fileName = data.filename || fileUrl?.split("/").pop() || "Pitch_File";
  const projectName =
    data.project_name || data.project?.name || "Untitled Project";
  const uploadedBy = data.uploaded_by || data.createdByUser?.name || "Unknown";
  const isPdf = fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-all"
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
              <p className="text-sm text-gray-500">
                Project Pitch Presentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Replace File - Only for non-clients */}
            <input
              ref={replaceRef}
              type="file"
              accept=".pdf,.ppt,.pptx,.key"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleReplace(e.target.files[0])
              }
            />

            <Button
              variant="outline"
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

            <Button
              onClick={handleDownload}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* PREVIEW AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Info Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">File</p>
                  <p className="text-sm font-medium truncate">{fileName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <User2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Uploaded By</p>
                  <p className="text-sm font-medium">{uploadedBy}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(data.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Luxury Level</p>
                  <p className="text-sm font-medium">
                    {data.luxury_level || "Not Set"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Badge
                className={`rounded-full border-0 ${
                  data.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : data.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : data.status === "Pending Review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                }`}
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

          {/* Preview */}
          <div className="flex-1 bg-gray-100 p-6 overflow-hidden">
            {isPdf && fileUrl ? (
              <iframe
                src={fileUrl}
                className="w-full h-full rounded-xl border border-gray-200 bg-white shadow-sm"
                title="Pitch Preview"
              />
            ) : (
              <div className="w-full h-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-center p-10">
                <Presentation className="w-20 h-20 text-gray-300 mb-6" />
                <h3 className="text-xl font-bold text-black">
                  Preview Not Available
                </h3>
                <p className="text-gray-500 mt-2">
                  This file cannot be previewed inline.
                </p>
                <Button
                  onClick={handleDownload}
                  className="mt-6 bg-[#ef7f1b] hover:bg-[#d66e15]"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* COMMENTS SIDEBAR */}
        <div className="w-[380px] border-l border-gray-200 bg-white flex flex-col">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Discussion</h3>
              <Badge variant="secondary">{data.comments?.length || 0}</Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 p-5">
            {(data.comments || []).length > 0 ? (
              <div className="space-y-5">
                {data.comments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-[#ef7f1b] flex items-center justify-center font-bold text-sm shrink-0">
                      {c.sender?.[0] || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl px-4 py-3">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold">{c.sender}</span>
                          <span className="text-gray-400">
                            {new Date(c.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-[#ef7f1b]" />
                </div>
                <h4 className="font-semibold">No comments yet</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first to start the discussion.
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Comment Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <Button
                onClick={handleComment}
                disabled={commenting || !comment.trim()}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] rounded-xl"
              >
                {commenting ? (
                  <Loader2 className="animate-spin" />
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
