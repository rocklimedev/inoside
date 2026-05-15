"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Download, Send, Loader2, Edit3 } from "lucide-react";
import { toast } from "sonner";

// RTK Query
import { useSendBriefMutation } from "@/api/projectsApi"; // Adjust import path

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

export default function BriefDocument({
  brief,
  projectId,
  user,
  onBack,
  onEdit,
}) {
  const [data, setData] = useState(brief);
  const [sendBrief, { isLoading: sending }] = useSendBriefMutation();

  // Sync data when brief prop updates
  useEffect(() => {
    if (brief) setData(brief);
  }, [brief]);

  const handleDownload = () => {
    if (data?.document_url) {
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${data.document_url}`;
      window.open(fullUrl, "_blank");
    } else {
      toast.error("Document not available yet");
    }
  };

  const handleSend = async () => {
    if (!data?.id) {
      toast.error("Brief ID not found");
      return;
    }

    try {
      await sendBrief(data.id).unwrap();

      setData((prev) => ({ ...prev, status: "sent_to_client" }));
      toast.success("Brief sent to client successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to send brief");
    }
  };

  const st = STATUS_MAP[data?.status] || STATUS_MAP.draft;

  const docSections = [
    {
      title: "Client Information",
      fields: [
        ["Client Name", data.client_name],
        ["Phone", data.client_phone],
        ["Email", data.client_email],
        ["Location", data.client_location],
        ["Communication", data.comm_preference],
      ],
    },
    {
      title: "Project Overview",
      fields: [
        ["Project Type", data.project_type],
        ["Address", data.project_address],
        ["Area", data.project_area],
        ["Timeline", data.timeline_expectations],
      ],
    },
    {
      title: "Client Lifestyle & Needs",
      fields: [
        ["Family Members", data.family_members],
        ["Usage Requirements", data.usage_requirements],
        ["Special Needs", data.special_needs],
        ["Future Expansion", data.future_expansion],
      ],
    },
    {
      title: "Design Preferences",
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
        ["Priority Areas", data.priority_areas],
        ["Optimization Areas", data.cost_optimization_areas],
      ],
    },
    {
      title: "References & Inspirations",
      fields: [
        ["Reference Links", data.reference_links],
        ["Likes", data.client_likes],
        ["Dislikes", data.client_dislikes],
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full" data-testid="brief-document">
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
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              data-testid="brief-edit-btn"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Form
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              data-testid="brief-download-btn"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
            </Button>

            <Button
              size="sm"
              onClick={handleSend}
              disabled={sending || data.status === "sent_to_client"}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              data-testid="brief-share-btn"
            >
              {sending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1" />
              )}
              Share with Client
            </Button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>
              <h2 className="text-2xl font-bold text-black mt-4">
                Project Brief Document
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {data.project_name} •{" "}
                {new Date(data.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {docSections.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                    {i + 1}. {sec.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {sec.fields.map(([label, value], j) => (
                      <div key={j} className={!value ? "opacity-40" : ""}>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                          {label}
                        </p>
                        <p className="text-sm text-black mt-0.5 break-words">
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">
                Generated by BUILDCON • Confidential Document
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
