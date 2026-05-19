"use client";

import React, { useState, useRef } from "react";
import {
  useAddPitchCommentMutation,
  useReplacePitchFileMutation,
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
} from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PitchDetail({ pitch, user, onBack }) {
  const [addPitchComment, { isLoading: commenting }] =
    useAddPitchCommentMutation();
  const [replacePitchFile, { isLoading: replacing }] =
    useReplacePitchFileMutation();

  const [data, setData] = useState(pitch);
  const [comment, setComment] = useState("");
  const replaceRef = useRef < HTMLInputElement > null;
  const { api } = useAuth();

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await addPitchComment({
        pitchId: data.id,
        content: comment,
      }).unwrap();

      setData((prev) => ({ ...prev, comments: res.comments }));
      setComment("");
      toast.success("Comment added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  const handleReplace = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const ver = data.version || "v1.0";
      const parts = ver.replace("v", "").split(".");
      const newVer = `v${parts[0]}.${parseInt(parts[1] || "0") + 1}`;

      await replacePitchFile({
        pitchId: data.id,
        file_id: uploadRes.data.file_id,
        filename: file.name,
        file_url: uploadRes.data.url,
        file_size: uploadRes.data.size,
        version: newVer,
      }).unwrap();

      setData((prev) => ({
        ...prev,
        filename: file.name,
        file_url: uploadRes.data.url,
        version: newVer,
      }));

      toast.success("Pitch replaced");
    } catch (err) {
      console.error(err);
      toast.error("Failed to replace pitch");
    }
  };

  const handleDownload = () => {
    if (data.file_url) window.open(`${BACKEND}${data.file_url}`, "_blank");
  };

  const isPdf = data.filename?.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">
                {data.project_name}
              </h1>
              <p className="text-[11px] text-gray-400">Module: Pitch</p>
            </div>
            <Badge className="bg-blue-50 text-blue-600 text-[10px] border-0">
              {data.version}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {user?.role !== "Client" && (
              <>
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
                  size="sm"
                  onClick={() => replaceRef.current?.click()}
                  disabled={replacing}
                >
                  {replacing ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  )}
                  Replace File
                </Button>
              </>
            )}

            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
          {isPdf && data.file_url ? (
            <iframe
              src={`${BACKEND}${data.file_url}`}
              className="w-full h-full rounded-lg border border-gray-200 bg-white"
              title="Pitch Preview"
            />
          ) : (
            <div className="text-center">
              <Presentation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 font-medium">
                {data.filename}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Preview not available for this format
              </p>
            </div>
          )}
        </div>

        {/* Comments Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="flex-1 flex flex-col p-4">
            <h3 className="text-sm font-bold text-black mb-3">Comments</h3>

            <ScrollArea className="flex-1 mb-3">
              <div className="space-y-3">
                {(data.comments || []).map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold">
                      {c.sender?.[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-black">
                        {c.sender}
                      </p>
                      <p className="text-xs text-gray-600">{c.content}</p>
                      <p className="text-[9px] text-gray-400">
                        {new Date(c.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                {(!data.comments || data.comments.length === 0) && (
                  <p className="text-xs text-gray-400">No comments yet</p>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-auto">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add comment..."
                className="flex-1 text-xs"
              />
              <Button
                onClick={handleComment}
                disabled={commenting || !comment.trim()}
                size="sm"
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white px-3"
              >
                {commenting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
