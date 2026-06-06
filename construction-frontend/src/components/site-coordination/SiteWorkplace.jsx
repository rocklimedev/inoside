"use client";

import { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

import {
  Building2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Users,
  Package,
  MessageSquare,
  Send,
} from "lucide-react";

import { useGetDailyReportsQuery } from "@/api/projects/dailyReportsApi"; // ← Adjust path if needed

export default function SiteWorkspace({ project, api, user, onBack }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  // RTK Query - Fetch Daily Reports
  const { data: allReports = [], isLoading, error } = useGetDailyReportsQuery();

  // Filter reports for this project
  const projectReports = allReports.filter((r) => r.project_id === project.id);

  const todayReport = projectReports.find(
    (r) => r.date === new Date().toISOString().split("T")[0],
  );

  const recentReports = [...projectReports].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Fetch Notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get(`/site-coordination/notes/${project.id}`);
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [project.id, api]);

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await api.post("/site-coordination/notes", {
        project_id: project.id,
        content: newNote,
      });

      setNotes((prev) => [res.data, ...prev]);
      setNewNote("");
      toast.success("Note added successfully");
    } catch {
      toast.error("Failed to add note");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load daily reports. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="site-workspace">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-black">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-black">{project.name}</h1>
            <p className="text-[11px] text-gray-400">Site Coordination</p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 p-4 md:px-6 bg-gray-50/50 border-b border-gray-100">
        {[
          { label: "Manpower", value: "—", icon: Users },
          { label: "Active Tasks", value: 0, icon: CheckCircle },
          { label: "Open Issues", value: 0, icon: AlertTriangle },
          { label: "Pending Deliveries", value: 0, icon: Truck },
          { label: "Site Stage", value: project.stage || "—", icon: Building2 },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <Card
              key={i}
              className="p-3 text-center"
              data-testid={`site-kpi-${i}`}
            >
              <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-black text-black">{k.value}</p>
              <p className="text-[9px] text-gray-400">{k.label}</p>
            </Card>
          );
        })}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="mx-4 mt-3 bg-gray-100 p-0.5 rounded-lg w-fit">
          <TabsTrigger value="today" className="text-xs px-3 py-1.5">
            Today at Site
          </TabsTrigger>
          <TabsTrigger value="updates" className="text-xs px-3 py-1.5">
            Site Updates
          </TabsTrigger>
          <TabsTrigger value="issues" className="text-xs px-3 py-1.5">
            Issues
          </TabsTrigger>
          <TabsTrigger value="materials" className="text-xs px-3 py-1.5">
            Materials
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs px-3 py-1.5">
            Notes
          </TabsTrigger>
        </TabsList>

        {/* ==================== TODAY ==================== */}
        <TabsContent value="today" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 max-w-3xl space-y-4">
              {todayReport ? (
                <Card className="p-4" data-testid="today-report">
                  <h3 className="text-sm font-bold text-black mb-3">
                    Today's Report
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Work Executed
                      </p>
                      <p className="text-black mt-0.5">
                        {todayReport.work_executed || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Manpower
                      </p>
                      <p className="text-black mt-0.5">
                        {todayReport.manpower_count || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Materials Used
                      </p>
                      <p className="text-black mt-0.5">
                        {todayReport.materials_used || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Progress
                      </p>
                      <p className="text-black mt-0.5">
                        {todayReport.completion_pct || 0}%
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center">
                  <Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">
                    No report for today yet
                  </p>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ==================== UPDATES ==================== */}
        <TabsContent value="updates" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 max-w-3xl">
              {recentReports.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No site updates yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((r, i) => (
                    <Card
                      key={r.id}
                      className="p-4"
                      data-testid={`update-${i}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-black">
                          {r.date}
                        </h4>
                        <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                          {r.completion_pct}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{r.work_executed}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ==================== ISSUES & MATERIALS (Placeholder) ==================== */}
        <TabsContent value="issues" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 text-center py-16">
              <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Issues module coming soon</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="materials" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 text-center py-16">
              <Truck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Materials module coming soon
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ==================== NOTES ==================== */}
        <TabsContent value="notes" className="flex-1 overflow-hidden m-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add coordination note..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  data-testid="site-note-input"
                />
                <Button
                  onClick={addNote}
                  size="sm"
                  className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                  data-testid="add-site-note"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2 max-w-3xl">
                {notes.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No notes yet</p>
                  </div>
                ) : (
                  notes.map((n, i) => (
                    <Card
                      key={n.id}
                      className="p-3"
                      data-testid={`site-note-${i}`}
                    >
                      <p className="text-xs text-black">{n.content}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {n.created_by} •{" "}
                        {n.created_at
                          ? new Date(n.created_at).toLocaleString()
                          : ""}
                      </p>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
