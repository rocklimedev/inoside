"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import {
  Upload,
  Eye,
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  FileText,
  MessageCircle,
  Lock,
  Filter,
} from "lucide-react";

import DesignDetail from "@/components/designs/DesignDetail";
import UploadDesignForm from "@/components/designs/UploadDesignForm";

import {
  useGetDrawingsQuery,
  useDeleteDrawingMutation,
} from "@/api/projects/drawingsApi";

import { useGetProjectsQuery } from "@/api/projectsApi";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "All",
  "Interior",
  "Room-wise",
  "Structure",
  "MEP",
  "Walls",
  "Doors",
  "Windows",
  "Lighting",
  "Furniture",
  "Ceiling",
  "Flooring",
  "Elevations",
  "2D Layouts",
  "3D Views",
  "Other",
];

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

export default function DesignPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("project_id");

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [activeDesign, setActiveDesign] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Projects
  const { data: projects = [] } = useGetProjectsQuery();

  const selectedProject = projects.find((p) => p.id === projectId);

  // Drawings (NOW driven by URL)
  const {
    data: designs = [],
    isLoading: designsLoading,
    refetch,
  } = useGetDrawingsQuery(projectId, {
    skip: !projectId,
  });

  const [deleteDrawing] = useDeleteDrawingMutation();

  const filteredDesigns = designs.filter((d) => {
    const matchesCategory =
      activeCategory === "All" || d.category === activeCategory;

    const matchesStatus =
      filterStatus === "all" || d.approval_status === filterStatus;

    const matchesSearch =
      !search || d.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this design?")) return;

    try {
      await deleteDrawing(id).unwrap();
      toast.success("Design deleted successfully");
    } catch {
      toast.error("Failed to delete design");
    }
  };

  // Detail view
  if (activeDesign) {
    return (
      <DesignDetail
        designId={activeDesign.id}
        user={user}
        onBack={() => {
          setActiveDesign(null);
          refetch();
        }}
      />
    );
  }

  // NO PROJECT SELECTED (based on URL now)
  if (!projectId) {
    return (
      <div className="p-6 text-sm text-gray-500">
        No project selected. Please open with a project_id in URL.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:px-6 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={
                () => router.push("/projects/") // remove query param
              }
              className="text-gray-400 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base font-bold">
                {selectedProject?.name || "Project"}
              </h1>
              <p className="text-[11px] text-gray-400">
                {designs.length} drawings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 w-40 text-xs">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="changes_requested">
                  Changes Requested
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {user?.role !== "Client" && (
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15]"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Drawing
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drawings..."
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs rounded-full whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#ef7f1b] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {designsLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
            </div>
          ) : filteredDesigns.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              No drawings found
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDesigns.map((d) => {
                const st =
                  STATUS_BADGE[d.approval_status] || STATUS_BADGE.pending;

                return (
                  <Card
                    key={d.id}
                    onClick={() => setActiveDesign(d)}
                    className="cursor-pointer overflow-hidden"
                  >
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      {d.preview_url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${d.preview_url}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-10 h-10 text-gray-300" />
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-bold truncate">
                          {d.title}
                        </h3>
                        <Badge className={`${st.color} text-[10px]`}>
                          {st.label}
                        </Badge>
                      </div>

                      <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                        <span>
                          {d.uploaded_by?.name || d.uploaded_by?.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {(d.comments || []).length}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDesigns.map((d) => {
                const st =
                  STATUS_BADGE[d.approval_status] || STATUS_BADGE.pending;

                return (
                  <Card
                    key={d.id}
                    onClick={() => setActiveDesign(d)}
                    className="p-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {d.preview_url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${d.preview_url}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-gray-400">{d.category}</p>
                    </div>

                    <Badge className={`${st.color} text-xs`}>{st.label}</Badge>

                    {d.locked && <Lock className="w-4 h-4 text-green-600" />}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Upload */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Drawing</DialogTitle>
          </DialogHeader>

          <UploadDesignForm
            projectId={projectId}
            projectName={selectedProject?.name}
            onSuccess={() => {
              setShowUpload(false);
              refetch();
              toast.success("Uploaded successfully");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
