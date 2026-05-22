"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

import PitchDetail from "@/components/pitch/PitchDetail";
import { useGetPitchQuery } from "@/api/projectsApi";

export default function PitchViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pitchId = searchParams.get("pitchId");

  // ✅ Always call the hook at the top level (Rules of Hooks)
  const {
    data: pitch,
    isLoading,
    error,
    refetch,
  } = useGetPitchQuery(pitchId, {
    skip: !pitchId, // This is the correct way to skip when no ID
  });

  // Early validation - AFTER hook is called
  if (!pitchId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-black mb-2">Missing Pitch ID</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Please provide a valid Pitch ID in the URL. <br />
          Example: <span className="font-mono">?pitchId=your-pitch-id</span>
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#ef7f1b]" />
          <p className="text-sm text-gray-500">Loading Pitch...</p>
        </div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">
          Failed to Load Pitch
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Could not fetch the Project Pitch. It may have been deleted or you
          don’t have access.
        </p>

        <div className="text-sm text-gray-400 mb-8 font-mono">
          Pitch ID: {pitchId}
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

  return <PitchDetail pitch={pitch} onBack={() => router.back()} />;
}
