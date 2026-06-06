"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
      return "bg-blue-50 text-blue-700";
    case "WARNING":
      return "bg-yellow-50 text-yellow-700";
    case "ERROR":
      return "bg-red-50 text-red-700";
    case "CRITICAL":
      return "bg-red-100 text-red-900";
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
  const { api } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [contextTag, setContextTag] = useState("all");

  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    if (!api) {
      setLoading(false);
      return;
    }

    api
      .get("/activity-logs")
      .then((res) => {
        setLogs(res.data.rows || []);
      })
      .catch((err) => {
        console.error("Failed to fetch activity logs", err);
      })
      .finally(() => setLoading(false));
  }, [api]);

  const filteredLogs = logs.filter((log) => {
    if (
      search &&
      !log.title?.toLowerCase().includes(search.toLowerCase()) &&
      !log.userName?.toLowerCase().includes(search.toLowerCase()) &&
      !log.description?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (severity !== "all" && log.severity !== severity) {
      return false;
    }

    if (contextTag !== "all" && log.contextTag !== contextTag) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        {" "}
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {" "}
      <div className="border-b bg-white p-4 md:px-6">
        {" "}
        <div className="mb-4">
          {" "}
          <h1 className="text-xl font-black">Activity Logs </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {logs.length} activities tracked
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <Input
              placeholder="Search activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={contextTag} onValueChange={setContextTag}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {CONTEXTS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All Modules" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase">
                  <th className="text-left px-4 py-3">Activity</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Module</th>
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">Severity</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.activityLogId}
                    className="border-t cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {severityIcon(log.severity)}
                        <span className="font-medium">{log.title}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">{log.userName || "-"}</td>

                    <td className="px-4 py-3">
                      <Badge variant="outline">{log.contextTag}</Badge>
                    </td>

                    <td className="px-4 py-3">{log.action}</td>

                    <td className="px-4 py-3">
                      <Badge className={severityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </ScrollArea>
      <Sheet
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <SheetContent className="w-[500px]">
          {selectedLog && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">{selectedLog.title}</h2>

              <Badge className={severityColor(selectedLog.severity)}>
                {selectedLog.severity}
              </Badge>

              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{selectedLog.description}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">User</p>
                <p>{selectedLog.userName}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Reference Type</p>
                <p>{selectedLog.referenceType}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Module</p>
                <p>{selectedLog.moduleName}</p>
              </div>

              {selectedLog.metadata && (
                <div>
                  <p className="text-xs text-muted-foreground">Metadata</p>

                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
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
