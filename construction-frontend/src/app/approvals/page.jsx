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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  ThumbsUp,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  MessageSquare,
  Eye,
  AlertTriangle,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const STATUS_MAP = {
  approved: {
    color: "bg-green-50 text-green-700",
    icon: CheckCircle,
    label: "Approved",
  },
  pending: {
    color: "bg-yellow-50 text-yellow-700",
    icon: Clock,
    label: "Pending",
  },
  pending_review: {
    color: "bg-yellow-50 text-yellow-700",
    icon: Clock,
    label: "Pending Review",
  },
  rejected: {
    color: "bg-red-50 text-[#e31d3b]",
    icon: XCircle,
    label: "Rejected",
  },
  changes_requested: {
    color: "bg-orange-50 text-[#ef7f1b]",
    icon: RefreshCw,
    label: "Changes Requested",
  },
  rectification: {
    color: "bg-orange-50 text-[#ef7f1b]",
    icon: RefreshCw,
    label: "Rectification",
  },
  draft: { color: "bg-gray-100 text-gray-600", icon: FileText, label: "Draft" },
  completed: {
    color: "bg-green-50 text-green-700",
    icon: CheckCircle,
    label: "Completed",
  },
};

const getStatus = (s) => STATUS_MAP[s] || STATUS_MAP.pending;

export default function ApprovalsPage() {
  const { api, user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    api
      .get("/approvals/all")
      .then((r) => setApprovals(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabFiltered = (tab) => {
    let items = approvals;
    if (search)
      items = items.filter(
        (a) =>
          a.document?.toLowerCase().includes(search.toLowerCase()) ||
          a.project?.toLowerCase().includes(search.toLowerCase()),
      );
    if (tab === "design") return items.filter((a) => a.module === "Design");
    if (tab === "execution")
      return items.filter((a) => a.module === "Execution");
    if (tab === "quality") return items.filter((a) => a.module === "Quality");
    if (tab === "signoffs") return items.filter((a) => a.module === "Handover");
    if (tab === "pending")
      return items.filter((a) =>
        ["pending", "pending_review"].includes(a.status),
      );
    if (tab === "approved")
      return items.filter(
        (a) => a.status === "approved" || a.status === "completed",
      );
    if (tab === "rejected")
      return items.filter((a) =>
        ["rejected", "changes_requested", "rectification"].includes(a.status),
      );
    return items;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  const pendingCount = approvals.filter((a) =>
    ["pending", "pending_review"].includes(a.status),
  ).length;

  return (
    <div className="flex flex-col h-full" data-testid="approvals-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="approvals-title"
            >
              Approvals
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {approvals.length} total &middot; {pendingCount} pending
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search approvals..."
            className="pl-10"
            data-testid="approvals-search"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-3 bg-white border-b border-gray-100">
          <TabsList className="bg-gray-100 p-0.5 rounded-lg w-fit">
            {[
              { val: "all", label: "All" },
              { val: "design", label: "Design" },
              { val: "execution", label: "Execution" },
              { val: "quality", label: "Quality" },
              { val: "signoffs", label: "Sign-offs" },
              { val: "pending", label: "Pending" },
              { val: "approved", label: "Approved" },
              { val: "rejected", label: "Rejected" },
            ].map((t) => (
              <TabsTrigger
                key={t.val}
                value={t.val}
                className="text-xs px-3 py-1.5"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {[
          "all",
          "design",
          "execution",
          "quality",
          "signoffs",
          "pending",
          "approved",
          "rejected",
        ].map((tab) => (
          <TabsContent
            key={tab}
            value={tab}
            className="flex-1 overflow-hidden m-0"
          >
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2 max-w-4xl">
                {tabFiltered(tab).length === 0 ? (
                  <div className="text-center py-16">
                    <ThumbsUp className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No approvals found</p>
                  </div>
                ) : (
                  tabFiltered(tab).map((a, i) => {
                    const st = getStatus(a.status);
                    const StIcon = st.icon;
                    return (
                      <Card
                        key={`${a.id}-${i}`}
                        className="p-3 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveItem(a)}
                        data-testid={`approval-item-${i}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${st.color}`}
                        >
                          <StIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-black truncate">
                            {a.document}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                            <span>{a.project}</span>
                            <span>&middot;</span>
                            <span>{a.module}</span>
                            {a.version && (
                              <>
                                <span>&middot;</span>
                                <span>{a.version}</span>
                              </>
                            )}
                            {a.sent_by && (
                              <>
                                <span>&middot;</span>
                                <span>by {a.sent_by}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={`${st.color} text-[9px] border-0 shrink-0`}
                        >
                          {st.label}
                        </Badge>
                        {a.remarks_count > 0 && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0">
                            <MessageSquare className="w-3 h-3" />
                            {a.remarks_count}
                          </span>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {/* Approval Detail Sheet */}
      <Sheet
        open={!!activeItem}
        onOpenChange={(o) => {
          if (!o) setActiveItem(null);
        }}
      >
        <SheetContent className="w-[420px] sm:w-[480px] p-0">
          {activeItem && (
            <div className="flex flex-col h-full" data-testid="approval-detail">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-black">
                  {activeItem.document}
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {activeItem.project} &middot; {activeItem.module}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {activeItem.version && (
                    <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                      {activeItem.version}
                    </Badge>
                  )}
                  <Badge
                    className={`${getStatus(activeItem.status).color} text-[9px] border-0`}
                  >
                    {getStatus(activeItem.status).label}
                  </Badge>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#ef7f1b] mb-2">
                      Details
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sent by</span>
                        <span className="text-black">
                          {activeItem.sent_by || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date</span>
                        <span className="text-black">
                          {activeItem.date
                            ? new Date(activeItem.date).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Module</span>
                        <span className="text-black">{activeItem.module}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Remarks</span>
                        <span className="text-black">
                          {activeItem.remarks_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  {activeItem.history && activeItem.history.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#ef7f1b] mb-2">
                        Approval Timeline
                      </h3>
                      <div className="space-y-3">
                        {activeItem.history.map((h, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-[#ef7f1b]" />
                              {i < activeItem.history.length - 1 && (
                                <div className="w-px flex-1 bg-gray-200 mt-1" />
                              )}
                            </div>
                            <div className="pb-3">
                              <p className="text-xs font-medium text-black">
                                {h.action || h.version || "Updated"}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                by {h.by || h.revised_by || "—"} &middot;{" "}
                                {h.timestamp
                                  ? new Date(h.timestamp).toLocaleDateString()
                                  : ""}
                              </p>
                              {h.remarks && (
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                  {h.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
