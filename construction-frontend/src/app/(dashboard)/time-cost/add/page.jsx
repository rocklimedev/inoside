"use client";

import React from "react";
import TCForm from "@/components/time-cost/TCForm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TimeCostAddPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/time-cost"); // or wherever your list page is
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Form */}
      <TCForm
        isNew={true}
        projectId={null} // Will be selected inside the form
        item={null}
      />
    </div>
  );
}
