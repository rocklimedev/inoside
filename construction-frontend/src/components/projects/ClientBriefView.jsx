"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// RTK Query Hooks
import {
  useApproveBriefMutation,
  useRequestBriefChangesMutation,
  useAddBriefCommentMutation,
} from "@/api/projectsApi"; // Adjust import path

const STATUS_MAP = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Document Ready", color: "bg-blue-50 text-blue-600" },
  sent_to_client: {
    label: "Sent to Client",
    color: "bg-orange-50 text-[#ef7f1b]",
  },
  approved: { label: "Approved", color: "bg-green-50 text-green-600" },
  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};

export default function ClientBriefView({ brief, projectId, user, onBack }) {
  const [data, setData] = useState(brief);
  const [comment, setComment] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [showChangesDialog, setShowChangesDialog] = useState(false);

  // RTK Query Mutations
  const [approveBrief, { isLoading: approving }] = useApproveBriefMutation();
  const [requestChanges, { isLoading: requesting }] =
    useRequestBriefChangesMutation();
  const [addComment, { isLoading: commenting }] = useAddBriefCommentMutation();

  // Sync data when brief prop updates
  useEffect(() => {
    if (brief) setData(brief);
  }, [brief]);

  const handleApprove = async () => {
    if (!data?.id) return;

    try {
      await approveBrief(data.id).unwrap();
      setData((prev) => ({ ...prev, status: "approved" }));
      toast.success("Brief approved successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve brief");
    }
  };

  const handleRequestChanges = async () => {
    if (!data?.id) return;
    if (!changeNote.trim()) {
      toast.error("Please describe the changes");
      return;
    }

    try {
      await requestChanges({
        briefId: data.id,
        note: changeNote,
      }).unwrap();

      setData((prev) => ({ ...prev, status: "changes_requested" }));
      setShowChangesDialog(false);
      setChangeNote("");
      toast.success("Change request submitted");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit change request");
    }
  };

  const handleComment = async () => {
    if (!data?.id || !comment.trim()) return;

    try {
      const res = await addComment({
        briefId: data.id,
        content: comment,
      }).unwrap();

      setData((prev) => ({ ...prev, comments: res.comments || prev.comments }));
      setComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleDownload = () => {
    if (data?.document_url) {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      window.open(`${baseUrl}${data.document_url}`, "_blank");
    } else {
      toast.error("Document not available");
    }
  };

  const st = STATUS_MAP[data?.status] || STATUS_MAP.draft;

  const viewSections = [
    {
      title: "Project Overview",
      fields: [
        ["Type", data.project_type],
        ["Area", data.project_area],
        ["Address", data.project_address],
        ["Timeline", data.timeline_expectations],
      ],
    },
    {
      title: "Requirements",
      fields: [
        ["Family", data.family_members],
        ["Usage", data.usage_requirements],
        ["Special Needs", data.special_needs],
        ["Expansion", data.future_expansion],
      ],
    },
    {
      title: "Preferences",
      fields: [
        ["Style", data.design_style],
        ["Materials", data.material_preferences],
        ["Lighting", data.lighting_preference],
        ["Colors", data.color_preferences],
      ],
    },
    {
      title: "Budget Understanding",
      fields: [
        ["Range", data.budget_range],
        ["Flexibility", data.budget_flexibility],
        ["Priorities", data.priority_areas],
        ["Optimization", data.cost_optimization_areas],
      ],
    },
    {
      title: "References",
      fields: [
        ["Links", data.reference_links],
        ["Likes", data.client_likes],
        ["Dislikes", data.client_dislikes],
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full" data-testid="brief-client-view">
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
              <p className="text-[11px] text-gray-400">Brief Document</p>
            </div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>
              {st.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {data.document_url && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </Button>
            )}

            {data.status !== "approved" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChangesDialog(true)}
                  className="text-[#e31d3b] border-red-200"
                  data-testid="brief-request-changes-btn"
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> Request Changes
                </Button>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="brief-approve-btn"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {approving ? "Approving..." : "Approve Brief"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          {/* Document */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>
              <h2 className="text-2xl font-bold text-black mt-4">
                Project Brief
              </h2>
              <p className="text-sm text-gray-500 mt-1">{data.project_name}</p>
            </div>

            <div className="p-8 space-y-8">
              {viewSections.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                    {sec.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {sec.fields.map(([label, value], j) =>
                      value ? (
                        <div key={j}>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                            {label}
                          </p>
                          <p className="text-sm text-black mt-0.5">{value}</p>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-black mb-4">Comments</h3>
            <div className="space-y-3 mb-4">
              {(data.comments || []).map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {c.sender?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-black">
                      {c.sender}{" "}
                      <span className="text-gray-400 font-normal">
                        {new Date(c.timestamp).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}
              {(!data.comments || data.comments.length === 0) && (
                <p className="text-xs text-gray-400">No comments yet</p>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
                data-testid="brief-comment-input"
              />
              <Button
                onClick={handleComment}
                disabled={commenting || !comment.trim()}
                size="sm"
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                data-testid="brief-comment-submit"
              >
                {commenting ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Request Changes Dialog */}
      <Dialog open={showChangesDialog} onOpenChange={setShowChangesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
          </DialogHeader>
          <Textarea
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            placeholder="Describe what changes you'd like..."
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowChangesDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestChanges}
              disabled={requesting}
              className="bg-[#e31d3b] hover:bg-[#c41830] text-white"
            >
              {requesting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
