"use client";

import React, { useMemo } from "react";
import { ArrowLeft, Edit3, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetRekiQuery } from "@/api/projectsApi";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "";

/* ======================== STATUS MAP ======================== */
const STATUS_MAP = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  completed: { label: "Report Ready", color: "bg-blue-50 text-blue-600" },
  sent_to_client: { label: "Sent", color: "bg-orange-50 text-[#ef7f1b]" },
  approved: { label: "Approved", color: "bg-green-50 text-green-600" },
  changes_requested: {
    label: "Changes Requested",
    color: "bg-red-50 text-[#e31d3b]",
  },
};

/* ======================== COMPONENT ======================== */
export default function SiteRekiDocument({ rekiId, onBack, onEdit }) {
  const { data: item } = useGetRekiQuery(rekiId);

  const st = useMemo(
    () => STATUS_MAP[item?.status] || STATUS_MAP.draft,
    [item?.status],
  );

  const handleDownload = () => {
    if (item?.document_url) {
      window.open(`${BACKEND}${item.document_url}`, "_blank");
    }
  };

  const docSections = [
    {
      title: "Site Details",
      fields: [
        ["Address", item?.site_address],
        ["Coordinates", item?.location_coordinates],
        ["Access", item?.site_access_conditions],
      ],
    },
    {
      title: "Measurements",
      fields: [
        ["Plot Size", item?.plot_size],
        ["Height Restrictions", item?.height_restrictions],
        ["Setback Rules", item?.setback_rules],
      ],
    },
    {
      title: "Context",
      fields: [
        ["Neighbors", item?.neighboring_buildings],
        ["Road Width", item?.road_width],
        ["Sun", item?.sun_orientation],
        ["Noise", item?.noise_levels],
      ],
    },
    {
      title: "Utilities",
      fields: [
        ["Water", item?.water_connection],
        ["Electricity", item?.electricity],
        ["Drainage", item?.drainage],
        ["Internet", item?.internet_connectivity],
      ],
    },
    {
      title: "Observations",
      fields: [
        ["Soil", item?.soil_condition],
        ["Limitations", item?.structural_limitations],
        ["Risks", item?.risk_factors],
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ================= HEADER ================= */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base font-bold text-black">
                {item?.project_name || "Untitled Project"}
              </h1>
              <p className="text-[11px] text-gray-400">Site Reki Report</p>
            </div>

            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>
              {st.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* ===== REPORT HEADER ===== */}
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>

              <h2 className="text-2xl font-bold text-black mt-4">
                Site Reki Report
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {item?.project_name || "—"} •{" "}
                {item?.created_at
                  ? new Date(item.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            {/* ===== SECTIONS ===== */}
            <div className="p-8 space-y-8">
              {docSections.map((sec, i) => (
                <div key={sec.title}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                    {i + 1}. {sec.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {sec.fields.map(([label, value], j) => (
                      <div
                        key={j}
                        className={!value ? "opacity-40" : undefined}
                      >
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                          {label}
                        </p>
                        <p className="text-sm text-black mt-0.5">
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* ===== IMAGES ===== */}
              {(item?.site_photos?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">
                    6. Site Photos
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {item.site_photos.map((p, i) => (
                      <img
                        key={i}
                        src={`${BACKEND}${p.url}`}
                        alt={p.name || `photo-${i}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
