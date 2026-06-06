"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Trash2,
  DollarSign,
  Loader2,
} from "lucide-react";

import {
  useGetAllCostEstimatesQuery,
  useDeleteCostEstimateMutation,
} from "@/api/projects/costEstimatesApi";

const STATUS_MAP = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  completed: { label: "Document Ready", color: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
};

export default function TimeCostPage() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: items = [],
    isLoading,
    refetch,
  } = useGetAllCostEstimatesQuery();

  const [deleteCostEstimate] = useDeleteCostEstimateMutation();

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");

  // ======================================================
  // FILTERED DATA
  // ======================================================
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((item) =>
        [item.estimate_type, item.project?.project_name, item.project?.name]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    return result;
  }, [items, search]);

  const handleNewEstimate = () => {
    router.push("/time-cost/add");
  };

  const handleDelete = async (estimateId) => {
    if (!confirm("Are you sure you want to delete this estimate?")) return;

    try {
      await deleteCostEstimate(estimateId).unwrap();
      toast.success("Estimate deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete estimate");
    }
  };

  const openItem = (item) => {
    router.push(`/time-cost/view?costEstimateId=${item.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* HEADER */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Project Cost Estimates</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredItems.length} estimate
              {filteredItems.length !== 1 ? "s" : ""}
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
              onClick={handleNewEstimate}
              className="bg-[#ef7f1b] hover:bg-[#d96f18]"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Estimate
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search estimates or projects..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold">No cost estimates found</h3>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                return (
                  <Card
                    key={item.id}
                    className="group rounded-2xl border bg-white p-5 hover:-translate-y-1 hover:shadow-lg transition cursor-pointer"
                    onClick={() => openItem(item)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-[#ef7f1b]" />
                      </div>
                      <Badge className={st.color}>{st.label}</Badge>
                    </div>

                    <h3 className="font-bold text-lg truncate group-hover:text-[#ef7f1b]">
                      {item.estimate_type}
                    </h3>

                    {item.project && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {item.project.project_name || item.project.name}
                      </p>
                    )}

                    <div className="mt-6">
                      <p className="text-xs text-gray-400">Tentative Total</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ₹
                        {Number(item.tentative_total_cost || 0).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                      {item.created_at &&
                        new Date(item.created_at).toLocaleDateString("en-IN")}
                    </div>

                    <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* ================= LIST VIEW ================= */
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                return (
                  <Card
                    key={item.id}
                    className="flex items-center gap-4 p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => openItem(item)}
                  >
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[#ef7f1b]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{item.estimate_type}</p>
                      {item.project && (
                        <p className="text-sm text-gray-500 truncate">
                          {item.project.project_name || item.project.name}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ₹
                        {Number(item.tentative_total_cost || 0).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                      <Badge className={st.color}>{st.label}</Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
