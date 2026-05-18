"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  useGetAllBriefsQuery,
  useApproveBriefMutation,
  useRequestBriefChangesMutation,
} from "@/api/projectsApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Search,
  LayoutGrid,
  Table2,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  Edit,
  Eye,
  Loader2,
  FileText,
} from "lucide-react";

export default function BriefList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: briefsData = [], isLoading, isError } = useGetAllBriefsQuery();

  const [approveBrief] = useApproveBriefMutation();
  const [requestChanges] = useRequestBriefChangesMutation();

  // ================= TRANSFORM =================
  const briefs = useMemo(() => {
    return briefsData.map((brief) => ({
      id: brief.project_id,
      briefId: brief.id,

      projectName:
        brief.project?.name || brief.project_name || "Untitled Project",

      client:
        brief.project?.client?.name || brief.client_name || "Unknown Client",

      status: brief.status || "draft",

      stage: brief.project?.status || "Planning",

      createdAt: brief.created_at,
      updatedAt: brief.updated_at,

      architect:
        brief.project?.assigned_architect?.name ||
        brief.assigned_architect ||
        "—",

      documentUrl: brief.document_url,

      raw: brief,
    }));
  }, [briefsData]);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    let result = [...briefs];

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter(
        (b) =>
          b.projectName?.toLowerCase().includes(term) ||
          b.client?.toLowerCase().includes(term),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [briefs, search, statusFilter]);

  // ================= STATUS =================
  const getStatusUI = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          className:
            "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200",
          icon: CheckCircle2,
        };

      case "changes_requested":
        return {
          label: "Changes Requested",
          className:
            "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200",
          icon: AlertTriangle,
        };

      case "sent_to_client":
        return {
          label: "Sent To Client",
          className:
            "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200",
          icon: FileText,
        };

      default:
        return {
          label: "Draft",
          className:
            "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200",
          icon: Clock3,
        };
    }
  };

  // ================= ACTIONS =================
  const handleOpenBrief = (projectId) => {
    router.push(`/projects/${projectId}/brief`);
  };

  const handleCreateBrief = () => {
    router.push("/brief/add");
  };

  const handleEditBrief = (briefId) => {
    router.push(`/brief/add?briefId=${briefId}`);
  };

  const handleApprove = async (briefId) => {
    try {
      await approveBrief(briefId).unwrap();

      toast.success("Brief approved successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve brief");
    }
  };

  const handleRequestChanges = async (briefId) => {
    const note = prompt("Enter reason for changes");

    if (!note) return;

    try {
      await requestChanges({
        briefId,
        note,
      }).unwrap();

      toast.success("Changes requested");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to request changes");
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh] text-red-500">
        Failed to load briefs
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="brief-page">
      {/* ================= HEADER ================= */}
      <div className="border-b border-border bg-card/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="p-4 md:p-6 space-y-5">
          {/* TOP */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Project Briefs
              </h1>

              <p className="text-sm text-muted-foreground mt-1">
                Manage all project brief documents
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* VIEW TOGGLE */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card">
                {[
                  {
                    key: "grid",
                    icon: LayoutGrid,
                  },
                  {
                    key: "table",
                    icon: Table2,
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setViewMode(item.key)}
                    className={`p-2.5 transition-all ${
                      viewMode === item.key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* NEW */}
              <Button
                onClick={handleCreateBrief}
                className="btn-primary rounded-xl px-5"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Brief
              </Button>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* SEARCH */}
            <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 flex-1 focus-within:border-primary/40 focus-within:shadow-glow transition-all">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />

              <input
                type="text"
                placeholder="Search project or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* FILTER */}
            <div className="flex items-center gap-2 overflow-auto">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                <Filter className="w-3.5 h-3.5" />
                Status
              </div>

              {[
                { key: "all", label: "All" },
                { key: "draft", label: "Draft" },
                { key: "sent_to_client", label: "Sent" },
                { key: "approved", label: "Approved" },
                {
                  key: "changes_requested",
                  label: "Changes",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setStatusFilter(item.key)}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap border transition-all ${
                    statusFilter === item.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* COUNT */}
          <div className="text-xs text-muted-foreground">
            {filtered.length} brief
            {filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {/* ================= GRID VIEW ================= */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
              {filtered.map((brief, i) => {
                const st = getStatusUI(brief.status);

                return (
                  <Card
                    key={brief.briefId}
                    onClick={() => handleOpenBrief(brief.id)}
                    className="card-modern p-5 cursor-pointer group animate-fadeInUp"
                    style={{
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    {/* TOP */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-lg shrink-0">
                          {brief.projectName?.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                            {brief.projectName}
                          </h3>

                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {brief.client}
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>

                    {/* STATUS */}
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <Badge
                        className={`${st.className} border text-[11px] px-3 py-1`}
                      >
                        <st.icon className="w-3.5 h-3.5 mr-1" />
                        {st.label}
                      </Badge>

                      <div className="text-[11px] text-muted-foreground">
                        {brief.stage}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          Updated
                        </p>

                        <p className="text-sm mt-1">
                          {brief.updatedAt
                            ? new Date(brief.updatedAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          Architect
                        </p>

                        <p className="text-sm mt-1 truncate">
                          {brief.architect}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div
                      className="mt-6 flex flex-wrap gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleOpenBrief(brief.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Open
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleEditBrief(brief.briefId)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      {brief.status !== "approved" && (
                        <Button
                          size="sm"
                          className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(brief.briefId)}
                        >
                          Approve
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleRequestChanges(brief.briefId)}
                      >
                        Request Changes
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* ================= TABLE VIEW ================= */
            <div className="surface rounded-2xl overflow-hidden min-w-full">
              {/* TABLE HEADER */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-3">Project</div>
                <div className="col-span-2">Client</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Updated</div>
                <div className="col-span-1">Stage</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* ROWS */}
              <div>
                {filtered.map((brief) => {
                  const st = getStatusUI(brief.status);

                  return (
                    <div
                      key={brief.briefId}
                      onClick={() => handleOpenBrief(brief.id)}
                      className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      {/* DESKTOP */}
                      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        {/* PROJECT */}
                        <div className="col-span-3 flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                            {brief.projectName?.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {brief.projectName}
                            </p>

                            <p className="text-xs text-muted-foreground truncate">
                              {brief.architect}
                            </p>
                          </div>
                        </div>

                        {/* CLIENT */}
                        <div className="col-span-2 text-sm truncate">
                          {brief.client}
                        </div>

                        {/* STATUS */}
                        <div className="col-span-2">
                          <Badge className={`${st.className} border`}>
                            <st.icon className="w-3.5 h-3.5 mr-1" />
                            {st.label}
                          </Badge>
                        </div>

                        {/* UPDATED */}
                        <div className="col-span-2 text-sm text-muted-foreground">
                          {brief.updatedAt
                            ? new Date(brief.updatedAt).toLocaleDateString()
                            : "—"}
                        </div>

                        {/* STAGE */}
                        <div className="col-span-1 text-sm">{brief.stage}</div>

                        {/* ACTIONS */}
                        <div
                          className="col-span-2 flex justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => handleEditBrief(brief.briefId)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => handleOpenBrief(brief.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* MOBILE */}
                      <div className="lg:hidden p-4 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                              {brief.projectName?.charAt(0)}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold truncate">
                                {brief.projectName}
                              </p>

                              <p className="text-sm text-muted-foreground truncate">
                                {brief.client}
                              </p>
                            </div>
                          </div>

                          <Badge className={`${st.className} border`}>
                            <st.icon className="w-3 h-3 mr-1" />
                            {st.label}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Updated:
                            </span>{" "}
                            {brief.updatedAt
                              ? new Date(brief.updatedAt).toLocaleDateString()
                              : "—"}
                          </div>

                          <div className="text-primary font-medium">
                            {brief.stage}
                          </div>
                        </div>

                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => handleOpenBrief(brief.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Open
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => handleEditBrief(brief.briefId)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EMPTY */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
                <FileText className="w-9 h-9 text-muted-foreground" />
              </div>

              <h3 className="text-xl font-bold">No Briefs Found</h3>

              <p className="text-muted-foreground mt-2 text-center max-w-md">
                Try changing your filters or create a new project brief.
              </p>

              <Button
                onClick={handleCreateBrief}
                className="mt-6 btn-primary rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Brief
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
