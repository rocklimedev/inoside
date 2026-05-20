"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

import BriefDocument from "@/components/projects/BriefDocument";

// RTK Query Hooks
import { useGetBriefQuery } from "@/api/projectsApi";

export default function BriefPage() {
  const { id: projectId } = useParams();
  const router = useRouter();

  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  // ================= RTK QUERY =================
  const { data: brief, isLoading: briefLoading } = useGetBriefQuery(projectId, {
    skip: !projectId,
  });

  // ================= AUTH PROTECTION =================
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  // ================= LOADING STATE =================
  if (briefLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  // ================= DOCUMENT VIEW =================
  if (brief) {
    return (
      <BriefDocument
        projectId={projectId}
        brief={brief}
        user={user}
        onBack={() => window.history.back()}
        onEdit={() => router.push(`/brief/add?briefId=${brief?.id}`)}
      />
    );
  }

  // ================= EMPTY STATE =================
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[70vh]">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <FileText className="w-10 h-10 text-gray-300" />
      </div>

      <h2 className="text-2xl font-bold text-black mb-2">
        No Brief Created Yet
      </h2>

      <p className="text-gray-500 mb-8 text-center max-w-md">
        Create a project brief to organize project scope, requirements,
        timelines, and client expectations.
      </p>

      <Link href={`/brief/add`}>
        <Button className="bg-[#ef7f1b] hover:bg-[#d66e15]">
          <Plus className="w-4 h-4 mr-2" />
          Create Brief
        </Button>
      </Link>
    </div>
  );
}
