"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

import BoqViewer from "@/components/boq/BoqViewer";
import { useGetBoqByIdQuery } from "@/api/boqApi";

export default function BoqViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const boqId = searchParams.get("boqId");

  // Early validation
  if (!boqId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-black mb-2">Missing BOQ ID</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Please provide a valid BOQ ID in the URL. <br />
          Example: <span className="font-mono">?boqId=your-boq-id</span>
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const {
    data: boq,
    isLoading,
    error,
    refetch,
  } = useGetBoqByIdQuery(boqId, {
    skip: !boqId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#ef7f1b]" />
          <p className="text-sm text-gray-500">Loading BOQ...</p>
        </div>
      </div>
    );
  }

  if (error || !boq) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">
          Failed to Load BOQ
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Could not fetch the Bill of Quantities. It may have been deleted or
          you don’t have access.
        </p>

        <div className="text-sm text-gray-400 mb-8 font-mono">
          BOQ ID: {boqId}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return <BoqViewer boq={boq} />;
}
