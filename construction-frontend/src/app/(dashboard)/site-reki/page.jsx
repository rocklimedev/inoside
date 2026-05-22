"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MapPin, Trash2 } from "lucide-react";
import { useCreateRekiMutation } from "@/api/projectsApi";
import SiteRekiForm from "@/components/site-reki/SiteRekiForm";
import SiteRekiDocument from "@/components/site-reki/SiteRekiDocument";
import SiteRekiClientView from "@/components/site-reki/SiteRekiClientView";

export default function SiteRekiPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [activeRekiId, setActiveRekiId] = useState(null);
  const [mode, setMode] = useState("list");

  const [createReki] = useCreateRekiMutation();

  const handleCreate = async () => {
    try {
      const result = await createReki({
        project: { name: "Untitled Project" },
        status: "draft",
      }).unwrap();

      setItems((prev) => [result, ...prev]);
      setActiveRekiId(result.id);
      setMode("form");
      toast.success("Site Reki created successfully");
    } catch (err) {
      console.error("Create Reki Error:", err);
      console.error("Error Data:", err?.data);

      // TEMPORARY BYPASS - Open form even if creation fails (for debugging)
      const tempId = "temp-" + Date.now();
      const tempItem = {
        id: tempId,
        project: { name: "Untitled Project" },
        status: "draft",
        photos: [],
      };

      setItems((prev) => [tempItem, ...prev]);
      setActiveRekiId(tempId);
      setMode("form");

      toast.error("Backend error - Opened form in debug mode");
      toast.info("Fix backend creation issue to remove this bypass");
    }
  };

  const openItem = (item) => {
    setActiveRekiId(item.id);
    if (user?.role === "Client") {
      setMode("client-view");
    } else {
      setMode(item.reki_pdf_url ? "document" : "form");
    }
  };

  const handleBack = () => {
    setActiveRekiId(null);
    setMode("list");
  };

  return (
    <div className="flex flex-col h-full">
      {mode === "list" && (
        <div className="p-4 md:p-6 border-b bg-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black">Site Reki</h1>
            <p className="text-xs text-gray-400">
              {items.length} report{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          {user?.role !== "Client" && (
            <Button
              onClick={handleCreate}
              className="bg-[#ef7f1b] text-white hover:bg-[#d96f0f]"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Site Reki
            </Button>
          )}
        </div>
      )}

      {mode === "list" && (
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  No site reki reports yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => openItem(item)}
                  >
                    <div className="flex justify-between mb-3">
                      <h3 className="font-bold text-sm">
                        {item.project?.name || "Untitled Project"}
                      </h3>
                      <Badge className="bg-gray-100 text-gray-600 text-[10px] border-0">
                        Draft
                      </Badge>
                    </div>
                    <div className="text-[10px] text-gray-400 space-y-1">
                      <p>—</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {activeRekiId && mode === "form" && (
        <SiteRekiForm
          rekiId={activeRekiId}
          onBack={handleBack}
          onGenerated={(d) => {
            setActiveRekiId(d.id);
            setMode("document");
          }}
        />
      )}

      {activeRekiId && mode === "document" && (
        <SiteRekiDocument
          rekiId={activeRekiId}
          onBack={handleBack}
          onEdit={() => setMode("form")}
        />
      )}

      {activeRekiId && mode === "client-view" && (
        <SiteRekiClientView rekiId={activeRekiId} onBack={handleBack} />
      )}
    </div>
  );
}
