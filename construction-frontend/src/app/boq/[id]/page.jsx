"use client";

import React from "react";
import { useParams } from "next/navigation";
import BoqViewer from "@/components/boq/BoqViewer";
import { useGetBoqByIdQuery } from "@/api/boqApi";
import { Loader2 } from "lucide-react";

export default function BoqViewPage() {
  const params = useParams();
  const id = params?.id;

  const {
    data: boq,
    isLoading,
    error,
  } = useGetBoqByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  if (error || !boq) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 p-8 text-center">
        Failed to load BOQ.
        <br />
        ID: {id || "missing"}
        <br />
        Error: {error?.toString() || "No data returned"}
      </div>
    );
  }

  return <BoqViewer boq={boq} />;
}
