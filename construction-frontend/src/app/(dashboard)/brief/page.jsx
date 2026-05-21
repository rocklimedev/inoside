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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

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
  ArrowUpRight,
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
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Changes Requested": "bg-red-500/10 text-red-400 border-red-500/20",
  sent_to_client: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  draft: "bg-slate-700 text-slate-300 border-slate-600",
  Pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function BriefList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ statuses: [] });
  const [sortBy, setSortBy] = useState("date");
  const [view, setView] = useState("cards");

  // API
  const { data: briefsData = [], isLoading, error } = useGetAllBriefsQuery();

  const [approveBrief] = useApproveBriefMutation();
  const [unapproveBrief] = useUnapproveBriefMutation();
  const [requestChanges] = useRequestBriefChangesMutation();
  const [sendToClient] = useSendBriefToClientMutation();
  const [markAsDraft] = useMarkBriefAsDraftMutation();

  // Transform Data
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

  // Filtered & Sorted
  const filteredBriefs = useMemo(() => {
    let result = [...briefs];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((b) =>
        [b.projectName, b.client, b.clientEmail, b.stage, b.briefStatus]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    if (filters.statuses.length > 0) {
      result = result.filter((b) => filters.statuses.includes(b.briefStatus));
    }

    result.sort((a, b) => {
      if (sortBy === "project")
        return a.projectName.localeCompare(b.projectName);
      if (sortBy === "status") {
        return (
          BRIEF_STATUSES.indexOf(a.briefStatus) -
          BRIEF_STATUSES.indexOf(b.briefStatus)
        );
      }
      return (
        new Date(b.raw?.updated_at || 0).getTime() -
        new Date(a.raw?.updated_at || 0).getTime()
      );
    });

    return result;
  }, [briefs, search, filters, sortBy]);

  // Actions
  const handleApprove = async (briefId) => {
    try {
      await approveBrief(briefId).unwrap();
      toast.success("Brief approved successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve brief");
    }
  };

  const handleUnapprove = async (briefId) => {
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
      toast.success("Change request sent");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to request changes");
    }
  };

  const handleSendToClient = async (briefId) => {
    try {
      await sendToClient(briefId).unwrap();
      toast.success("Brief sent to client");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send brief");
    }
  };

  const handleMarkAsDraft = async (briefId) => {
    try {
      await markAsDraft(briefId).unwrap();
      toast.success("Brief marked as draft");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark as draft");
    }
  };

  const handleEditBrief = (briefId) =>
    router.push(`/brief/add?briefId=${briefId}`);
  const handleCardClick = (projectId, briefId) =>
    router.push(`/brief/view?briefId=${briefId}&projectId=${projectId}`);
  const handleNewBrief = () => router.push("/brief/add");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-destructive">
        Failed to load briefs. Please try again.
      </div>
    );
  }

  return (
    <div className="flex h-full" data-testid="briefs-page">
      {/* Filter Sidebar - Desktop */}
      {showFilters && (
        <div className="w-72 border-r border-border bg-card p-6 shrink-0 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
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
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-black">Project Briefs</h1>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-input border border-border rounded-xl px-4 py-2.5 focus-within:border-primary">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects, clients, emails... (Press /)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-0 p-0 text-sm outline-none focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>

              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setView("cards")}
                  className={`p-2.5 ${view === "cards" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("table")}
                  className={`p-2.5 ${view === "table" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <Table2 className="h-4 w-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-xl border border-border bg-input px-4 text-sm outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="project">Sort by Project</option>
                <option value="status">Sort by Status</option>
              </select>

              <Button
                onClick={handleNewBrief}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Brief
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            {filteredBriefs.length} brief
            {filteredBriefs.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* ================= CARD VIEW ================= */}
            {view === "cards" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredBriefs.map((brief) => (
                  <Card
                    key={brief.briefId}
                    onClick={() => handleCardClick(brief.id, brief.briefId)}
                    className="group relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Accent Line */}
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-blue-500 to-primary" />

                    <CardContent className="p-5">
                      {/* HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                            {brief.projectName}
                          </h3>
                          <p className="truncate text-sm text-muted-foreground mt-1">
                            {brief.client}
                          </p>
                          <p className="truncate text-muted-foreground">
                            {brief.clientEmail}
                          </p>
                        </div>

                        <Button
                          size="icon"
                          variant="outline"
                          className="h-9 w-9 rounded-xl shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBrief(brief.briefId);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Status & Stage */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Badge
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            STATUS_STYLES[brief.briefStatus] ||
                            STATUS_STYLES.Pending
                          }`}
                        >
                          {brief.briefStatus}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {brief.stage}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div
                        className="mt-6 flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outline"
                          className="h-10 flex-1 rounded-xl"
                          onClick={() =>
                            handleCardClick(brief.id, brief.briefId)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-xl"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => handleEditBrief(brief.briefId)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit Brief
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {brief.briefStatus !== "Approved" ? (
                              <DropdownMenuItem
                                onClick={() => handleApprove(brief.briefId)}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
                                Approve
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleUnapprove(brief.briefId)}
                              >
                                <Undo className="mr-2 h-4 w-4" /> Unapprove
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() =>
                                handleRequestChanges(brief.briefId)
                              }
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
                              <FileText className="mr-2 h-4 w-4" /> Mark as
                              Draft
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* ================= TABLE VIEW ================= */}
            {view === "table" && (
              <Card className="overflow-hidden rounded-2xl border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredBriefs.map((brief) => (
                        <TableRow
                          key={brief.briefId}
                          onClick={() =>
                            handleCardClick(brief.id, brief.briefId)
                          }
                          className="cursor-pointer hover:bg-muted/40 group"
                        >
                          <TableCell>
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {brief.projectName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {brief.clientEmail}
                            </div>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {brief.client}
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">{brief.stage}</Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                STATUS_STYLES[brief.briefStatus] ||
                                STATUS_STYLES.Pending
                              }`}
                            >
                              {brief.briefStatus}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {brief.lastUpdated}
                          </TableCell>

                          <TableCell
                            className="text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleCardClick(brief.id, brief.briefId)
                                }
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditBrief(brief.briefId)
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(brief.briefId)}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
                                    Approve
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
            {/* Empty State */}
            {filteredBriefs.length === 0 && (
              <Card className="rounded-3xl border border-border bg-card py-24 text-center">
                <CardContent>
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <FolderKanban className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mt-8 text-3xl font-black">No briefs found</h3>
                  <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    Try adjusting your filters or create a new project brief.
                  </p>
                  <Button
                    onClick={handleNewBrief}
                    className="mt-8 h-12 rounded-2xl bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Brief
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 bg-black/80 md:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Filters
              </h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
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
          </div>
        </div>
      )}
    </div>
  );
}
