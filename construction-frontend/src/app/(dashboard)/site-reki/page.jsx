"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MapPin } from "lucide-react";

import { useGetProjectsQuery } from "@/api/projectsApi";

import SiteRekiForm from "@/components/site-reki/SiteRekiForm";
import SiteRekiDocument from "@/components/site-reki/SiteRekiDocument";
import SiteRekiClientView from "@/components/site-reki/SiteRekiClientView";

export default function SiteRekiPage() {
  const { user } = useAuth();
  const { data: projects = [] } = useGetProjectsQuery();

  const [items] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [mode, setMode] = useState("list");

  /* ================= OPEN FORM (NO API CALL) ================= */
  const handleNew = () => {
    if (!projects.length) {
      toast.error("No projects available");
      return;
    }

    setActiveProjectId(null);
    setMode("form");
  };

  const openItem = (item) => {
    setActiveProjectId(item.project_id);

    if (user?.role === "Client") {
      setMode("client");
    } else {
      setMode(item.reki_pdf_url ? "document" : "form");
    }
  };

  const handleBack = () => {
    setActiveProjectId(null);
    setMode("list");
  };

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      {mode === "list" && (
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black">Site Reki</h1>
            <p className="text-xs text-gray-400">
              {items.length} report{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          {user?.role !== "Client" && (
            <Button
              className="bg-[#ef7f1b] hover:bg-[#d96f0f] text-white"
              size="sm"
              onClick={handleNew}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Site Reki
            </Button>
          )}
        </div>
      )}

      {/* LIST */}
      {mode === "list" && (
        <ScrollArea className="flex-1">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.length === 0 ? (
              <div className="text-center py-20 col-span-full">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  No site reki reports yet.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 cursor-pointer hover:shadow-lg"
                  onClick={() => openItem(item)}
                >
                  <h3 className="font-bold text-sm">
                    {item.project?.name || "Untitled Project"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Project ID: {item.project_id}
                  </p>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      )}

      {/* FORM */}
      {mode === "form" && (
        <SiteRekiForm
          projectId={activeProjectId}
          onBack={handleBack}
          onGenerated={(data) => {
            setActiveProjectId(data.project_id);
            setMode("document");
          }}
        />
      )}

      {/* DOCUMENT */}
      {mode === "document" && activeProjectId && (
        <SiteRekiDocument
          rekiId={activeProjectId}
          onBack={handleBack}
          onEdit={() => setMode("form")}
        />
      )}

      {/* CLIENT VIEW */}
      {mode === "client" && activeProjectId && (
        <SiteRekiClientView rekiId={activeProjectId} onBack={handleBack} />
      )}
    </div>
  );
}
