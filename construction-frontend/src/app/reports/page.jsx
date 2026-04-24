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
  BarChart3,
  Search,
  Download,
  Grid3X3,
  List,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";

const REPORT_TYPES = [
  "All",
  "Daily Progress",
  "Issue & Rectification",
  "Stage Progress",
];

export default function ReportsPage() {
  const { api } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    api
      .get("/reports/all")
      .then((r) => setReports(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    if (
      search &&
      !r.title?.toLowerCase().includes(search.toLowerCase()) &&
      !r.project?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterType !== "All" && r.report_type !== filterType) return false;
    return true;
  });

  const typeIcon = (t) => {
    if (t === "Daily Progress")
      return <TrendingUp className="w-4 h-4 text-blue-500" />;
    if (t === "Issue & Rectification")
      return <AlertTriangle className="w-4 h-4 text-[#e31d3b]" />;
    if (t === "Stage Progress")
      return <BarChart3 className="w-4 h-4 text-[#ef7f1b]" />;
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const statusBadge = (s) => {
    if (!s) return "bg-gray-100 text-gray-600";
    const sl = s.toLowerCase();
    if (sl === "completed" || sl === "active")
      return "bg-green-50 text-green-700";
    if (sl === "open") return "bg-red-50 text-[#e31d3b]";
    if (sl === "closed") return "bg-gray-100 text-gray-600";
    return "bg-yellow-50 text-yellow-700";
  };

  // Summary widgets
  const dailyCount = reports.filter(
    (r) => r.report_type === "Daily Progress",
  ).length;
  const issueCount = reports.filter(
    (r) => r.report_type === "Issue & Rectification",
  ).length;
  const openIssues = reports.filter(
    (r) => r.report_type === "Issue & Rectification" && r.status === "open",
  ).length;

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col h-full" data-testid="reports-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="reports-title"
            >
              Reports
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {reports.length} report{reports.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 ${viewMode === "list" ? "bg-gray-100" : ""}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="pl-10"
              data-testid="reports-search"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-44 h-9 text-xs">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3 p-4 md:px-6 bg-gray-50/50 border-b border-gray-100">
        {[
          { label: "Total Reports", value: reports.length, icon: FileText },
          { label: "Daily Reports", value: dailyCount, icon: TrendingUp },
          { label: "Issue Reports", value: issueCount, icon: AlertTriangle },
          { label: "Open Issues", value: openIssues, icon: Clock },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <Card
              key={i}
              className="p-3 text-center"
              data-testid={`report-kpi-${i}`}
            >
              <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-black text-black">{k.value}</p>
              <p className="text-[9px] text-gray-400">{k.label}</p>
            </Card>
          );
        })}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <BarChart3 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No reports found</p>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-2">
              {filtered.map((r, i) => (
                <Card
                  key={`${r.id}-${i}`}
                  className="p-3 flex items-center gap-3 hover:shadow-md transition-all"
                  data-testid={`report-item-${i}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    {typeIcon(r.report_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-black truncate">
                      {r.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                      <span>{r.project}</span>
                      <span>&middot;</span>
                      <span>{r.module}</span>
                      {r.prepared_by && (
                        <>
                          <span>&middot;</span>
                          <span>{r.prepared_by}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0 shrink-0">
                    {r.report_type}
                  </Badge>
                  <Badge
                    className={`${statusBadge(r.status)} text-[9px] border-0 shrink-0`}
                  >
                    {r.status}
                  </Badge>
                  {r.completion_pct > 0 && (
                    <div className="w-16 shrink-0">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ef7f1b] rounded-full"
                          style={{ width: `${r.completion_pct}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 text-center mt-0.5">
                        {r.completion_pct}%
                      </p>
                    </div>
                  )}
                  {r.date && (
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {r.date.slice(0, 10)}
                    </span>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((r, i) => (
                <Card
                  key={`${r.id}-${i}`}
                  className="p-4 hover:shadow-lg transition-all"
                  data-testid={`report-card-${i}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      {typeIcon(r.report_type)}
                    </div>
                    <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                      {r.report_type}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-black truncate">
                    {r.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {r.project}
                  </p>
                  {r.completion_pct > 0 && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ef7f1b] rounded-full"
                          style={{ width: `${r.completion_pct}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        {r.completion_pct}% complete
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <Badge
                      className={`${statusBadge(r.status)} text-[9px] border-0`}
                    >
                      {r.status}
                    </Badge>
                    {r.date && (
                      <span className="text-[9px] text-gray-400">
                        {r.date.slice(0, 10)}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
