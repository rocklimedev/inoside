"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ArrowLeft, Download, Edit3 } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const STATUS_MAP = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Document Ready", color: "bg-blue-50 text-blue-600" },
  approved: { label: "Approved", color: "bg-green-50 text-green-600" },
  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};
export default function ScopeDocument({ item, user, onBack, onEdit }) {
  const st = STATUS_MAP[item.status] || STATUS_MAP.draft;

  const handleDownload = () => {
    if (item.scope_pdf_url) {
      window.open(`${BACKEND}${item.scope_pdf_url}`, "_blank");
    } else {
      toast.error("PDF not available yet");
    }
  };

  const sections = [
    { title: "Scope Summary", value: item.scope_summary },
    {
      title: "Civil Works",
      value: item.civil_works ? JSON.stringify(item.civil_works, null, 2) : "—",
    },
    {
      title: "MEP Works",
      value: item.mep_works ? JSON.stringify(item.mep_works, null, 2) : "—",
    },
    {
      title: "Interior Works",
      value: item.interior_works
        ? JSON.stringify(item.interior_works, null, 2)
        : "—",
    },
    {
      title: "Finishes",
      value: item.finishes ? JSON.stringify(item.finishes, null, 2) : "—",
    },
    {
      title: "Area Summary",
      value: item.area_summary
        ? JSON.stringify(item.area_summary, null, 2)
        : "—",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold">Scope Of Work</h1>
              <p className="text-[11px] text-gray-400">Generated Document</p>
            </div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>
              {st.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {user?.role !== "Client" && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <h2 className="text-2xl font-bold">Scope Of Work</h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="p-8 space-y-8">
              {sections.map((s, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-3">
                    {i + 1}. {s.title}
                  </h3>
                  <pre className="text-sm text-black whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-lg">
                    {s.value || "—"}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
