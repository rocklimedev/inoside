import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Trash2,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Award,
  Clock,
  Building2,
  Star,
  Package,
  Wrench,
  FileText,
} from "lucide-react";

/* ================= STAR RATING ================= */
const ratingStars = (rating = 0) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "fill-[#ef7f1b] text-[#ef7f1b]"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

/* ================= SECTION ================= */
function ProfileSection({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 md:p-4 shadow-sm">
      <h3 className="mb-3 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-[#ef7f1b]">
        {title}
      </h3>
      <div className="space-y-3 md:space-y-4">{children}</div>
    </div>
  );
}

/* ================= FIELD ================= */
function ProfileField({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-orange-50 shrink-0">
        <Icon className="h-4 w-4 text-[#ef7f1b]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] md:text-[10px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm leading-relaxed text-black">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
export default function VendorProfile({ vendor, isClient, onDelete }) {
  return (
    <div
      className="flex h-full flex-col bg-[#fafafa]"
      data-testid="vendor-profile"
    >
      {/* ================= HEADER ================= */}
      <div className="border-b bg-white px-4 md:px-6 py-4 md:py-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-start gap-3 md:gap-4 min-w-0">
            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-orange-50 text-lg md:text-xl font-black text-[#ef7f1b]">
              {vendor.name?.[0] || "V"}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-black truncate">
                {vendor.name}
              </h2>

              {vendor.company_name && (
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  {vendor.company_name}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-orange-50 text-[#ef7f1b] text-[10px] border-0">
                  {vendor.type_of_business || vendor.type?.name || "Vendor"}
                </Badge>

                {ratingStars(vendor.rating || 0)}
              </div>
            </div>
          </div>

          {/* DELETE */}
          {!isClient && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 md:space-y-5 p-3 md:p-5">
          {/* CONTACT */}
          <ProfileSection title="Contact Information">
            <ProfileField
              icon={Phone}
              label="Mobile"
              value={vendor.mobile_number}
            />
            <ProfileField
              icon={Briefcase}
              label="Contact Person"
              value={vendor.position || vendor.contact_person}
            />
            <ProfileField
              icon={MapPin}
              label="Location"
              value={vendor.area_covered || vendor.address || vendor.location}
            />
          </ProfileSection>

          {/* BUSINESS */}
          <ProfileSection title="Business Details">
            <ProfileField
              icon={Building2}
              label="Type"
              value={vendor.type_of_business || vendor.type?.name}
            />
            <ProfileField
              icon={DollarSign}
              label="Price Range"
              value={vendor.price_range}
            />
            <ProfileField
              icon={Award}
              label="Projects"
              value={
                vendor.past_projects_count
                  ? `${vendor.past_projects_count} Completed`
                  : null
              }
            />
            <ProfileField
              icon={Clock}
              label="Timeline"
              value={vendor.timeline_capability}
            />
          </ProfileSection>

          {/* NOTES */}
          {(vendor.notes || vendor.internal_remarks) && (
            <ProfileSection title="Notes & Remarks">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-orange-50 shrink-0">
                  <FileText className="h-4 w-4 text-[#ef7f1b]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase">Remarks</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {vendor.notes || vendor.internal_remarks}
                  </p>
                </div>
              </div>
            </ProfileSection>
          )}

          {/* FUTURE FIELDS */}
          {vendor.services && (
            <ProfileSection title="Services">
              <ProfileField
                icon={Wrench}
                label="Services"
                value={vendor.services}
              />
            </ProfileSection>
          )}

          {vendor.products && (
            <ProfileSection title="Products">
              <ProfileField
                icon={Package}
                label="Products"
                value={vendor.products}
              />
            </ProfileSection>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
