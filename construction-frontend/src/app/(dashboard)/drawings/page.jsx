"use client";

import { useState, useMemo } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  PenTool,
  Search,
  Download,
  Eye,
  ImageOff,
  Layers,
  MessageSquare,
  Grid3X3,
  List,
  Upload,
} from "lucide-react";

import { useGetAllDrawingsQuery } from "@/api/projects/drawingsApi";
import UploadDesignForm from "@/components/designs/UploadDesignForm";

/* ================= CONSTANTS ================= */

const CATEGORIES = [
  "All",
  "Interior",
  "Structure",
  "MEP",
  "Electrical",
  "Plumbing",
  "Furniture",
  "Ceiling",
  "Flooring",
  "Technical",
  "Construction",
  "Working",
  "Architectural",
  "Other",
];

/* ================= STATUS ================= */

const statusBadge = (s) => {
  if (!s) return { color: "bg-gray-100 text-gray-600", label: "N/A" };

  const sl = s.toLowerCase();

  if (sl === "approved")
    return { color: "bg-green-50 text-green-700", label: "Approved" };

  if (sl === "pending")
    return { color: "bg-yellow-50 text-yellow-700", label: "Pending" };

  if (sl === "rejected")
    return { color: "bg-red-50 text-[#e31d3b]", label: "Rejected" };

  return { color: "bg-gray-100 text-gray-600", label: s };
};

/* ================= MAIN PAGE ================= */

export default function DrawingsPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [activeDrawing, setActiveDrawing] = useState(null);
  const [filterProject, setFilterProject] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const {
    data: drawingsData,
    isLoading,
    refetch,
  } = useGetAllDrawingsQuery(
    filterProject !== "all" ? filterProject : undefined,
  );

  /* ================= NORMALIZATION ================= */

  const drawings = useMemo(() => {
    const raw = drawingsData || [];

    return raw.map((d) => ({
      id: d.id,
      title: `${d.drawing_type ?? "Drawing"} v${d.version ?? 1}`,
      project_name: d.project?.name ?? "Unknown Project",
      category: d.drawing_type ?? "Other",
      drawing_type: d.drawing_type ?? "Other",
      area_floor: d.area_floor ?? "—",
      version: d.version ?? 1,
      file_url: d.file_url ?? "",
      status: d.approved ? "approved" : "pending",
      approval_status: d.approved ? "approved" : "pending",
      uploaded_by: d.uploaded_by ?? "—",
      uploaded_at: d.uploaded_at ?? null,
      preview_url: d.file_url ?? "",
      comment_count: 0,
    }));
  }, [drawingsData]);

  /* ================= FILTERING ================= */

  const filtered = useMemo(() => {
    return drawings.filter((d) => {
      const matchesSearch =
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.project_name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        d.category?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [drawings, search, activeCategory]);

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 md:px-6 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-black">Drawings</h1>
            <p className="text-xs text-gray-400">
              {drawings.length} drawing{drawings.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog
              open={isUploadModalOpen}
              onOpenChange={setIsUploadModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#ef7f1b] text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Drawing</DialogTitle>
                </DialogHeader>

                <UploadDesignForm
                  projectId={filterProject !== "all" ? filterProject : null}
                  projectName=""
                  onSuccess={handleUploadSuccess}
                />
              </DialogContent>
            </Dialog>

            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-44 h-9 text-xs">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drawings..."
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1 rounded-full text-xs ${
                activeCategory === c
                  ? "bg-[#ef7f1b] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <PenTool className="w-10 h-10 mx-auto mb-2" />
              No drawings found
            </div>
          ) : viewMode === "grid" ? (
            <GridView drawings={filtered} onSelect={setActiveDrawing} />
          ) : (
            <ListView drawings={filtered} onSelect={setActiveDrawing} />
          )}
        </div>
      </ScrollArea>

      <DrawingPreviewSheet
        drawing={activeDrawing}
        onClose={() => setActiveDrawing(null)}
      />
    </div>
  );
}

/* ================= GRID VIEW ================= */

function GridView({ drawings, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {drawings.map((d) => {
        const st = statusBadge(d.status);

        return (
          <Card
            key={d.id}
            className="cursor-pointer p-0 overflow-hidden"
            onClick={() => onSelect(d)}
          >
            <div className="h-32 bg-gray-50 flex items-center justify-center">
              {d.preview_url ? (
                <img
                  src={d.preview_url}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageOff className="text-gray-300 w-8 h-8" />
              )}
            </div>

            <div className="p-3">
              <div className="text-xs font-bold truncate">{d.title}</div>

              <div className="text-[10px] text-gray-400">
                {d.project_name} • {d.area_floor}
              </div>

              <div className="flex justify-between mt-2">
                <Badge className="text-[9px]">{d.version}</Badge>
                <Badge className={`text-[9px] ${st.color}`}>{st.label}</Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ================= LIST VIEW ================= */

function ListView({ drawings, onSelect }) {
  return (
    <Card>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs bg-gray-50">
            <th className="p-2 text-left">Drawing</th>
            <th>Project</th>
            <th>Type</th>
            <th>Area</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {drawings.map((d) => {
            const st = statusBadge(d.status);

            return (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.title}</td>
                <td>{d.project_name}</td>
                <td>{d.drawing_type}</td>
                <td>{d.area_floor}</td>
                <td>
                  <Badge className={st.color}>{st.label}</Badge>
                </td>

                <td>
                  <button onClick={() => onSelect(d)}>
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

/* ================= PREVIEW ================= */

function DrawingPreviewSheet({ drawing, onClose }) {
  if (!drawing) return null;

  return (
    <Sheet open={!!drawing} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[500px] p-0">
        <div className="p-4 border-b">
          <h2 className="font-bold text-sm">{drawing.title}</h2>
          <p className="text-xs text-gray-400">{drawing.project_name}</p>
        </div>

        <div className="flex-1 h-[80vh]">
          {drawing.file_url ? (
            <iframe src={drawing.file_url} className="w-full h-full" />
          ) : (
            <div className="p-6 text-gray-400">No file</div>
          )}
        </div>

        <div className="p-3 border-t">
          <a href={drawing.file_url} target="_blank">
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
