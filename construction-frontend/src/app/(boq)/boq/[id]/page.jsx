"use client";

import React from "react";
import BoqViewer from "@/components/boq/BoqViewer";
import { useGetBoqByIdQuery } from "@/api/boqApi";
import { Loader2 } from "lucide-react";

export default function BoqViewPage({ params }) {
  const { id } = React.use(params);

  const { data: boq, isLoading, error } = useGetBoqByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  if (error || !boq) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Failed to load BOQ. Please try again.
      </div>
    );
  }

  return <BoqViewer boq={boq} />;
}
