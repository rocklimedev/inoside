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
} from "@/api/projects/briefsApi";

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

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  AlertCircle,
  Send,
  Undo,
  FileText,
  Edit,
  ChevronRight,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const STATUS_STYLES = {
  Approved: "bg-emerald-100 text-emerald-700",
  "Changes Requested": "bg-red-100 text-red-700",
  sent_to_client: "bg-amber-100 text-amber-700",
  draft: "bg-slate-100 text-slate-700",
  Pending: "bg-blue-100 text-blue-700",
};

export default function BriefList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");

  // API
  const { data: briefsData = [], isLoading } = useGetAllBriefsQuery();

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

    const term = search.toLowerCase().trim();
    if (term) {
      result = result.filter((b) =>
        [b.projectName, b.client, b.clientEmail, b.stage, b.briefStatus]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((b) => b.briefStatus === filterStatus);
    }

    // Sort by latest
    result.sort(
      (a, b) =>
        new Date(b.raw?.updated_at || 0).getTime() -
        new Date(a.raw?.updated_at || 0).getTime(),
    );

    return result;
  }, [briefs, search, filterStatus]);

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

  const handleEditBrief = (briefId) => {
    router.push(`/brief/add?briefId=${briefId}`);
  };

  const handleViewBrief = (projectId, briefId) => {
    router.push(`/brief/view?briefId=${briefId}&projectId=${projectId}`);
  };

  const handleNewBrief = () => {
    router.push("/brief/add");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-[#fafafa]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* HEADER */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Project Briefs</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredBriefs.length} briefs found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-[#ef7f1b] text-white" : "text-gray-500"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-[#ef7f1b] text-white" : "text-gray-500"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleNewBrief}
              className="bg-[#ef7f1b] hover:bg-[#d96f18]"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Brief
            </Button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search briefs, clients..."
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-52">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Changes Requested">
                Changes Requested
              </SelectItem>
              <SelectItem value="sent_to_client">Sent to Client</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filteredBriefs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No briefs found. Try adjusting your search or filters.
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredBriefs.map((brief) => (
                <Card
                  key={brief.briefId}
                  onClick={() => handleViewBrief(brief.id, brief.briefId)}
                  className="cursor-pointer rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-2xl text-[#ef7f1b]">
                      {brief.projectName?.[0] || "B"}
                    </div>

                    <Badge
                      className={`text-xs ${STATUS_STYLES[brief.briefStatus] || "bg-gray-100"}`}
                    >
                      {brief.briefStatus}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg truncate mb-1">
                    {brief.projectName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {brief.client}
                  </p>

                  <div className="mt-4 text-xs text-gray-400">
                    Updated {brief.lastUpdated}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#ef7f1b] hover:text-[#ef7f1b]/80 p-0 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBrief(brief.briefId);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleViewBrief(brief.id, brief.briefId)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Brief
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
                          onClick={() => handleRequestChanges(brief.briefId)}
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
                </Card>
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-3">
              {filteredBriefs.map((brief) => (
                <Card
                  key={brief.briefId}
                  onClick={() => handleViewBrief(brief.id, brief.briefId)}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:shadow-md transition"
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-2xl text-[#ef7f1b]">
                    {brief.projectName?.[0] || "B"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{brief.projectName}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {brief.client} • {brief.lastUpdated}
                    </p>
                  </div>

                  <Badge
                    className={`text-xs ${STATUS_STYLES[brief.briefStatus] || "bg-gray-100"}`}
                  >
                    {brief.briefStatus}
                  </Badge>

                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
