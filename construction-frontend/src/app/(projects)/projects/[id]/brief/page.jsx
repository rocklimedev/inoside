"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Plus, FileText, Trash2, ArrowLeft, Pencil } from "lucide-react";

import { toast } from "sonner";

import BriefForm from "@/components/projects/BriefForm";
import BriefDocument from "@/components/projects/BriefDocument";
import ClientBriefView from "@/components/projects/ClientBriefView";

// RTK Query Hooks
import {
  useGetBriefQuery,
  useCreateBriefMutation,
  useDeleteProjectBriefMutation, // You'll need to add this if not present
} from "@/api/projectsApi"; // Adjust path as needed

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

export default function BriefPage() {
  const { id: projectId } = useParams();
  const { user } = useAuth(); // `api` is no longer needed for these calls

  const [mode, setMode] = useState("client-view");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // ================= RTK QUERY =================
  const {
    data: brief,
    isLoading: loading,
    refetch: refetchBrief,
  } = useGetBriefQuery(projectId, {
    skip: !projectId,
  });

  const [createBrief] = useCreateBriefMutation();
  const [deleteBrief] = useDeleteProjectBriefMutation(); // Make sure this mutation exists

  // Auto mode switch
  useEffect(() => {
    if (brief) {
      // Change this logic if client should see client-view
      setMode("document");
    } else {
      setMode("form");
    }
  }, [brief]);

  // ================= CREATE BRIEF =================
  const handleCreateBrief = async () => {
    if (!newProjectName.trim()) {
      toast.error("Project name required");
      return;
    }

    try {
      await createBrief({
        projectId: projectId,
        project_name: newProjectName,
      }).unwrap();

      toast.success("Brief created successfully");
      setShowNewDialog(false);
      setNewProjectName("");
      refetchBrief();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create brief");
    }
  };

  // ================= DELETE BRIEF =================
  const handleDelete = async () => {
    const confirmed = confirm("Delete this brief?");

    if (!confirmed) return;

    try {
      await deleteBrief(projectId).unwrap();
      toast.success("Brief deleted");
      refetchBrief();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete brief");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  // ================= FORM VIEW =================
  if (mode === "form") {
    return (
      <BriefForm
        projectId={projectId}
        brief={brief}
        user={user}
        onBack={() => window.history.back()}
        onGenerated={refetchBrief}
      />
    );
  }

  // ================= DOCUMENT VIEW =================
  if (mode === "document" && brief) {
    return (
      <BriefDocument
        projectId={projectId}
        brief={brief}
        user={user}
        onBack={() => window.history.back()}
        onEdit={() => setMode("form")}
      />
    );
  }

  // ================= CLIENT VIEW =================
  if (mode === "client-view" && brief) {
    return (
      <ClientBriefView
        projectId={projectId}
        brief={brief}
        user={user}
        onBack={() => window.history.back()}
      />
    );
  }

  // ================= EMPTY STATE =================
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[70vh]">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <FileText className="w-10 h-10 text-gray-300" />
      </div>

      <h2 className="text-2xl font-bold text-black mb-2">
        No Brief Created Yet
      </h2>

      <p className="text-gray-500 mb-8 text-center max-w-md">
        Create a project brief to organize project scope, requirements,
        timelines, and client expectations.
      </p>

      <Button
        onClick={() => setShowNewDialog(true)}
        className="bg-[#ef7f1b] hover:bg-[#d66e15]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Brief
      </Button>

      {/* ================= CREATE DIALOG ================= */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Project Brief</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Brief / Project Name *
            </label>

            <input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#ef7f1b]"
              placeholder="e.g. Sunrise Villa Project"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleCreateBrief}
              className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            >
              Create Brief
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
