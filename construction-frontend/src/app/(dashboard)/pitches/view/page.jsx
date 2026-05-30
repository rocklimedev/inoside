"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

import PitchDetail from "@/components/pitch/PitchDetail";
import { useGetPitchByIdQuery } from "@/api/projects/pitchesApi";

export default function PitchViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pitchId = searchParams.get("pitchId");

  const {
    data: pitch,
    isLoading,
    error,
    refetch,
  } = useGetPitchByIdQuery(pitchId, {
    skip: !pitchId,
  });

  /* =========================
     ❌ Missing Pitch ID
  ========================= */
  if (!pitchId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 text-center">
        <div className="w-full max-w-md">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4" />

          <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
            Missing Pitch ID
          </h2>

          <p className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed">
            Please provide a valid Pitch ID in the URL. <br />
            <span className="font-mono text-xs sm:text-sm">
              ?pitchId=your-pitch-id
            </span>
          </p>

          <Button className="w-full sm:w-auto" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  /* =========================
     ⏳ Loading State
  ========================= */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-[#ef7f1b]" />
          <p className="text-xs sm:text-sm text-gray-500">Loading Pitch...</p>
        </div>
      </div>
    );
  }

  /* =========================
     ❌ Error State
  ========================= */
  if (error || !pitch) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 text-center">
        <div className="w-full max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
            Failed to Load Pitch
          </h2>

          <p className="text-sm sm:text-base text-gray-500 mb-4 leading-relaxed">
            Could not fetch the Project Pitch. It may have been deleted or you
            don’t have access.
          </p>

          <div className="text-[11px] sm:text-xs text-gray-400 mb-6 font-mono break-all">
            Pitch ID: {pitchId}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>

            <Button onClick={() => router.back()} className="w-full sm:w-auto">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     ✅ Success
  ========================= */
  return (
    <div className="px-3 sm:px-6 lg:px-10 py-4 sm:py-6">
      <PitchDetail pitch={pitch} onBack={() => router.back()} />
    </div>
  );
}
