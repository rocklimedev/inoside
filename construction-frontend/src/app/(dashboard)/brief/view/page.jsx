"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Plus, FileText, AlertCircle } from "lucide-react";

import BriefDocument from "@/components/projects/BriefDocument";
import { useGetBriefQuery } from "@/api/projectsApi";

export default function BriefPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const briefId = searchParams.get("briefId");
  const projectId = searchParams.get("projectId");

  // Early validation
  if (!briefId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[70vh]">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-black mb-2">Missing Brief ID</h2>
        <p className="text-gray-500 mb-6">
          Brief ID is required to view this page.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const {
    data: brief,
    isLoading: briefLoading,
    isError: briefError,
  } = useGetBriefQuery(briefId, {
    skip: !briefId,
  });

  if (briefLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (briefError || !brief) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[70vh]">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <FileText className="w-10 h-10 text-red-300" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">
          Failed to Load Brief
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Could not fetch the brief. It may have been deleted or you don’t have
          access.
        </p>

        <Button variant="outline" onClick={() => router.refresh()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <BriefDocument
      brief={brief}
      briefId={briefId}
      projectId={projectId || brief.projectId} // Fallback to data if URL doesn't have it
      onBack={() => router.back()}
      onEdit={() => router.push(`/brief/add?briefId=${brief.id}`)}
    />
  );
}
