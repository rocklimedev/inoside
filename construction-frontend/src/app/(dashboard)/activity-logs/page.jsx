"use client";

import { useMemo, useState } from "react";

import { useGetActivityLogsQuery } from "@/api/activityLogApi";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import {
  Search,
  Activity,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  User,
} from "lucide-react";

const SEVERITIES = ["all", "INFO", "WARNING", "ERROR", "CRITICAL"];

const CONTEXTS = [
  "all",
  "AUTH",
  "USER",
  "PROJECT",
  "INVENTORY",
  "BOQ",
  "VENDOR",
  "CLIENT",
  "SITE",
  "TASK",
  "DRAWING",
  "COST_ESTIMATE",
];

const severityColor = (severity) => {
  switch (severity) {
    case "INFO":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "WARNING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "ERROR":
      return "bg-red-50 text-red-700 border-red-200";

    case "CRITICAL":
      return "bg-red-100 text-red-900 border-red-300";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const severityIcon = (severity) => {
  switch (severity) {
    case "INFO":
      return <CheckCircle2 className="w-4 h-4" />;

    case "WARNING":
      return <AlertCircle className="w-4 h-4" />;

    case "ERROR":
      return <AlertCircle className="w-4 h-4" />;

    case "CRITICAL":
      return <ShieldAlert className="w-4 h-4" />;

    default:
      return <Activity className="w-4 h-4" />;
  }
};

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [contextTag, setContextTag] = useState("all");

  const [selectedLog, setSelectedLog] = useState(null);

  const limit = 20;

  const { data, isLoading } = useGetActivityLogsQuery({
    page,
    limit,
    severity: severity !== "all" ? severity : undefined,
    contextTag: contextTag !== "all" ? contextTag : undefined,
  });

  const logs = data?.rows || [];
  const total = data?.count || 0;

  const totalPages = Math.ceil(total / limit);

  const filteredLogs = useMemo(() => {
    if (!search) return logs;

    const query = search.toLowerCase();

    return logs.filter(
      (log) =>
        log.title?.toLowerCase().includes(query) ||
        log.userName?.toLowerCase().includes(query) ||
        log.description?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.contextTag?.toLowerCase().includes(query),
    );
  }, [logs, search]);

  const showPagination = total > limit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        {" "}
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-muted/20">
      {/* HEADER */}{" "}
      <div className="border-b bg-white px-6 py-5">
        {" "}
        <div className="mb-5">
          {" "}
          <h1 className="text-2xl font-bold">Activity Logs </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Audit trail and system activities
          </p>
        </div>
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">
              Total Activities
            </div>

            <div className="text-2xl font-bold mt-1">{total}</div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Info Logs</div>

            <div className="text-2xl font-bold text-blue-600 mt-1">
              {logs.filter((item) => item.severity === "INFO").length}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Warning Logs</div>

            <div className="text-2xl font-bold text-yellow-600 mt-1">
              {logs.filter((item) => item.severity === "WARNING").length}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Error Logs</div>

            <div className="text-2xl font-bold text-red-600 mt-1">
              {
                logs.filter(
                  (item) =>
                    item.severity === "ERROR" || item.severity === "CRITICAL",
                ).length
              }
            </div>
          </Card>
        </div>
        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search logs..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={contextTag}
            onValueChange={(value) => {
              setPage(1);
              setContextTag(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {CONTEXTS.map((context) => (
                <SelectItem key={context} value={context}>
                  {context === "all" ? "All Modules" : context}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={severity}
            onValueChange={(value) => {
              setPage(1);
              setSeverity(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {SEVERITIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* TABLE */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold">
                      Activity
                    </th>

                    <th className="text-left px-4 py-3 font-semibold">User</th>

                    <th className="text-left px-4 py-3 font-semibold">
                      Context
                    </th>

                    <th className="text-left px-4 py-3 font-semibold">
                      Action
                    </th>

                    <th className="text-left px-4 py-3 font-semibold">
                      Module
                    </th>

                    <th className="text-left px-4 py-3 font-semibold">
                      Severity
                    </th>

                    <th className="text-left px-4 py-3 font-semibold">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.activityLogId}
                      className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {severityIcon(log.severity)}

                          <div>
                            <div className="font-medium">{log.title}</div>

                            <div className="text-xs text-muted-foreground">
                              {log.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {log.userName || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant="outline">{log.contextTag}</Badge>
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant="secondary">{log.action}</Badge>
                      </td>

                      <td className="px-4 py-4">{log.moduleName}</td>

                      <td className="px-4 py-4">
                        <Badge className={severityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {!filteredLogs.length && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No activity logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {showPagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Total Logs: {total}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      {/* DETAIL DRAWER */}
      <Sheet
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <SheetContent className="sm:max-w-[550px] overflow-y-auto">
          {selectedLog && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">{selectedLog.title}</h2>

                <p className="text-sm text-muted-foreground mt-2">
                  {selectedLog.description}
                </p>
              </div>

              <Badge className={severityColor(selectedLog.severity)}>
                {selectedLog.severity}
              </Badge>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-muted-foreground">User</p>

                  <p>{selectedLog.userName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Action</p>

                  <p>{selectedLog.action}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Context</p>

                  <p>{selectedLog.contextTag}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Module</p>

                  <p>{selectedLog.moduleName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Reference Type
                  </p>

                  <p>{selectedLog.referenceType}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Created At</p>

                  <p>{new Date(selectedLog.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Reference ID
                </p>

                <div className="rounded border p-3 break-all text-sm">
                  {selectedLog.referenceId}
                </div>
              </div>

              {selectedLog.metadata && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Metadata</p>

                  <pre className="rounded border bg-muted p-3 text-xs overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.oldValues && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Old Values
                  </p>

                  <pre className="rounded border bg-muted p-3 text-xs overflow-auto">
                    {JSON.stringify(selectedLog.oldValues, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newValues && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    New Values
                  </p>

                  <pre className="rounded border bg-muted p-3 text-xs overflow-auto">
                    {JSON.stringify(selectedLog.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
