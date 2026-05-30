"use client";

import React, { useState, useEffect } from "react";
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
  Plus,
  Upload,
  Download,
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

// RTK Query Hooks
import {
  useGetDrawingsQuery,
  useDeleteDrawingMutation,
} from "@/api/projects/drawingsApi"; // Adjust path as needed
import { useGetProjectsQuery } from "@/api/projectsApi";
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

  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [activeDesign, setActiveDesign] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // RTK Query
  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();

  const {
    data: designs = [],
    isLoading: designsLoading,
    refetch,
  } = useGetDrawingsQuery(selectedProject?.id, { skip: !selectedProject?.id });

  const [deleteDrawing, { isLoading: deleting }] = useDeleteDrawingMutation();

  // Filter Designs
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
    } catch (err) {
      toast.error("Failed to delete design");
    }
  };

  // Show Design Detail
  if (activeDesign) {
    return (
      <DesignDetail
        designId={activeDesign.id}
        user={user}
        onBack={() => {
          setActiveDesign(null);
          refetch(); // Refresh list after returning
        }}
      />
    );
  }

  // Project Selection Screen
  if (!selectedProject) {
    return (
      <div className="flex flex-col h-full" data-testid="design-page">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-black text-black">Designs</h1>
          <p className="text-xs text-gray-400 mt-1">
            Select a project to manage drawings
          </p>
        </div>

        <div className="p-4 md:p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-10"
            />
          </div>
        </div>
      </div>
    );
  }

  // Main Design Library
  return (
    <div className="flex flex-col h-full" data-testid="design-library">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold">{selectedProject.name}</h1>
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

            <div className="flex border border-gray-200 rounded-md overflow-hidden">
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

        {/* Category Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#ef7f1b] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">No drawings found</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDesigns.map((d, i) => {
                const st =
                  STATUS_BADGE[d.approval_status] || STATUS_BADGE.pending;
                return (
                  <Card
                    key={d.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setActiveDesign(d)}
                  >
                    <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                      {d.preview_url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${d.preview_url}`}
                          alt={d.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-gray-300" />
                      )}

                      {d.locked && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Eye className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm truncate pr-2">
                          {d.title}
                        </h3>
                        <Badge
                          className={`${st.color} text-[10px] border-0 shrink-0`}
                        >
                          {st.label}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {d.category} • {d.version}
                      </p>
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
            /* List View */
            <div className="space-y-3">
              {filteredDesigns.map((d) => {
                const st =
                  STATUS_BADGE[d.approval_status] || STATUS_BADGE.pending;
                return (
                  <Card
                    key={d.id}
                    className="p-4 flex items-center gap-4 hover:shadow-md cursor-pointer"
                    onClick={() => setActiveDesign(d)}
                  >
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      {d.preview_url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${d.preview_url}`}
                          className="rounded-xl object-cover w-full h-full"
                          alt=""
                        />
                      ) : (
                        <FileText className="w-7 h-7 text-gray-400" />
                      )}
                    </div>

                    <Badge className={`${st.color} text-xs border-0`}>
                      {st.label}
                    </Badge>

                    {d.locked && <Lock className="w-4 h-4 text-green-600" />}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Drawing</DialogTitle>
          </DialogHeader>
          <UploadDesignForm
            projectId={selectedProject.id}
            projectName={selectedProject.name}
            onSuccess={(newDesign) => {
              setShowUpload(false);
              refetch(); // Refresh list
              toast.success("Drawing uploaded successfully");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
