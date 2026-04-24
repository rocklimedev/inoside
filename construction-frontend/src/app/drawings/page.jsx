import { useState, useEffect } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  PenTool,
  Search,
  Download,
  Eye,
  Upload,
  Filter,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Grid3X3,
  List,
  FileText,
  Layers,
} from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
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

const statusBadge = (s) => {
  if (!s) return { color: "bg-gray-100 text-gray-600", label: "N/A" };
  const sl = s.toLowerCase();
  if (sl === "approved")
    return { color: "bg-green-50 text-green-700", label: "Approved" };
  if (sl === "pending" || sl === "pending_review")
    return { color: "bg-yellow-50 text-yellow-700", label: "Pending" };
  if (sl === "rejected" || sl === "changes_requested")
    return { color: "bg-red-50 text-[#e31d3b]", label: "Rejected" };
  return { color: "bg-gray-100 text-gray-600", label: s };
};

export default function DrawingsPage() {
  const { api, user } = useAuth();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [activeDrawing, setActiveDrawing] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filterProject, setFilterProject] = useState("all");
  const isClient = user?.role === "Client";

  useEffect(() => {
    const pq = filterProject !== "all" ? `?project_id=${filterProject}` : "";
    Promise.all([api.get(`/drawings/all${pq}`), api.get("/projects")])
      .then(([d, p]) => {
        setDrawings(d.data);
        setProjects(p.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterProject]);

  const filtered = drawings.filter((d) => {
    if (
      search &&
      !d.title?.toLowerCase().includes(search.toLowerCase()) &&
      !d.project_name?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (
      activeCategory !== "All" &&
      d.category?.toLowerCase() !== activeCategory.toLowerCase() &&
      d.drawing_type?.toLowerCase() !== activeCategory.toLowerCase()
    )
      return false;
    return true;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col h-full" data-testid="drawings-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="drawings-title"
            >
              Drawings
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {drawings.length} drawing{drawings.length !== 1 ? "s" : ""} in
              library
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filterProject}
              onValueChange={(v) => {
                setFilterProject(v);
                setLoading(true);
              }}
            >
              <SelectTrigger className="w-44 h-9 text-xs">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
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
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drawings..."
              className="pl-10"
              data-testid="drawing-search"
            />
          </div>
        </div>
        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${activeCategory === c ? "bg-[#ef7f1b] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              data-testid={`cat-${c.toLowerCase()}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <PenTool className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No drawings found</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((d, i) => {
                const st = statusBadge(d.approval_status || d.status);
                return (
                  <Card
                    key={d.id}
                    className="overflow-hidden hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group"
                    onClick={() => setActiveDrawing(d)}
                    data-testid={`drawing-card-${i}`}
                  >
                    <div className="w-full h-32 bg-gray-50 flex items-center justify-center">
                      {d.preview_url ? (
                        <img
                          src={`${BACKEND}${d.preview_url}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Layers className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-black truncate">
                        {d.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {d.project_name} &middot; {d.area_floor || d.category}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                            {d.version}
                          </Badge>
                          <Badge className={`${st.color} text-[9px] border-0`}>
                            {st.label}
                          </Badge>
                        </div>
                        {d.comment_count > 0 && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <MessageSquare className="w-3 h-3" />
                            {d.comment_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full text-sm" data-testid="drawing-table">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                    <th className="py-2.5 px-3 text-left font-bold">Drawing</th>
                    <th className="py-2.5 px-3 text-left font-bold">Project</th>
                    <th className="py-2.5 px-3 text-left font-bold">Type</th>
                    <th className="py-2.5 px-3 text-left font-bold">Area</th>
                    <th className="py-2.5 px-3 text-left font-bold">Version</th>
                    <th className="py-2.5 px-3 text-center font-bold">
                      Status
                    </th>
                    <th className="py-2.5 px-3 text-center font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => {
                    const st = statusBadge(d.approval_status || d.status);
                    return (
                      <tr
                        key={d.id}
                        className="border-t border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                        onClick={() => setActiveDrawing(d)}
                        data-testid={`drawing-row-${i}`}
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <PenTool className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-black truncate">
                              {d.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-600">
                          {d.project_name}
                        </td>
                        <td className="py-2 px-3">
                          <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                            {d.drawing_type || d.category}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-500">
                          {d.area_floor || "—"}
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-500">
                          {d.version}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge className={`${st.color} text-[9px] border-0`}>
                            {st.label}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDrawing(d);
                              }}
                              className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {d.file_url && (
                              <a
                                href={`${BACKEND}${d.file_url}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Drawing Preview Sheet */}
      <Sheet
        open={!!activeDrawing}
        onOpenChange={(o) => {
          if (!o) setActiveDrawing(null);
        }}
      >
        <SheetContent className="w-[480px] sm:w-[560px] p-0">
          {activeDrawing && (
            <div className="flex flex-col h-full" data-testid="drawing-preview">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-black">
                  {activeDrawing.title}
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {activeDrawing.project_name} &middot;{" "}
                  {activeDrawing.drawing_type || activeDrawing.category}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                    {activeDrawing.version}
                  </Badge>
                  <Badge
                    className={`${statusBadge(activeDrawing.approval_status || activeDrawing.status).color} text-[9px] border-0`}
                  >
                    {
                      statusBadge(
                        activeDrawing.approval_status || activeDrawing.status,
                      ).label
                    }
                  </Badge>
                  {activeDrawing.source && (
                    <Badge className="bg-blue-50 text-blue-600 text-[9px] border-0">
                      {activeDrawing.source}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 flex items-center justify-center overflow-hidden">
                {activeDrawing.file_url ? (
                  <iframe
                    src={`${BACKEND}${activeDrawing.file_url}`}
                    className="w-full h-full"
                    title="Drawing Preview"
                  />
                ) : (
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No file available</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-200 flex items-center gap-2">
                {activeDrawing.file_url && (
                  <a
                    href={`${BACKEND}${activeDrawing.file_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download PDF
                    </Button>
                  </a>
                )}
                <div className="text-[10px] text-gray-400">
                  <p>By {activeDrawing.uploaded_by}</p>
                  {activeDrawing.area_floor && (
                    <p>Area: {activeDrawing.area_floor}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
