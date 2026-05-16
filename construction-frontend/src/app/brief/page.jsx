"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  Filter,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit,
} from "lucide-react";

import { FilterSection } from "@/components/projects/FilterSection";

const BRIEF_STATUSES = ["Pending", "Approved", "Changes Requested"];

export default function BriefList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ statuses: [] });
  const [sortBy, setSortBy] = useState("date");

  // API
  const { data: briefsData = [], isLoading, error } = useGetAllBriefsQuery();

  const [approveBrief] = useApproveBriefMutation();
  const [requestChanges] = useRequestBriefChangesMutation();

  // Transform API response
  const briefs = useMemo(() => {
    return briefsData.map((brief) => ({
      id: brief.project_id,
      briefId: brief.id,
      projectName: brief.project?.name || "Untitled Project",
      client: brief.project?.client?.name || "—",
      stage: brief.project?.status || "—",
      briefStatus: brief.status || "Pending",
      submittedAt: brief.created_at
        ? new Date(brief.created_at).toLocaleDateString()
        : "—",
      lastUpdated: brief.updated_at
        ? new Date(brief.updated_at).toLocaleDateString()
        : "—",
      raw: brief,
    }));
  }, [briefsData]);

  // Filters + Search + Sorting
  const filteredBriefs = useMemo(() => {
    let result = [...briefs];

    // Search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((b) =>
        [b.projectName, b.client].some((field) =>
          field?.toLowerCase().includes(term),
        ),
      );
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter((b) => filters.statuses.includes(b.briefStatus));
    }

    // Sorting
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
      if (sortBy === "date") {
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [briefs, search, filters, sortBy]);

  const toggleFilter = (value) => {
    setFilters((prev) => ({
      statuses: prev.statuses.includes(value)
        ? prev.statuses.filter((v) => v !== value)
        : [...prev.statuses, value],
    }));
  };

  const clearFilters = () => {
    setFilters({ statuses: [] });
  };

  const handleNewBrief = () => {
    router.push("/brief/add");
  };

  const handleEditBrief = (brief) => {
    router.push(`/brief/add?briefId=${brief.briefId}`);
  };

  const handleApprove = async (briefId) => {
    if (!confirm("Approve this brief?")) return;

    try {
      await approveBrief(briefId).unwrap();
      toast.success("Brief approved successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve brief");
    }
  };

  const handleRequestChanges = async (briefId) => {
    const note = prompt("Enter reason for changes:");

    if (!note) return;

    try {
      await requestChanges({ briefId, note }).unwrap();
      toast.success("Change request sent");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to request changes");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive p-6">Failed to load briefs.</div>;
  }

  return (
    <div className="flex h-full" data-testid="brief-list">
      {/* Filters Sidebar */}
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
              <X className="w-5 h-5" />
            </button>
          </div>

          <FilterSection
            title="Brief Status"
            items={BRIEF_STATUSES}
            selected={filters.statuses}
            onToggle={toggleFilter}
          />

          {filters.statuses.length > 0 && (
            <button
              onClick={clearFilters}
              className="mt-6 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-black">Project Briefs</h1>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 border focus-within:border-ring">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search briefs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-input bg-card rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="project">Project Name</option>
                <option value="status">Status</option>
                <option value="date">Last Updated</option>
              </select>

              <Button
                onClick={handleNewBrief}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Brief
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            {filteredBriefs.length} brief
            {filteredBriefs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Brief List */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="space-y-4">
              {filteredBriefs.map((brief) => (
                <Card
                  key={brief.briefId}
                  className="p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {brief.projectName}
                        </h3>
                        <Badge variant="outline">{brief.stage}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        {brief.client}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                      {/* Status */}
                      <Badge
                        className={
                          brief.briefStatus === "Approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : brief.briefStatus === "Changes Requested"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                        }
                      >
                        {brief.briefStatus === "Approved" && (
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        )}
                        {brief.briefStatus === "Changes Requested" && (
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        )}
                        {brief.briefStatus}
                      </Badge>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBrief(brief)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>

                        {brief.briefStatus !== "Approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(brief.briefId)}
                          >
                            Approve
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestChanges(brief.briefId)}
                        >
                          Request Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredBriefs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No briefs found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
