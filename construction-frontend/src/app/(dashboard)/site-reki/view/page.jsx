"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  Edit3,
  Download,
  Building2,
  User2,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useGetRekiByIdQuery } from "@/api/projects/rekiApi";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "";

/* ======================== STATUS MAP ======================== */

const STATUS_MAP = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-600",
  },

  completed: {
    label: "Report Ready",
    color: "bg-blue-50 text-blue-600",
  },

  sent_to_client: {
    label: "Sent",
    color: "bg-orange-50 text-[#ef7f1b]",
  },

  approved: {
    label: "Approved",
    color: "bg-green-50 text-green-600",
  },

  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};

/* ======================== HELPERS ======================== */

const formatValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "0000-00-00"
  ) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value;
};

const BoolBadge = ({ value }) => {
  return value ? (
    <div className="inline-flex items-center gap-1 text-green-600 font-medium">
      <CheckCircle2 className="w-4 h-4" />
      Yes
    </div>
  ) : (
    <div className="inline-flex items-center gap-1 text-red-500 font-medium">
      <XCircle className="w-4 h-4" />
      No
    </div>
  );
};

/* ======================== COMPONENT ======================== */

export default function SiteRekiDocument({
  rekiId: propRekiId,
  onBack,
  onEdit,
}) {
  const searchParams = useSearchParams();

  const queryRekiId = searchParams.get("id");

  const rekiId = propRekiId || queryRekiId;

  const {
    data: item,
    isLoading,
    isError,
  } = useGetRekiByIdQuery(rekiId, {
    skip: !rekiId,
  });

  const st = useMemo(
    () => STATUS_MAP[item?.status] || STATUS_MAP.draft,
    [item?.status],
  );

  /* ======================== DOWNLOAD ======================== */

  const handleDownload = () => {
    const pdf = item?.reki_pdf_url;

    if (pdf) {
      window.open(pdf.startsWith("http") ? pdf : `${BACKEND}${pdf}`, "_blank");
    }
  };

  /* ======================== STATES ======================== */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-sm text-gray-500">Loading Site Reki...</div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-bold text-black">Site Reki Not Found</h2>

          <p className="text-sm text-gray-500 mt-1">
            Invalid or deleted Site Reki report.
          </p>
        </div>
      </div>
    );
  }

  /* ======================== UI ======================== */

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ================= HEADER ================= */}

      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-black"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div>
              <h1 className="text-lg font-bold text-black">
                {item?.project?.name || "Untitled Project"}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-gray-400">
                <div className="flex items-center gap-1">
                  <User2 className="w-3 h-3" />

                  {item?.project?.client?.name || "No Client"}
                </div>

                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />

                  {item?.project_id}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />

                  {item?.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>

            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>
              {st.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            )}

            {item?.reki_pdf_url && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5 mr-1" />
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {/* ================= REPORT HEADER ================= */}

            <div className="p-8 border-b border-gray-200">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-black">BUILD</span>

                <span className="text-xl font-black text-[#ef7f1b]">CON</span>
              </div>

              <h2 className="text-3xl font-bold text-black mt-5">
                Site Reki Report
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Detailed structural and site inspection report
              </p>
            </div>

            {/* ================= BODY ================= */}

            <div className="p-8 space-y-10">
              {/* ================================================= */}
              {/* BASIC INFORMATION */}
              {/* ================================================= */}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ef7f1b] mb-5">
                  1. Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <InfoCard
                    label="Visit Date"
                    value={formatValue(item.visit_date)}
                  />

                  <InfoBooleanCard
                    label="Client Present"
                    value={item.client_present}
                  />

                  <InfoBooleanCard
                    label="Road Access"
                    value={item.road_access}
                  />

                  <InfoBooleanCard
                    label="Unloading Space"
                    value={item.unloading_space}
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* SITE CONDITIONS */}
              {/* ================================================= */}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ef7f1b] mb-5">
                  2. Site Conditions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoCard
                    label="Area Type"
                    value={formatValue(item.area_type)}
                  />

                  <InfoCard
                    label="Neighbouring Buildings"
                    value={formatValue(item.neighbouring_buildings)}
                  />

                  <InfoCard
                    label="Working Restrictions"
                    value={formatValue(item.working_time_restrictions)}
                  />

                  <InfoCard
                    label="Plot Type"
                    value={formatValue(item.plot_type)}
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* STRUCTURE */}
              {/* ================================================= */}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ef7f1b] mb-5">
                  3. Structure Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <InfoBooleanCard
                    label="Existing Structure"
                    value={item.existing_structure}
                  />

                  <InfoCard
                    label="Construction Type"
                    value={formatValue(item.construction_type)}
                  />

                  <InfoCard
                    label="Existing Floors"
                    value={formatValue(item.existing_floors)}
                  />

                  <InfoBooleanCard
                    label="Structural Cracks"
                    value={item.structural_cracks}
                  />

                  <InfoCard
                    label="Built-up Area"
                    value={formatValue(item.built_up_area)}
                  />

                  <InfoCard
                    label="Floor to Floor Height"
                    value={formatValue(item.floor_to_floor_height)}
                  />

                  <InfoCard
                    label="Slab Thickness"
                    value={formatValue(item.slab_thickness)}
                  />

                  <InfoCard
                    label="Columns / Beams Visible"
                    value={formatValue(item.columns_beams_visible)}
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* CONDITION */}
              {/* ================================================= */}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ef7f1b] mb-5">
                  4. Condition Assessment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <InfoCard
                    label="Wall Condition"
                    value={formatValue(item.wall_condition)}
                  />

                  <InfoCard
                    label="Floor Condition"
                    value={formatValue(item.floor_condition)}
                  />

                  <InfoBooleanCard label="Dampness" value={item.dampness} />

                  <InfoCard
                    label="Dampness Location"
                    value={formatValue(item.dampness_location)}
                  />

                  <InfoBooleanCard
                    label="Termite Damage"
                    value={item.termite_damage}
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* SERVICES */}
              {/* ================================================= */}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ef7f1b] mb-5">
                  5. Services & Utilities
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <InfoBooleanCard
                    label="Electrical Wiring"
                    value={item.electrical_wiring}
                  />

                  <InfoCard
                    label="Electrical Panel Location"
                    value={formatValue(item.electrical_panel_location)}
                  />

                  <InfoBooleanCard
                    label="Plumbing Lines"
                    value={item.plumbing_lines}
                  />

                  <InfoCard
                    label="Water Inlet / Outlet"
                    value={formatValue(item.water_inlet_outlet)}
                  />

                  <InfoBooleanCard
                    label="Tanks Present"
                    value={item.tanks_present}
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* RISK */}
              {/* ================================================= */}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ef7f1b] mb-5">
                  6. Demolition & Risk
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <InfoBooleanCard
                    label="Demolition Required"
                    value={item.demolition_required}
                  />

                  <InfoCard
                    label="Demolition Type"
                    value={formatValue(item.demolition_type)}
                  />

                  <InfoBooleanCard
                    label="Safety Concerns"
                    value={item.safety_concerns}
                  />

                  <InfoCard
                    label="Load Bearing Changes"
                    value={formatValue(item.load_bearing_changes)}
                  />

                  <InfoCard
                    label="Beam Cutting"
                    value={formatValue(item.beam_cutting)}
                  />

                  <InfoCard
                    label="Core Drilling"
                    value={formatValue(item.core_drilling)}
                  />

                  <InfoCard
                    label="Structural Consultant Required"
                    value={formatValue(item.structural_consultant_required)}
                  />

                  <InfoCard
                    label="Major Constraints"
                    value={formatValue(item.major_constraints)}
                  />

                  <InfoCard
                    label="Risk Factors"
                    value={formatValue(item.risk_factors)}
                  />

                  <InfoCard
                    label="Suggestions"
                    value={formatValue(item.suggestions)}
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* CLIENT INSTRUCTIONS */}
              {/* ================================================= */}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ef7f1b] mb-5">
                  7. Client Instructions
                </h3>

                <div className="bg-gray-50 border rounded-2xl p-5 text-sm text-gray-700 min-h-[100px] whitespace-pre-wrap">
                  {formatValue(item.client_instructions)}
                </div>
              </section>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

/* ======================== REUSABLE ======================== */

function InfoCard({ label, value }) {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
        {label}
      </p>

      <p className="text-sm text-black mt-2 break-words font-medium">{value}</p>
    </div>
  );
}

function InfoBooleanCard({ label, value }) {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
        {label}
      </p>

      <div className="mt-2">
        <BoolBadge value={value} />
      </div>
    </div>
  );
}
