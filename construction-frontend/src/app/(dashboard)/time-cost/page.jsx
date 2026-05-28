"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Plus, DollarSign, Loader2, Trash2 } from "lucide-react";

import { toast } from "sonner";

import {
  useGetCostEstimatesQuery,
  useDeleteCostEstimateMutation,
} from "@/api/projects/costEstimatesApi";

const STATUS_MAP = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-600",
  },
  completed: {
    label: "Document Ready",
    color: "bg-blue-50 text-blue-600",
  },
  approved: {
    label: "Approved",
    color: "bg-green-50 text-green-600",
  },
};

export default function TimeCostPage({ projectId }) {
  const router = useRouter();

  const { user } = useAuth();

  const {
    data: items = [],
    isLoading,
    refetch,
  } = useGetCostEstimatesQuery(projectId);

  const [deleteCostEstimate] = useDeleteCostEstimateMutation();

  const handleNewEstimate = () => {
    router.push(`/time-cost/add`);
  };

  const handleDelete = async (estimateId) => {
    if (!confirm("Are you sure you want to delete this estimate?")) return;

    try {
      await deleteCostEstimate(estimateId).unwrap();

      toast.success("Estimate deleted");

      refetch();
    } catch {
      toast.error("Failed to delete estimate");
    }
  };

  const openItem = (item) => {
    router.push(`/time-cost/${item.id}?projectId=${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="timecost-page">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Project Cost Estimates
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {items.length} estimate
              {items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button
            onClick={handleNewEstimate}
            className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Estimate
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <DollarSign className="w-16 h-16 text-gray-200 mx-auto mb-4" />

              <p className="text-gray-400">No cost estimates created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const st = STATUS_MAP[item.status] || STATUS_MAP.draft;

                return (
                  <Card
                    key={item.id}
                    className="p-6 hover:shadow-xl hover:border-[#ef7f1b]/30 cursor-pointer transition-all"
                    onClick={() => openItem(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className={`${st.color} text-xs`}>
                          {st.label}
                        </Badge>

                        <p className="font-semibold text-lg mt-3">
                          {item.estimate_type}
                        </p>

                        <p className="text-xl font-bold text-[#ef7f1b] mt-1">
                          ₹
                          {Number(
                            item.tentative_total_cost || 0,
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-4">
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </p>
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
