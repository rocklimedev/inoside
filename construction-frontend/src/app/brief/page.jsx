"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  useGetAllBriefsQuery,
  useApproveBriefMutation,
  useUnapproveBriefMutation,
  useRequestBriefChangesMutation,
  useSendBriefToClientMutation,
  useMarkBriefAsDraftMutation,
} from "@/api/projectsApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  Filter,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit,
  LayoutGrid,
  Table2,
  MoreHorizontal,
  Eye,
  Send,
  Undo,
  FileText,
  FolderKanban,
} from "lucide-react";

import { FilterSection } from "@/components/projects/FilterSection";

const BRIEF_STATUSES = [
  "Pending",
  "Approved",
  "Changes Requested",
  "sent_to_client",
  "draft",
];

const STATUS_STYLES = {
  Approved:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400",
  "Changes Requested":
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400",
  sent_to_client:
    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400",
  draft:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300",
  Pending:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
};

export default function BriefList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ statuses: [] });
  const [sortBy, setSortBy] = useState("date");
  const [view, setView] = useState("cards");

  // ================= API HOOKS =================
  const { data: briefsData = [], isLoading, error } = useGetAllBriefsQuery();

  const [approveBrief] = useApproveBriefMutation();
  const [unapproveBrief] = useUnapproveBriefMutation();
  const [requestChanges] = useRequestBriefChangesMutation();
  const [sendToClient] = useSendBriefToClientMutation();
  const [markAsDraft] = useMarkBriefAsDraftMutation();

  // ================= TRANSFORM DATA =================
  const briefs = useMemo(() => {
    return briefsData.map((brief) => ({
      id: brief.project_id,
      briefId: brief.id,
      projectName:
        brief.project?.name || brief.project_name || "Untitled Project",
      client: brief.project?.client?.name || brief.client_name || "—",
      clientEmail: brief.project?.client?.email || brief.client_email || "—",
      stage: brief.project?.status || "—",
      briefStatus: brief.status || "Pending",
      lastUpdated: brief.updated_at
        ? new Date(brief.updated_at).toLocaleDateString()
        : "—",
      raw: brief,
    }));
  }, [briefsData]);

  // ================= FILTERED & SORTED DATA =================
  const filteredBriefs = useMemo(() => {
    let result = [...briefs];

    // Search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((b) =>
        [b.projectName, b.client, b.clientEmail, b.stage, b.briefStatus]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    // Status Filter
    if (filters.statuses.length > 0) {
      result = result.filter((b) => filters.statuses.includes(b.briefStatus));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "project")
        return a.projectName.localeCompare(b.projectName);
      if (sortBy === "status") {
        return (
          BRIEF_STATUSES.indexOf(a.briefStatus) -
          BRIEF_STATUSES.indexOf(b.briefStatus)
        );
      }
      // Default: Date (newest first)
      return (
        new Date(b.raw?.updated_at || 0).getTime() -
        new Date(a.raw?.updated_at || 0).getTime()
      );
    });

    return result;
  }, [briefs, search, filters, sortBy]);

  // ================= ACTION HANDLERS =================
  const handleApprove = async (briefId) => {
    if (!confirm("Approve this brief?")) return;
    try {
      await approveBrief(briefId).unwrap();
      toast.success("Brief approved successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve brief");
    }
  };

  const handleUnapprove = async (briefId) => {
    if (!confirm("Unapprove this brief?")) return;
    try {
      await unapproveBrief(briefId).unwrap();
      toast.success("Brief unapproved successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to unapprove brief");
    }
  };

  const handleRequestChanges = async (briefId) => {
    const note = prompt("Enter reason for requesting changes:");
    if (!note?.trim()) return;

    try {
      await requestChanges({ briefId, note }).unwrap();
      toast.success("Change request sent successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to request changes");
    }
  };

  const handleSendToClient = async (briefId) => {
    if (!confirm("Send this brief to the client?")) return;
    try {
      await sendToClient(briefId).unwrap();
      toast.success("Brief sent to client successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send brief");
    }
  };

  const handleMarkAsDraft = async (briefId) => {
    if (!confirm("Mark this brief as draft?")) return;
    try {
      await markAsDraft(briefId).unwrap();
      toast.success("Brief marked as draft");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark as draft");
    }
  };

  const handleEditBrief = (briefId) =>
    router.push(`/brief/add?briefId=${briefId}`);
  const handleCardClick = (projectId) =>
    router.push(`/projects/${projectId}/brief`);
  const handleNewBrief = () => router.push("/brief/add");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center text-destructive">
          Failed to load briefs.
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-card border-l shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="uppercase text-xs font-black tracking-widest text-muted-foreground">
                  Filters
                </h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <FilterSection
                title="Brief Status"
                items={BRIEF_STATUSES}
                selected={filters.statuses}
                onToggle={(value) =>
                  setFilters((prev) => ({
                    statuses: prev.statuses.includes(value)
                      ? prev.statuses.filter((v) => v !== value)
                      : [...prev.statuses, value],
                  }))
                }
              />

              {filters.statuses.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ statuses: [] })}
                  className="mt-6 w-full"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters Sidebar */}
      {showFilters && (
        <div className="hidden md:block w-72 shrink-0 border-r border-border bg-card p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="uppercase text-xs font-black tracking-widest text-muted-foreground">
              Filters
            </h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <FilterSection
            title="Brief Status"
            items={BRIEF_STATUSES}
            selected={filters.statuses}
            onToggle={(value) =>
              setFilters((prev) => ({
                statuses: prev.statuses.includes(value)
                  ? prev.statuses.filter((v) => v !== value)
                  : [...prev.statuses, value],
              }))
            }
          />

          {filters.statuses.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ statuses: [] })}
              className="mt-6"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card px-4 py-4 md:px-6 md:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Project Briefs
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Manage and review all submitted briefs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setView("cards")}
                  className={`px-4 py-2.5 ${view === "cards" ? "bg-primary text-white" : "hover:bg-muted"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("table")}
                  className={`px-4 py-2.5 ${view === "table" ? "bg-primary text-white" : "hover:bg-muted"}`}
                >
                  <Table2 className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex"
              >
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>

              <Button onClick={handleNewBrief} className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                New Brief
              </Button>
            </div>
          </div>

          {/* Search & Sort */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search briefs..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-2xl border bg-card px-4 text-sm w-full sm:w-auto"
            >
              <option value="date">Sort by Date</option>
              <option value="project">Sort by Project</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {filteredBriefs.length} brief
            {filteredBriefs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            {/* ================= CARD VIEW ================= */}
            {view === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredBriefs.map((brief) => (
                  <Card
                    key={brief.briefId}
                    onClick={() => handleCardClick(brief.id)}
                    className="p-5 cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1 pr-3">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
                          {brief.projectName}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {brief.client}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBrief(brief.briefId);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mt-4">
                      <Badge
                        className={
                          STATUS_STYLES[brief.briefStatus] ||
                          STATUS_STYLES.Pending
                        }
                      >
                        {brief.briefStatus}
                      </Badge>
                    </div>

                    <div
                      className="mt-6 pt-4 border-t flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCardClick(brief.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditBrief(brief.briefId)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Brief
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {brief.briefStatus !== "Approved" && (
                            <DropdownMenuItem
                              onClick={() => handleApprove(brief.briefId)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                          )}

                          {brief.briefStatus === "Approved" && (
                            <DropdownMenuItem
                              onClick={() => handleUnapprove(brief.briefId)}
                            >
                              <Undo className="mr-2 h-4 w-4" /> Unapprove
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleRequestChanges(brief.briefId)}
                          >
                            <AlertCircle className="mr-2 h-4 w-4" /> Request
                            Changes
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleSendToClient(brief.briefId)}
                          >
                            <Send className="mr-2 h-4 w-4" /> Send to Client
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleMarkAsDraft(brief.briefId)}
                          >
                            <FileText className="mr-2 h-4 w-4" /> Mark as Draft
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* ================= TABLE VIEW ================= */}
            {view === "table" && (
              <div className="border rounded-3xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px]">
                    <thead className="bg-muted/60 border-b">
                      <tr>
                        <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                          Project
                        </th>
                        <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                          Client
                        </th>
                        <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground hidden sm:table-cell">
                          Stage
                        </th>
                        <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground hidden md:table-cell">
                          Last Updated
                        </th>
                        <th className="text-right p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBriefs.map((brief) => (
                        <tr
                          key={brief.briefId}
                          onClick={() => handleCardClick(brief.id)}
                          className="border-b hover:bg-muted/50 cursor-pointer transition-colors active:bg-muted"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                                <FolderKanban className="w-5 h-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold truncate">
                                  {brief.projectName}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {brief.clientEmail}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{brief.client}</td>
                          <td className="p-4 hidden sm:table-cell">
                            <Badge variant="outline">{brief.stage}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                STATUS_STYLES[brief.briefStatus] ||
                                STATUS_STYLES.Pending
                              }
                            >
                              {brief.briefStatus}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                            {brief.lastUpdated}
                          </td>
                          <td
                            className="p-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-5 h-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditBrief(brief.briefId)}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit Brief
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCardClick(brief.id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" /> View Brief
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {brief.briefStatus !== "Approved" && (
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(brief.briefId)}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
                                    Approve
                                  </DropdownMenuItem>
                                )}

                                {brief.briefStatus === "Approved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUnapprove(brief.briefId)
                                    }
                                  >
                                    <Undo className="mr-2 h-4 w-4" /> Unapprove
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRequestChanges(brief.briefId)
                                  }
                                >
                                  <AlertCircle className="mr-2 h-4 w-4" />{" "}
                                  Request Changes
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSendToClient(brief.briefId)
                                  }
                                >
                                  <Send className="mr-2 h-4 w-4" /> Send to
                                  Client
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMarkAsDraft(brief.briefId)
                                  }
                                >
                                  <FileText className="mr-2 h-4 w-4" /> Mark as
                                  Draft
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredBriefs.length === 0 && (
              <Card className="py-20 text-center">
                <p className="text-xl font-semibold">No briefs found</p>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
