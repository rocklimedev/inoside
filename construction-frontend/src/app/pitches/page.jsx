import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Plus,
  Upload,
  FileText,
  Download,
  Eye,
  Send,
  ArrowLeft,
  Loader2,
  Trash2,
  RefreshCw,
  MessageCircle,
  File,
  Presentation,
  X,
} from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const ALLOWED_TYPES = [".pdf", ".ppt", ".pptx", ".key"];

export default function PitchPage() {
  const { api, user } = useAuth();
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePitch, setActivePitch] = useState(null);
  const [mode, setMode] = useState("list");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const res = await api.get("/pitches");
      setPitches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pid) => {
    try {
      await api.delete(`/pitches/${pid}`);
      setPitches((prev) => prev.filter((p) => p.id !== pid));
      if (activePitch?.id === pid) {
        setActivePitch(null);
        setMode("list");
      }
      toast.success("Pitch deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  if (mode === "detail" && activePitch)
    return (
      <PitchDetail
        pitch={activePitch}
        api={api}
        user={user}
        onBack={() => {
          setMode("list");
          fetchPitches();
        }}
      />
    );

  return (
    <div className="flex flex-col h-full" data-testid="pitch-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="pitch-title"
            >
              Pitch
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {pitches.length} pitch{pitches.length !== 1 ? "es" : ""}
            </p>
          </div>
          {user?.role !== "Client" && (
            <Button
              onClick={() => setShowNewDialog(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
              data-testid="new-pitch-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> Upload Pitch
            </Button>
          )}
        </div>
      </div>

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
                  data-testid={`pitch-card-${i}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#ef7f1b] flex items-center justify-center">
                      <Presentation className="w-5 h-5" />
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 text-[10px] border-0">
                      {p.version || "v1.0"}
                    </Badge>
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

      {/* Upload dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-md" data-testid="upload-pitch-dialog">
          <DialogHeader>
            <DialogTitle>Upload Pitch</DialogTitle>
          </DialogHeader>
          <UploadArea
            api={api}
            onUploaded={(pitch) => {
              setPitches((prev) => [...prev, pitch]);
              setShowNewDialog(false);
              toast.success("Pitch uploaded");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UploadArea({ api, onUploaded }) {
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
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
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const interval = setInterval(
        () => setProgress((p) => Math.min(p + 10, 90)),
        200,
      );
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      clearInterval(interval);
      setProgress(95);

      const pitchRes = await api.post("/pitches", {
        project_name: projectName,
        file_id: uploadRes.data.file_id,
        filename: file.name,
        file_url: uploadRes.data.url,
        file_size: uploadRes.data.size,
      });
      setProgress(100);
      onUploaded(pitchRes.data);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
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
          data-testid="pitch-project-name"
        />
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragActive ? "border-[#ef7f1b] bg-orange-50" : "border-gray-200 hover:border-[#ef7f1b]/50"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        data-testid="pitch-drop-zone"
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
              className="text-gray-400 hover:text-[#e31d3b]"
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

      {uploading && (
        <div className="space-y-1">
          <Progress
            value={progress}
            className="h-1.5 bg-gray-100 progress-orange"
          />
          <p className="text-[10px] text-gray-400 text-center">
            {progress}% uploaded
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="pitch-upload-btn"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Upload className="w-4 h-4 mr-1" />
          )}{" "}
          Upload Pitch
        </Button>
      </div>
    </div>
  );
}

function PitchDetail({ pitch, api, user, onBack }) {
  const [data, setData] = useState(pitch);
  const [comment, setComment] = useState("");
  const [replacing, setReplacing] = useState(false);
  const replaceRef = useRef(null);

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/pitches/${data.id}/comments`, {
        content: comment,
      });
      setData((prev) => ({ ...prev, comments: res.data.comments }));
      setComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleReplace = async (file) => {
    setReplacing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const ver = data.version || "v1.0";
      const parts = ver.replace("v", "").split(".");
      const newVer = `v${parts[0]}.${parseInt(parts[1] || 0) + 1}`;
      await api.put(`/pitches/${data.id}`, {
        file_id: uploadRes.data.file_id,
        filename: file.name,
        file_url: uploadRes.data.url,
        file_size: uploadRes.data.size,
        version: newVer,
      });
      setData((prev) => ({
        ...prev,
        filename: file.name,
        file_url: uploadRes.data.url,
        version: newVer,
      }));
      toast.success("Pitch replaced");
    } catch (err) {
      toast.error("Failed to replace");
    } finally {
      setReplacing(false);
    }
  };

  const handleDownload = () => {
    if (data.file_url) window.open(`${BACKEND}${data.file_url}`, "_blank");
  };

  const isPdf = data.filename?.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col h-full" data-testid="pitch-detail">
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
            <Badge className="bg-blue-50 text-blue-600 text-[10px] border-0 ml-2">
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
                  data-testid="pitch-replace-btn"
                >
                  {replacing ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  )}{" "}
                  Replace File
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              data-testid="pitch-download-btn"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download
            </Button>
          </div>
        </div>
      </div>

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
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleDownload}
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download to View
              </Button>
            </div>
          )}
        </div>

        {/* Info & Comments */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-black mb-3">
              Pitch Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Uploaded By
                </p>
                <p className="text-black">{data.uploaded_by}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Upload Date
                </p>
                <p className="text-black">
                  {new Date(data.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Version
                </p>
                <p className="text-black">{data.version}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  File
                </p>
                <p className="text-black text-xs">{data.filename}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-4">
            <h3 className="text-sm font-bold text-black mb-3">Comments</h3>
            <ScrollArea className="flex-1 mb-3">
              <div className="space-y-3">
                {(data.comments || []).map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[9px] font-bold shrink-0">
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
                  <p className="text-xs text-gray-400">No comments</p>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-auto">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add comment..."
                className="flex-1 text-xs"
                data-testid="pitch-comment-input"
              />
              <Button
                onClick={handleComment}
                size="sm"
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white px-3"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
