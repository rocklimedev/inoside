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

function ProfileSection({ title, children }) {
  return (
    <div className="animate-fadeIn rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-[11px] font-black uppercase tracking-wider text-[#ef7f1b]">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
        <Icon className="h-4 w-4 text-[#ef7f1b]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm leading-relaxed text-black">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function VendorProfile({ vendor, isClient, onDelete }) {
  return (
    <div
      className="flex h-full flex-col bg-[#fafafa]"
      data-testid="vendor-profile"
    >
      {/* Header */}
      <div className="border-b bg-white px-6 py-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-xl font-black text-[#ef7f1b] shadow-sm">
              {vendor.name?.[0] || "V"}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black tracking-tight text-black">
                {vendor.name}
              </h2>

              {vendor.company_name && (
                <p className="mt-1 text-sm text-gray-500">
                  {vendor.company_name}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-orange-50 text-xs font-medium text-[#ef7f1b]">
                  {vendor.type_of_business || vendor.type?.name || "Vendor"}
                </Badge>
                {ratingStars(vendor.rating || 0)}
              </div>
            </div>
          </div>

          {/* Delete Button */}
          {!isClient && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-5 p-5">
          {/* Contact Information */}
          <ProfileSection title="Contact Information">
            <ProfileField
              icon={Phone}
              label="Mobile Number"
              value={vendor.mobile_number}
            />

            <ProfileField
              icon={Briefcase}
              label="Position / Contact Person"
              value={vendor.position || vendor.contact_person}
            />

            <ProfileField
              icon={MapPin}
              label="Area Covered / Location"
              value={vendor.area_covered || vendor.address || vendor.location}
            />
          </ProfileSection>

          {/* Business Details */}
          <ProfileSection title="Business Details">
            <ProfileField
              icon={Building2}
              label="Trade / Business Type"
              value={vendor.type_of_business || vendor.type?.name}
            />

            <ProfileField
              icon={DollarSign}
              label="Price Range"
              value={vendor.price_range}
            />

            <ProfileField
              icon={Award}
              label="Past Projects"
              value={
                vendor.past_projects_count
                  ? `${vendor.past_projects_count} Projects Completed`
                  : null
              }
            />

            <ProfileField
              icon={Clock}
              label="Timeline Capability"
              value={vendor.timeline_capability}
            />
          </ProfileSection>

          {/* Notes / Remarks */}
          {(vendor.notes || vendor.internal_remarks) && (
            <ProfileSection title="Notes & Remarks">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                  <FileText className="h-4 w-4 text-[#ef7f1b]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Remarks
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {vendor.notes || vendor.internal_remarks}
                  </p>
                </div>
              </div>
            </ProfileSection>
          )}

          {/* Services & Products (if they exist in future) */}
          {vendor.services && (
            <ProfileSection title="Services Offered">
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
