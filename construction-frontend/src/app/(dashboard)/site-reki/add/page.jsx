"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SiteRekiForm from "@/components/site-reki/SiteRekiForm";

export default function SiteRekiAddPage() {
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId") || undefined;
  const rekiId = searchParams.get("id") || undefined;

  return (
    <SiteRekiForm
      initialProjectId={projectId}
      initialRekiId={rekiId}
      isStandalonePage={true}
    />
  );
}
