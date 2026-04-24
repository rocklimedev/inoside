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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Download,
  Grid3X3,
  List,
  Eye,
  ExternalLink,
  Filter,
  Calendar,
  User,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const MODULES = [
  "All",
  "Brief",
  "Pitch",
  "Site Reki",
  "Scope of Work",
  "Time & Cost",
  "BOQ",
  "Design",
  "Execution",
  "Handover",
];

const statusColor = (s) => {
  if (!s) return "bg-gray-100 text-gray-600";
  const sl = s.toLowerCase();
  if (sl === "approved" || sl === "completed")
    return "bg-green-50 text-green-700";
  if (sl === "pending" || sl === "draft") return "bg-yellow-50 text-yellow-700";
  if (sl === "rejected" || sl === "changes_requested")
    return "bg-red-50 text-[#e31d3b]";
  return "bg-gray-100 text-gray-600";
};

export default function PDFsPage() {
  const { api } = useAuth();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("All");
  const [viewMode, setViewMode] = useState("list");
  const [viewingPdf, setViewingPdf] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filterProject, setFilterProject] = useState("All");

  useEffect(() => {
    Promise.all([api.get("/pdfs/all"), api.get("/projects")])
      .then(([r, p]) => {
        setPdfs(r.data);
        setProjects(p.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = pdfs.filter((p) => {
    if (
      search &&
      !p.name?.toLowerCase().includes(search.toLowerCase()) &&
      !p.project?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterModule !== "All" && p.module !== filterModule) return false;
    if (filterProject !== "All" && p.project !== filterProject) return false;
    return true;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col h-full" data-testid="pdfs-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="pdfs-title"
            >
              PDFs
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {pdfs.length} document{pdfs.length !== 1 ? "s" : ""} across all
              projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                data-testid="pdf-view-list"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                data-testid="pdf-view-grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="pl-10"
              data-testid="pdf-search"
            />
          </div>
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-36 h-9 text-xs">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODULES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-44 h-9 text-xs">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No PDFs found</p>
            </div>
          ) : viewMode === "list" ? (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="pdf-table">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="py-2.5 px-3 text-left font-bold">
                        Document
                      </th>
                      <th className="py-2.5 px-3 text-left font-bold">
                        Project
                      </th>
                      <th className="py-2.5 px-3 text-left font-bold">
                        Module
                      </th>
                      <th className="py-2.5 px-3 text-left font-bold">
                        Version
                      </th>
                      <th className="py-2.5 px-3 text-left font-bold">Type</th>
                      <th className="py-2.5 px-3 text-left font-bold">By</th>
                      <th className="py-2.5 px-3 text-center font-bold">
                        Status
                      </th>
                      <th className="py-2.5 px-3 text-center font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((pdf, i) => (
                      <tr
                        key={`${pdf.id}-${i}`}
                        className="border-t border-gray-100 hover:bg-gray-50/50"
                        data-testid={`pdf-row-${i}`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="text-xs font-medium text-black truncate max-w-[200px]">
                              {pdf.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-600">
                          {pdf.project}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                            {pdf.module}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">
                          {pdf.version}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">
                          {pdf.doc_type}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">
                          {pdf.uploaded_by}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge
                            className={`${statusColor(pdf.status)} text-[9px] border-0`}
                          >
                            {pdf.status || "—"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setViewingPdf(pdf)}
                              className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#ef7f1b]"
                              data-testid={`pdf-view-${i}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`${BACKEND}${pdf.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#ef7f1b]"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((pdf, i) => (
                <Card
                  key={`${pdf.id}-${i}`}
                  className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group"
                  onClick={() => setViewingPdf(pdf)}
                  data-testid={`pdf-card-${i}`}
                >
                  <div className="w-full h-24 rounded-lg bg-red-50/50 flex items-center justify-center mb-3">
                    <FileText className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xs font-bold text-black truncate">
                    {pdf.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {pdf.project}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                      {pdf.module}
                    </Badge>
                    <Badge
                      className={`${statusColor(pdf.status)} text-[9px] border-0`}
                    >
                      {pdf.status || "—"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* PDF Viewer Dialog */}
      <Dialog
        open={!!viewingPdf}
        onOpenChange={(o) => {
          if (!o) setViewingPdf(null);
        }}
      >
        <DialogContent
          className="max-w-4xl h-[85vh] p-0 flex flex-col"
          data-testid="pdf-viewer-dialog"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-black">
                {viewingPdf?.name}
              </h3>
              <p className="text-[10px] text-gray-400">
                {viewingPdf?.project} &middot; {viewingPdf?.module} &middot;{" "}
                {viewingPdf?.version}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={viewingPdf ? `${BACKEND}${viewingPdf.url}` : "#"}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </a>
              <a
                href={viewingPdf ? `${BACKEND}${viewingPdf.url}` : "#"}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="sm" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </Button>
              </a>
            </div>
          </div>
          <div className="flex-1 bg-gray-100">
            {viewingPdf && (
              <iframe
                src={`${BACKEND}${viewingPdf.url}`}
                className="w-full h-full"
                title="PDF Viewer"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
