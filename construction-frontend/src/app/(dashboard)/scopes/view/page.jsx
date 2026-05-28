"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

import { useGetScopeByIdQuery } from "@/api/projects/scopeApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";

import {
  ArrowLeft,
  Download,
  Edit3,
  Loader2,
  AlertCircle,
  Building2,
  User,
  CalendarDays,
  FileText,
  ClipboardList,
} from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const STATUS_MAP = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-600",
  },

  completed: {
    label: "Document Ready",
    color: "bg-blue-50 text-blue-600",
  },

  approved: {
    label: "Approved",
    color: "bg-green-50 text-green-600",
  },

  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};

export default function ScopeDocumentPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { user } = useAuth();

  const scopeId = searchParams.get("scopeId");

  // =====================================================
  // API
  // =====================================================

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useGetScopeByIdQuery(scopeId, {
    skip: !scopeId,
  });

  // =====================================================
  // ACTIONS
  // =====================================================

  const handleDownload = () => {
    if (item?.scope_pdf_url) {
      window.open(`${BACKEND}${item.scope_pdf_url}`, "_blank");
    } else {
      toast.error("PDF not available yet");
    }
  };

  const handleEdit = () => {
    router.push(`/scope/add?id=${item.id}&projectId=${item.project_id}`);
  };

  const handleBack = () => {
    router.back();
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const renderList = (items = []) => {
    if (!items?.length) {
      return (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-400">
          No data available
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {items.map((entry, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-100 bg-gray-50 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#ef7f1b] text-white flex items-center justify-center text-sm font-bold shrink-0">
                {index + 1}
              </div>

              <div className="flex-1">
                <h4 className="text-base font-bold text-black">
                  {entry?.title || `Item ${index + 1}`}
                </h4>

                <p className="text-sm text-gray-600 mt-2 leading-7 whitespace-pre-wrap">
                  {entry?.description || "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#ef7f1b]" />

          <p className="text-sm text-gray-500">Loading Scope Document...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError || !item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[70vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <AlertCircle className="w-10 h-10 text-red-300" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">
          Failed to Load Scope
        </h2>

        <p className="text-gray-500 mb-8 max-w-md">
          Could not fetch the scope document. It may have been deleted or you
          don’t have access.
        </p>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>

          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const st = STATUS_MAP[item?.status] || STATUS_MAP.draft;

  const sections = [
    {
      title: "Scope Summary",
      icon: FileText,
      type: "text",
      value: item?.scope_summary,
    },

    {
      title: "Civil Works",
      icon: ClipboardList,
      type: "list",
      value: item?.civil_works || [],
    },

    {
      title: "MEP Works",
      icon: ClipboardList,
      type: "list",
      value: item?.mep_works || [],
    },

    {
      title: "Interior Works",
      icon: ClipboardList,
      type: "list",
      value: item?.interior_works || [],
    },

    {
      title: "Finishes",
      icon: ClipboardList,
      type: "list",
      value: item?.finishes || [],
    },

    {
      title: "Area Summary",
      icon: ClipboardList,
      type: "list",
      value: item?.area_summary || [],
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* HEADER */}

      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-black text-black">
                  {item?.project?.name || "Untitled Project"}
                </h1>

                <Badge className={`${st.color} text-[10px] border-0`}>
                  {st.label}
                </Badge>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                Scope Of Work Document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.role !== "Client" && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
          {/* TOP CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-[#ef7f1b]" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    Project
                  </p>

                  <h3 className="text-base font-bold text-black mt-1">
                    {item?.project?.name || "N/A"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {item?.project?.current_stage || "No Stage"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-[#ef7f1b]" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    Client
                  </p>

                  <h3 className="text-base font-bold text-black mt-1">
                    {item?.project?.client?.name || "N/A"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 break-all">
                    {item?.project?.client?.email || "No Email"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-6 h-6 text-[#ef7f1b]" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    Created On
                  </p>

                  <h3 className="text-base font-bold text-black mt-1">
                    {new Date(item.created_at).toLocaleDateString("en-IN")}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Progress: {item?.project?.progress_percentage || 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* DOCUMENT */}

          <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
            {/* HERO */}

            <div className="p-8 md:p-10 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
              <div className="max-w-3xl">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-lg font-black text-black">BUILD</span>

                  <span className="text-lg font-black text-[#ef7f1b]">CON</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-black">
                  Scope Of Work
                </h2>

                <p className="mt-4 text-gray-600 leading-8">
                  Detailed scope document including civil works, MEP systems,
                  interior specifications, finishes, and area summaries for the
                  project.
                </p>
              </div>
            </div>

            {/* BODY */}

            <div className="p-6 md:p-10 space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <div key={index}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-11 h-11 rounded-2xl bg-[#ef7f1b] text-white flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Section {index + 1}
                        </p>

                        <h3 className="text-xl font-bold text-black">
                          {section.title}
                        </h3>
                      </div>
                    </div>

                    {section.type === "text" ? (
                      <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                        <p className="text-sm text-gray-700 leading-8 whitespace-pre-wrap">
                          {section.value || "—"}
                        </p>
                      </div>
                    ) : (
                      renderList(section.value)
                    )}
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}

            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">
                Generated by BUILDCON • Confidential Scope Document
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
