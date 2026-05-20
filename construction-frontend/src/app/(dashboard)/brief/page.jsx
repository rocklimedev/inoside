"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";

import {
  useGetAllBriefsQuery,
  useApproveBriefMutation,
  useUnapproveBriefMutation,
  useRequestBriefChangesMutation,
  useSendBriefToClientMutation,
  useMarkBriefAsDraftMutation,
} from "@/api/projectsApi";

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
  Clock3,
  Sparkles,
  Users2,
  ClipboardCheck,
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
  Approved:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",

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

  const [filters, setFilters] = useState({
    statuses: [],
  });

  const [sortBy, setSortBy] = useState("date");

  const [view, setView] = useState("cards");

  // ======================================================
  // API
  // ======================================================

  const { data: briefsData = [], isLoading, error } = useGetAllBriefsQuery();

  const [approveBrief] = useApproveBriefMutation();

  const [unapproveBrief] = useUnapproveBriefMutation();

  const [requestChanges] = useRequestBriefChangesMutation();

  const [sendToClient] = useSendBriefToClientMutation();

  const [markAsDraft] = useMarkBriefAsDraftMutation();

  // ======================================================
  // TRANSFORM DATA
  // ======================================================

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

  // ======================================================
  // FILTERED
  // ======================================================

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

  // ======================================================
  // STATS
  // ======================================================

  const stats = useMemo(() => {
    return {
      total: briefs.length,

      approved: briefs.filter((b) => b.briefStatus === "Approved").length,

      pending: briefs.filter((b) => b.briefStatus === "Pending").length,

      changes: briefs.filter((b) => b.briefStatus === "Changes Requested")
        .length,
    };
  }, [briefs]);

  // ======================================================
  // ACTIONS
  // ======================================================

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

  // ======================================================
  // ROUTING
  // ======================================================

  const handleEditBrief = (briefId) =>
    router.push(`/brief/add?briefId=${briefId}`);

  const handleCardClick = (projectId) =>
    router.push(`/projects/${projectId}/brief`);

  const handleNewBrief = () => router.push("/brief/add");

  // ======================================================
  // LOADING
  // ======================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="p-8">
        <Card className="rounded-3xl border-red-200 bg-red-50 p-10 text-center text-red-600">
          Failed to load briefs
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex h-full overflow-hidden bg-[#fafafa]">
      {/* ====================================================== */}
      {/* BACKGROUND */}
      {/* ====================================================== */}

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#fafafa] to-orange-50/40" />

      <div className="absolute left-0 top-0 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl" />

      {/* ====================================================== */}
      {/* MOBILE FILTER OVERLAY */}
      {/* ====================================================== */}

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{
                x: 300,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: 300,
              }}
              transition={{
                type: "spring",
                damping: 22,
              }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
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

              <Separator className="my-6" />

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================== */}
      {/* DESKTOP SIDEBAR */}
      {/* ====================================================== */}

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{
              width: 0,
              opacity: 0,
            }}
            animate={{
              width: 290,
              opacity: 1,
            }}
            exit={{
              width: 0,
              opacity: 0,
            }}
            className="hidden overflow-hidden border-r bg-white/90 backdrop-blur-xl md:block"
          >
            <div className="h-full p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
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

              <Separator className="my-6" />

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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <div className="border-b bg-white/80 px-4 py-6 backdrop-blur-xl md:px-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            {/* LEFT */}

            <div className="max-w-3xl">
              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
                Project Briefs
              </h1>
            </div>

            {/* RIGHT */}

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-2xl px-5"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>

              <Button
                onClick={handleNewBrief}
                className="h-12 rounded-2xl bg-orange-500 px-5 text-white hover:bg-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Brief
              </Button>
            </div>
          </div>

          {/* ====================================================== */}
          {/* TOOLBAR */}
          {/* ====================================================== */}

          <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* SEARCH */}

            <div className="relative w-full xl:max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, clients, emails..."
                className="h-14 rounded-2xl border-0 bg-white pl-12 shadow-sm"
              />
            </div>

            {/* CONTROLS */}

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex overflow-hidden rounded-2xl border bg-white shadow-sm">
                <button
                  onClick={() => setView("cards")}
                  className={`px-5 py-3 transition-all ${
                    view === "cards"
                      ? "bg-orange-500 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setView("table")}
                  className={`px-5 py-3 transition-all ${
                    view === "table"
                      ? "bg-orange-500 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <Table2 className="h-4 w-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-14 rounded-2xl border-0 bg-white px-5 text-sm shadow-sm outline-none"
              >
                <option value="date">Sort by Date</option>

                <option value="project">Sort by Project</option>

                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            {filteredBriefs.length} brief
            {filteredBriefs.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* ====================================================== */}
        {/* CONTENT */}
        {/* ====================================================== */}

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-8">
            {/* ====================================================== */}
            {/* CARDS */}
            {/* ====================================================== */}

            {view === "cards" && (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3"
              >
                {filteredBriefs.map((brief, index) => (
                  <motion.div
                    key={brief.briefId}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                  >
                    <Card
                      onClick={() => handleCardClick(brief.id)}
                      className="
                          group
                          relative
                          overflow-hidden
                          rounded-[28px]
                          border-0
                          bg-white/90
                          shadow-lg
                          backdrop-blur-xl
                          transition-all
                          duration-500
                          hover:-translate-y-2
                          hover:shadow-2xl
                          cursor-pointer
                        "
                    >
                      {/* Glow */}

                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-violet-500/[0.03]" />

                      <CardContent className="relative z-10 p-6">
                        {/* TOP */}

                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                              <FolderKanban className="h-6 w-6 text-orange-600" />
                            </div>

                            <h3 className="mt-5 truncate text-2xl font-black tracking-tight transition-colors group-hover:text-orange-600">
                              {brief.projectName}
                            </h3>

                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {brief.client}
                            </p>
                          </div>

                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation();

                              handleEditBrief(brief.briefId);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* STATUS */}

                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          <Badge
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              STATUS_STYLES[brief.briefStatus] ||
                              STATUS_STYLES.Pending
                            }`}
                          >
                            {brief.briefStatus}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="rounded-full px-3 py-1"
                          >
                            {brief.stage}
                          </Badge>
                        </div>

                        {/* INFO */}

                        <div className="mt-6 rounded-2xl border bg-muted/30 p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Last Updated
                            </span>

                            <span className="font-medium">
                              {brief.lastUpdated}
                            </span>
                          </div>

                          <Separator className="my-3" />

                          <div className="truncate text-sm text-muted-foreground">
                            {brief.clientEmail}
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div
                          className="mt-6 flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            className="h-11 flex-1 rounded-2xl"
                            onClick={() => handleCardClick(brief.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11 rounded-2xl"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditBrief(brief.briefId)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Brief
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {brief.briefStatus !== "Approved" && (
                                <DropdownMenuItem
                                  onClick={() => handleApprove(brief.briefId)}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                              )}

                              {brief.briefStatus === "Approved" && (
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
                                onClick={() =>
                                  handleSendToClient(brief.briefId)
                                }
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
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ====================================================== */}
            {/* TABLE */}
            {/* ====================================================== */}

            {view === "table" && (
              <Card className="overflow-hidden rounded-[32px] border-0 bg-white/90 shadow-xl backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="border-b bg-muted/40">
                      <tr>
                        {[
                          "Project",
                          "Client",
                          "Stage",
                          "Status",
                          "Updated",
                          "Actions",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-muted-foreground"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredBriefs.map((brief) => (
                        <tr
                          key={brief.briefId}
                          onClick={() => handleCardClick(brief.id)}
                          className="cursor-pointer border-b transition-colors hover:bg-muted/30"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                                <FolderKanban className="h-5 w-5 text-orange-600" />
                              </div>

                              <div>
                                <div className="font-bold">
                                  {brief.projectName}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  {brief.clientEmail}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">{brief.client}</td>

                          <td className="px-6 py-5">
                            <Badge variant="outline">{brief.stage}</Badge>
                          </td>

                          <td className="px-6 py-5">
                            <Badge
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                STATUS_STYLES[brief.briefStatus] ||
                                STATUS_STYLES.Pending
                              }`}
                            >
                              {brief.briefStatus}
                            </Badge>
                          </td>

                          <td className="px-6 py-5 text-muted-foreground">
                            {brief.lastUpdated}
                          </td>

                          <td
                            className="px-6 py-5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleCardClick(brief.id)}
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* ====================================================== */}
            {/* EMPTY */}
            {/* ====================================================== */}

            {filteredBriefs.length === 0 && (
              <Card className="rounded-[32px] border-0 bg-white/90 py-24 text-center shadow-xl">
                <CardContent>
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
                    <FolderKanban className="h-10 w-10 text-orange-500" />
                  </div>

                  <h3 className="mt-8 text-3xl font-black">No briefs found</h3>

                  <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    Try adjusting your filters or create a new project brief.
                  </p>

                  <Button
                    onClick={handleNewBrief}
                    className="mt-8 h-12 rounded-2xl bg-orange-500 px-6 text-white hover:bg-orange-600"
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
    </div>
  );
}
