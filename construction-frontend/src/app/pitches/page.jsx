"use client";

import React, { useState, useRef } from "react";
import {
  useGetAllPitchesQuery,
  useCreatePitchGlobalMutation,
  useDeletePitchMutation,
  useAddPitchCommentMutation,
  useReplacePitchFileMutation,
} from "@/api/projectsApi";

import { useAuth } from "@/contexts/AuthContext";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

import { toast } from "sonner";

import {
  Plus,
  Upload,
  Download,
  Send,
  ArrowLeft,
  Loader2,
  RefreshCw,
  File,
  Presentation,
  X,
  Trash2,
} from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
const ALLOWED_TYPES = [".pdf", ".ppt", ".pptx", ".key"];

export default function PitchPage() {
  const { api, user } = useAuth();

  const { data: pitches = [], isLoading, refetch } = useGetAllPitchesQuery();

  const [deletePitch] = useDeletePitchMutation();

  const [activePitch, setActivePitch] = useState(null);
  const [mode, setMode] = useState("list");
  const [showNewDialog, setShowNewDialog] = useState(false);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (mode === "detail" && activePitch) {
    return (
      <PitchDetail
        pitch={activePitch}
        user={user}
        api={api}
        onBack={() => {
          setMode("list");
          refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-black">Pitch</h1>

            <p className="text-xs text-gray-400 mt-1">
              {pitches.length} pitch{pitches.length !== 1 ? "es" : ""}
            </p>
          </div>

          {user?.role !== "Client" && (
            <Button
              onClick={() => setShowNewDialog(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Upload Pitch
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {pitches.length === 0 ? (
            <div className="text-center py-20">
              <Presentation className="w-12 h-12 text-gray-200 mx-auto mb-3" />

              <p className="text-sm text-gray-400">No pitches uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pitches.map((p, i) => (
                <Card
                  key={p.id}
                  className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group"
                  onClick={() => {
                    setActivePitch(p);
                    setMode("detail");
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#ef7f1b] flex items-center justify-center">
                      <Presentation className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-50 text-blue-600 text-[10px] border-0">
                        {p.version || "v1.0"}
                      </Badge>

                      {user?.role !== "Client" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-black">
                    {p.project_name}
                  </h3>

                  <p className="text-[11px] text-gray-400 mt-1">{p.filename}</p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
                    <span>By {p.uploaded_by}</span>

                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Upload Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Pitch</DialogTitle>
          </DialogHeader>

          <UploadArea
            api={api}
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

function UploadArea({ api, onUploaded }) {
  const [createPitchGlobal, { isLoading }] = useCreatePitchGlobalMutation();

  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  const handleFile = (f) => {
    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();

    if (!ALLOWED_TYPES.includes(ext)) {
      toast.error("Supported formats: PDF, PPT, PPTX, Keynote");
      return;
    }

    setFile(f);
  };

  const handleUpload = async () => {
    if (!projectName.trim()) {
      toast.error("Project name required");
      return;
    }

    if (!file) {
      toast.error("Select a file");
      return;
    }

    try {
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 200);

      const uploadRes = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(interval);

      setProgress(95);

      await createPitchGlobal({
        project_name: projectName,
        file_id: uploadRes.data.file_id,
        filename: file.name,
        file_url: uploadRes.data.url,
        file_size: uploadRes.data.size,
      }).unwrap();

      setProgress(100);

      toast.success("Pitch uploaded");

      onUploaded();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Project Name *
        </Label>

        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-1"
          placeholder="e.g. Sunrise Villa"
        />
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-[#ef7f1b] bg-orange-50"
            : "border-gray-200 hover:border-[#ef7f1b]/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);

          if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.ppt,.pptx,.key"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <File className="w-8 h-8 text-[#ef7f1b]" />

            <div className="text-left">
              <p className="text-sm font-medium text-black">{file.name}</p>

              <p className="text-[10px] text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />

            <p className="text-sm text-gray-500">Drag & drop your file here</p>

            <p className="text-[10px] text-gray-400 mt-1">
              PDF, PPT, PPTX, Keynote
            </p>
          </>
        )}
      </div>

      {isLoading && (
        <div className="space-y-1">
          <Progress value={progress} className="h-1.5" />

          <p className="text-[10px] text-gray-400 text-center">
            {progress}% uploaded
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={isLoading}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Upload className="w-4 h-4 mr-1" />
          )}
          Upload Pitch
        </Button>
      </div>
    </div>
  );
}

function PitchDetail({ pitch, user, api, onBack }) {
  const [addPitchComment, { isLoading: commenting }] =
    useAddPitchCommentMutation();

  const [replacePitchFile, { isLoading: replacing }] =
    useReplacePitchFileMutation();

  const [data, setData] = useState(pitch);
  const [comment, setComment] = useState("");

  const replaceRef = useRef(null);

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

  const handleReplace = async (file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      const uploadRes = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const ver = data.version || "v1.0";

      const parts = ver.replace("v", "").split(".");

      const newVer = `v${parts[0]}.${parseInt(parts[1] || 0) + 1}`;

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
    if (data.file_url) {
      window.open(`${BACKEND}${data.file_url}`, "_blank");
    }
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

        {/* Comments */}
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
                disabled={commenting}
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
