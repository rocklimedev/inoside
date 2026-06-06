"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

import CostEstimateDetail from "@/components/time-cost/CostEstimateDetail";
import { useGetCostEstimateByIdQuery } from "@/api/projects/costEstimatesApi";

export default function CostEstimateViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const costEstimateId = searchParams.get("costEstimateId");

  const {
    data: estimate,
    isLoading,
    error,
    refetch,
  } = useGetCostEstimateByIdQuery(costEstimateId, {
    skip: !costEstimateId,
  });

  /* =========================
     ❌ Missing ID
  ========================= */
  if (!costEstimateId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center px-4">
        <div className="max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Missing Cost Estimate ID</h2>
          <p className="text-gray-500 mb-6">
            URL should include{" "}
            <span className="font-mono">?costEstimateId=...</span>
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  /* =========================
     ⏳ Loading
  ========================= */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  /* =========================
     ❌ Error
  ========================= */
  if (error || !estimate) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center px-4">
        <div className="max-w-md w-full">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to Load Estimate</h2>

          <p className="text-gray-500 mb-4">
            Could not find this cost estimate.
          </p>

          <div className="text-xs text-gray-400 font-mono mb-6">
            ID: {costEstimateId}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>

            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     ✅ Success
  ========================= */
  return (
    <div className="px-4 py-6">
      <CostEstimateDetail
        costEstimate={estimate}
        onBack={() => router.back()}
      />
    </div>
  );
}
