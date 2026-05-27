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
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FilterSection } from "@/components/projects/FilterSection";

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
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";

const BRIEF_STATUSES = [
  "Pending",
  "Approved",
  "Changes Requested",
  "sent_to_client",
  "draft",
];

const STATUS_STYLES = {
  Approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

  "Changes Requested": "border-red-500/20 bg-red-500/10 text-red-400",

  sent_to_client: "border-amber-500/20 bg-amber-500/10 text-amber-400",

  draft: "border-slate-500/20 bg-slate-500/10 text-slate-300",

  Pending: "border-blue-500/20 bg-blue-500/10 text-blue-400",
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

  // Transform
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

  // Filter + Sort
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
      if (sortBy === "project") {
        return a.projectName.localeCompare(b.projectName);
      }

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

  // Stats
  const stats = useMemo(() => {
    return {
      total: briefs.length,
      approved: briefs.filter((b) => b.briefStatus === "Approved").length,

      pending: briefs.filter((b) => b.briefStatus === "Pending").length,

      draft: briefs.filter((b) => b.briefStatus === "draft").length,
    };
  }, [briefs]);

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
      await requestChanges({
        briefId,
        note,
      }).unwrap();

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

  const handleEditBrief = (briefId) => {
    router.push(`/brief/add?briefId=${briefId}`);
  };

  const handleCardClick = (projectId, briefId) => {
    router.push(`/brief/view?briefId=${briefId}&projectId=${projectId}`);
  };

  const handleNewBrief = () => {
    router.push("/brief/add");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading briefs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md rounded-2xl border border-destructive/20">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />

            <h3 className="mt-4 text-lg font-semibold">
              Failed to load briefs
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Desktop Filters */}
      {showFilters && (
        <div className="hidden lg:block w-72 shrink-0 border-r border-border/50 bg-card/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border/50 p-5">
            <div>
              <h3 className="font-semibold">Filters</h3>
              <p className="text-xs text-muted-foreground">
                Refine your results
              </p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-xl"
              onClick={() => setShowFilters(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-5">
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
          </ScrollArea>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex flex-col gap-6 p-6">
            {/* Top */}
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Project Briefs
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage and review all client briefs
                </p>
              </div>

              <Button onClick={handleNewBrief} className="h-11 rounded-xl px-5">
                <Plus className="mr-2 h-4 w-4" />
                New Brief
              </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[260px] flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="text"
                  placeholder="Search briefs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 rounded-xl border-border/50 bg-card pl-10"
                />
              </div>

              {/* Filter */}
              <Button
                variant="outline"
                className="h-11 rounded-xl border-border/50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 rounded-xl border border-border/50 bg-card px-4 text-sm outline-none"
              >
                <option value="date">Latest</option>
                <option value="project">Project</option>
                <option value="status">Status</option>
              </select>

              {/* View Switch */}
              <div className="flex items-center rounded-xl border border-border/50 bg-card p-1">
                <button
                  onClick={() => setView("cards")}
                  className={`rounded-lg px-3 py-2 transition ${
                    view === "cards"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setView("table")}
                  className={`rounded-lg px-3 py-2 transition ${
                    view === "table"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Table2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* CARD VIEW */}
            {view === "cards" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredBriefs.map((brief) => (
                  <Card
                    key={brief.briefId}
                    onClick={() => handleCardClick(brief.id, brief.briefId)}
                    className="
                      group
                      cursor-pointer
                      rounded-2xl
                      border
                      border-border/50
                      bg-card/70
                      backdrop-blur-sm
                      transition-all
                      duration-200
                      hover:border-primary/20
                      hover:shadow-lg
                    "
                  >
                    <CardContent className="p-5">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold transition-colors group-hover:text-primary">
                            {brief.projectName}
                          </h3>

                          <div className="mt-1 space-y-0.5">
                            <p className="text-sm text-muted-foreground">
                              {brief.client}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                              {brief.clientEmail}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 rounded-xl"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => handleEditBrief(brief.briefId)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Brief
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {brief.briefStatus !== "Approved" ? (
                              <DropdownMenuItem
                                onClick={() => handleApprove(brief.briefId)}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleUnapprove(brief.briefId)}
                              >
                                <Undo className="mr-2 h-4 w-4" />
                                Unapprove
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() =>
                                handleRequestChanges(brief.briefId)
                              }
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Request Changes
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleSendToClient(brief.briefId)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Send to Client
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleMarkAsDraft(brief.briefId)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Mark as Draft
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Meta */}
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Badge
                          className={`border text-xs font-medium ${STATUS_STYLES[brief.briefStatus]}`}
                        >
                          {brief.briefStatus}
                        </Badge>

                        <Badge variant="secondary" className="rounded-lg">
                          {brief.stage}
                        </Badge>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                        <p className="text-xs text-muted-foreground">
                          Updated {brief.lastUpdated}
                        </p>

                        <Button size="sm" className="rounded-xl">
                          <Eye className="mr-2 h-4 w-4" />
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* TABLE VIEW */}
            {view === "table" && (
              <Card className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
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
                          className="cursor-pointer border-border/50 hover:bg-muted/30"
                        >
                          <TableCell className="py-4">
                            <div className="font-medium">
                              {brief.projectName}
                            </div>

                            <div className="mt-1 text-xs text-muted-foreground">
                              {brief.clientEmail}
                            </div>
                          </TableCell>

                          <TableCell className="py-4 text-sm text-muted-foreground">
                            {brief.client}
                          </TableCell>

                          <TableCell className="py-4">
                            <Badge variant="secondary" className="rounded-lg">
                              {brief.stage}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-4">
                            <Badge
                              className={`border text-xs font-medium ${STATUS_STYLES[brief.briefStatus]}`}
                            >
                              {brief.briefStatus}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-4 text-sm text-muted-foreground">
                            {brief.lastUpdated}
                          </TableCell>

                          <TableCell
                            className="py-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-xl"
                                onClick={() =>
                                  handleCardClick(brief.id, brief.briefId)
                                }
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-xl"
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
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => handleApprove(brief.briefId)}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
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

            {/* Empty */}
            {filteredBriefs.length === 0 && (
              <Card className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center py-24 text-center">
                  <div className="rounded-2xl bg-primary/10 p-5">
                    <FolderKanban className="h-10 w-10 text-primary" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    No briefs found
                  </h3>

                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Try adjusting your filters or create a new project brief.
                  </p>

                  <Button onClick={handleNewBrief} className="mt-6 rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Brief
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Filter */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l border-border/50 bg-card/95 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/50 p-5">
              <div>
                <h3 className="font-semibold">Filters</h3>
                <p className="text-xs text-muted-foreground">
                  Refine your results
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-5">
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
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
