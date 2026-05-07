import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TRADE_TYPES = [
  "Civil",
  "Electrical",
  "Plumbing",
  "Furniture",
  "Fixtures",
  "Painting",
  "HVAC",
  "Flooring",
  "Landscaping",
  "Interior",
  "Structural",
  "Other",
];

const PRICE_RANGES = ["Budget", "Mid", "Premium"];

const BUDGET_SEGMENTS = ["Low-End", "Mid-Range", "High-End"];

export default function AddVendorForm({ api, onSuccess }) {
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    trade_type: "Civil",
    services: "",
    products: "",
    location: "",
    rating: 3,
    price_range: "Mid",
    budget_segment: "Mid-Range",
    timeline_capability: "",
    past_projects_count: 0,
    internal_remarks: "",
  };

  const [form, setForm] = useState(initialForm);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Vendor name is required");
      return;
    }

    setSaving(true);

    try {
      const response = await api.post("/vendors", form);

      toast.success("Vendor added successfully");

      if (onSuccess) {
        onSuccess(response.data);
      }

      setForm(initialForm);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add vendor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fadeInUp space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="border-b pb-3">
        <h2 className="text-lg font-semibold text-black">Add New Vendor</h2>
        <p className="text-sm text-gray-500">
          Manage vendor details, services, and capabilities.
        </p>
      </div>

      {/* Form Body */}
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        {/* Vendor Basic Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="animate-fadeIn">
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Vendor Name *
            </Label>

            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Enter vendor name"
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
              data-testid="vendor-name-input"
            />
          </div>

          <div className="animate-fadeIn">
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Contact Person
            </Label>

            <Input
              value={form.contact_person}
              onChange={(e) => update("contact_person", e.target.value)}
              placeholder="Enter contact person"
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Phone
            </Label>

            <Input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
            />
          </div>

          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Email
            </Label>

            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="vendor@email.com"
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
            />
          </div>
        </div>

        {/* Trade + Location */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Trade Type
            </Label>

            <Select
              value={form.trade_type}
              onValueChange={(v) => update("trade_type", v)}
            >
              <SelectTrigger className="border-gray-200 focus:ring-[#ef7f1b]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {TRADE_TYPES.map((trade) => (
                  <SelectItem key={trade} value={trade}>
                    {trade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Location
            </Label>

            <Input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City / Region"
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
            />
          </div>
        </div>

        {/* Rating + Price + Projects */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Rating (1-5)
            </Label>

            <Input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) => update("rating", Number(e.target.value))}
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
            />
          </div>

          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Price Range
            </Label>

            <Select
              value={form.price_range}
              onValueChange={(v) => update("price_range", v)}
            >
              <SelectTrigger className="border-gray-200 focus:ring-[#ef7f1b]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {PRICE_RANGES.map((price) => (
                  <SelectItem key={price} value={price}>
                    {price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Past Projects
            </Label>

            <Input
              type="number"
              min={0}
              value={form.past_projects_count}
              onChange={(e) =>
                update("past_projects_count", Number(e.target.value))
              }
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
            />
          </div>
        </div>

        {/* Budget + Timeline */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Budget Segment
            </Label>

            <Select
              value={form.budget_segment}
              onValueChange={(v) => update("budget_segment", v)}
            >
              <SelectTrigger className="border-gray-200 focus:ring-[#ef7f1b]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {BUDGET_SEGMENTS.map((budget) => (
                  <SelectItem key={budget} value={budget}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Timeline Capability
            </Label>

            <Input
              value={form.timeline_capability}
              onChange={(e) => update("timeline_capability", e.target.value)}
              placeholder="e.g. 2 weeks / Fast delivery"
              className="border-gray-200 focus-visible:ring-[#ef7f1b]"
            />
          </div>
        </div>

        {/* Services */}
        <div>
          <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Services Offered
          </Label>

          <Textarea
            value={form.services}
            onChange={(e) => update("services", e.target.value)}
            rows={3}
            placeholder="Civil work, wiring, maintenance..."
            className="border-gray-200 focus-visible:ring-[#ef7f1b]"
          />
        </div>

        {/* Products */}
        <div>
          <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Products
          </Label>

          <Textarea
            value={form.products}
            onChange={(e) => update("products", e.target.value)}
            rows={3}
            placeholder="Tiles, paint, furniture..."
            className="border-gray-200 focus-visible:ring-[#ef7f1b]"
          />
        </div>

        {/* Internal Remarks */}
        <div>
          <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Internal Remarks
          </Label>

          <Textarea
            value={form.internal_remarks}
            onChange={(e) => update("internal_remarks", e.target.value)}
            rows={4}
            placeholder="Additional notes about vendor..."
            className="border-gray-200 focus-visible:ring-[#ef7f1b]"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t pt-4">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] px-5 text-white transition-all duration-200 hover:bg-[#d66e15]"
          data-testid="vendor-submit"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
