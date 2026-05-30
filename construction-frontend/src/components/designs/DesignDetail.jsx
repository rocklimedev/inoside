"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Icons
import {
  ArrowLeft,
  History,
  CheckCircle,
  Download,
  RefreshCw,
  FileText,
  Check,
  X,
  MessageCircle,
  Lock,
  AlertCircle,
} from "lucide-react";

// Hooks
import {
  useGetDesignQuery,
  useAddCommentMutation,
  useApproveDesignMutation,
  useReviseDesignMutation,
} from "@/api/projects/drawingsApi"; // Adjust path if needed

// Constants
import { BACKEND } from "@/lib";

const STATUS_BADGE = {
  pending: { label: "Pending Review", color: "bg-yellow-50 text-yellow-700" },
  pending_review: {
    label: "Pending Review",
    color: "bg-yellow-50 text-yellow-700",
  },
  approved: { label: "Approved", color: "bg-green-50 text-green-700" },
  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};

function DesignDetail({ designId, user, onBack }) {
  const { data: design, isLoading } = useGetDesignQuery(designId);

  const [addComment, { isLoading: commenting }] = useAddCommentMutation();
  const [approveDesign, { isLoading: approving }] = useApproveDesignMutation();
  const [reviseDesign, { isLoading: revising }] = useReviseDesignMutation();

  const [comment, setComment] = useState("");
  const [remarks, setRemarks] = useState("");
  const [showRevisions, setShowRevisions] = useState(false);
  const [showApprovalLog, setShowApprovalLog] = useState(false);

  const fileInputRef = useRef < HTMLInputElement > null;

  // Handle Add Comment
  const handleComment = async () => {
    if (!comment.trim() || !design) return;

    try {
      await addComment({
        designId: design.id,
        content: comment,
      }).unwrap();

      setComment("");
      toast.success("Comment added successfully");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  // Handle Approve or Request Changes
  const handleApprove = async (status) => {
    if (!design) return;

    try {
      await approveDesign({
        designId: design.id,
        status,
        remarks: remarks.trim(),
      }).unwrap();

      toast.success(
        status === "approved"
          ? "Design approved successfully"
          : "Changes requested successfully",
      );
      setRemarks("");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  // Handle Revision Upload
  const handleRevise = async (file) => {
    if (!design) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);

    try {
      await reviseDesign({
        designId: design.id,
        body: formData,
      }).unwrap();

      toast.success("New revision uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload revision");
    }
  };

  const handleDownload = () => {
    if (design?.file_url) {
      window.open(`${BACKEND}${design.file_url}`, "_blank");
    } else {
      toast.error("No file available for download");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Loading design details...</p>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Design not found</p>
      </div>
    );
  }

  const statusInfo =
    STATUS_BADGE[design.approval_status] || STATUS_BADGE.pending;
  const isPdf = design.filename?.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col h-full" data-testid="design-detail">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">{design.title}</h1>
              <p className="text-[11px] text-gray-400">
                {design.category} • {design.version}
              </p>
            </div>
            <Badge className={`${statusInfo.color} text-[10px] border-0 ml-2`}>
              {statusInfo.label}
            </Badge>
            {design.locked && (
              <Badge className="bg-green-50 text-green-700 text-[10px] border-0">
                <Lock className="w-3 h-3 mr-1" /> Locked
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRevisions(true)}
            >
              <History className="w-3.5 h-3.5 mr-1" />
              Revisions
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApprovalLog(true)}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Approvals
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Download
            </Button>

            {user?.role !== "Client" && !design.locked && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleRevise(file);
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={revising}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  {revising ? "Uploading..." : "Revise"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left - Preview */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 overflow-auto">
          {isPdf && design.file_url ? (
            <iframe
              src={`${BACKEND}${design.file_url}`}
              className="w-full h-full max-h-full rounded-lg border border-gray-200 bg-white shadow-sm"
              title="Design Preview"
            />
          ) : (
            <div className="text-center">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {design.filename || "No file"}
              </p>
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          {/* Approval Section */}
          {design.approval_status !== "approved" && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xs font-bold text-black mb-2">
                Review & Decision
              </h3>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks (optional)..."
                rows={3}
                className="mb-3 text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove("approved")}
                  disabled={approving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleApprove("changes_requested")}
                  disabled={approving}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Request Changes
                </Button>
              </div>
            </div>
          )}

          {/* Design Information */}
          <div className="p-4 border-b border-gray-200 text-sm space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Uploaded By
              </p>
              <p className="text-black">{design.uploaded_by}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Date
              </p>
              <p className="text-black">
                {new Date(design.created_at).toLocaleDateString()}
              </p>
            </div>
            {design.room_area_tag && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Room / Area
                </p>
                <p className="text-black">{design.room_area_tag}</p>
              </div>
            )}
            {design.description && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Description
                </p>
                <p className="text-black text-xs leading-relaxed">
                  {design.description}
                </p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col p-4">
            <h3 className="text-xs font-bold text-black mb-3">Comments</h3>

            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-4">
                {(design.comments || []).length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4">
                    No comments yet
                  </p>
                ) : (
                  (design.comments || []).map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0">
                        {c.sender?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-black">
                          {c.sender}{" "}
                          <span className="text-gray-400">({c.role})</span>
                        </p>
                        <p className="text-xs text-gray-600 break-words">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Add Comment */}
            <div className="flex gap-2 mt-4">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                className="text-sm"
              />
              <Button
                onClick={handleComment}
                disabled={!comment.trim() || commenting}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white px-3"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Revision History Dialog */}
      <Dialog open={showRevisions} onOpenChange={setShowRevisions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Revision History</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-3 py-2">
            {(design.revision_history || []).length === 0 ? (
              <p className="text-xs text-gray-400">No revisions yet</p>
            ) : (
              (design.revision_history || []).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <History className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium">{r.version}</p>
                    <p className="text-[10px] text-gray-400">
                      by {r.revised_by} •{" "}
                      {new Date(r.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Log Dialog */}
      <Dialog open={showApprovalLog} onOpenChange={setShowApprovalLog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approval History</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-3 py-2">
            {(design.approval_log || []).length === 0 ? (
              <p className="text-xs text-gray-400">No approval records yet</p>
            ) : (
              (design.approval_log || []).map((a, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  {a.action === "approved" ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-medium capitalize">{a.action}</p>
                    <p className="text-[10px] text-gray-400">
                      by {a.by} ({a.role}) •{" "}
                      {new Date(a.timestamp).toLocaleString()}
                    </p>
                    {a.remarks && (
                      <p className="text-xs text-gray-600 mt-1">{a.remarks}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DesignDetail;
