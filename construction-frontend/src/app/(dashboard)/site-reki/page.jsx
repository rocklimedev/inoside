"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Plus,
  MapPin,
  FileText,
  Calendar,
  Building2,
  User2,
} from "lucide-react";

import {
  useGetProjectsQuery,
  useGetAllRekiReportsQuery,
} from "@/api/projectsApi";

import SiteRekiForm from "@/components/site-reki/SiteRekiForm";
import SiteRekiDocument from "@/components/site-reki/SiteRekiDocument";
import SiteRekiClientView from "@/components/site-reki/SiteRekiClientView";

export default function SiteRekiPage() {
  const { user } = useAuth();

  const { data: projects = [] } = useGetProjectsQuery();

  // API RETURNS ARRAY DIRECTLY
  const {
    data: rekiReports = [],
    isLoading,
    refetch,
  } = useGetAllRekiReportsQuery();

  const [activeProjectId, setActiveProjectId] = useState(null);

  const [activeRekiId, setActiveRekiId] = useState(null);

  const [mode, setMode] = useState("list");

  // =================================================
  // CREATE NEW
  // =================================================

  const handleNew = () => {
    if (!projects.length) {
      toast.error("No projects available");
      return;
    }

    setActiveProjectId(null);
    setActiveRekiId(null);

    setMode("form");
  };

  // =================================================
  // OPEN EXISTING
  // =================================================

  const openItem = (item) => {
    // PROJECT ID
    setActiveProjectId(item.project_id);

    // REKI ID
    setActiveRekiId(item.id);

    // CLIENT VIEW
    if (user?.role === "Client") {
      setMode("client");
      return;
    }

    // PDF GENERATED
    if (item.reki_pdf_url) {
      setMode("document");
    } else {
      setMode("form");
    }
  };

  // =================================================
  // BACK
  // =================================================

  const handleBack = () => {
    setActiveProjectId(null);
    setActiveRekiId(null);

    setMode("list");

    // REFRESH
    refetch();
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f8f8]">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      {mode === "list" && (
        <div className="p-5 border-b bg-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#111]">
              Site Reki Reports
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              {rekiReports.length} report
              {rekiReports.length !== 1 ? "s" : ""}
            </p>
          </div>

          {user?.role !== "Client" && (
            <Button
              onClick={handleNew}
              className="bg-[#ef7f1b] hover:bg-[#d96f0f] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Site Reki
            </Button>
          )}
        </div>
      )}

      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      {mode === "list" && (
        <ScrollArea className="flex-1">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* ================================================= */}
            {/* LOADING */}
            {/* ================================================= */}

            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="p-5 border-0 shadow-sm animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded mb-4" />

                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </Card>
              ))}

            {/* ================================================= */}
            {/* EMPTY */}
            {/* ================================================= */}

            {!isLoading && rekiReports.length === 0 && (
              <div className="col-span-full text-center py-24">
                <MapPin className="w-14 h-14 text-gray-200 mx-auto mb-4" />

                <h2 className="text-lg font-bold text-gray-700">
                  No Site Reki Reports
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Create your first site reki report.
                </p>
              </div>
            )}

            {/* ================================================= */}
            {/* ITEMS */}
            {/* ================================================= */}

            {!isLoading &&
              rekiReports.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => openItem(item)}
                  className="p-5 border-0 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer bg-white"
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[15px] text-[#111] line-clamp-1">
                        {item.project?.name || "Untitled Project"}
                      </h3>

                      {/* CLIENT */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <User2 className="w-3 h-3" />

                        <span className="line-clamp-1">
                          {item.project?.client?.name || "No Client"}
                        </span>
                      </div>

                      {/* PROJECT ID */}
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Building2 className="w-3 h-3" />

                        <span className="line-clamp-1">{item.project_id}</span>
                      </div>
                    </div>

                    <div className="bg-orange-100 p-2 rounded-xl shrink-0">
                      <FileText className="w-4 h-4 text-[#ef7f1b]" />
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Client Present</span>

                      <span className="font-medium text-[#111]">
                        {item.client_present ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Existing Structure</span>

                      <span className="font-medium text-[#111]">
                        {item.existing_structure ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Demolition</span>

                      <span className="font-medium text-[#111]">
                        {item.demolition_required ? "Required" : "No"}
                      </span>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-5 pt-4 border-t flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full font-semibold ${
                          item.reki_pdf_url
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.reki_pdf_url ? "Generated" : "Draft"}
                      </span>

                      {/* VIEW LINK */}
                      <Link
                        href={`/site-reki/view?id=${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-semibold text-[#ef7f1b] hover:underline"
                      >
                        View
                      </Link>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                      <Calendar className="w-3 h-3" />

                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </ScrollArea>
      )}

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      {mode === "form" && (
        <SiteRekiForm
          projectId={activeProjectId}
          rekiId={activeRekiId}
          onBack={handleBack}
          onGenerated={(data) => {
            setActiveProjectId(data.project_id);

            setActiveRekiId(data.id);

            setMode("document");
          }}
        />
      )}

      {/* ================================================= */}
      {/* DOCUMENT */}
      {/* ================================================= */}

      {mode === "document" && activeRekiId && (
        <SiteRekiDocument
          rekiId={activeRekiId}
          onBack={handleBack}
          onEdit={() => setMode("form")}
        />
      )}

      {/* ================================================= */}
      {/* CLIENT VIEW */}
      {/* ================================================= */}

      {mode === "client" && activeRekiId && (
        <SiteRekiClientView rekiId={activeRekiId} onBack={handleBack} />
      )}
    </div>
  );
}
