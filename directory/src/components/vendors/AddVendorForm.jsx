// src/components/AddVendorForm.jsx
"use client";

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
import { Switch } from "@/components/ui/switch";

import { Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  useCreatePersonMutation,
  useGetPersonTypesQuery,
  useCreatePersonTypeMutation,
} from "@/api/personApi";

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

export default function AddVendorForm({ onSuccess }) {
  const [createPerson, { isLoading: isCreating }] = useCreatePersonMutation();
  const { data: personTypes = [], isLoading: loadingTypes } =
    useGetPersonTypesQuery();
  const [createPersonType, { isLoading: creatingType }] =
    useCreatePersonTypeMutation();

  const [showTypeInput, setShowTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile_number: "",
    optional_mobile: "",
    company_name: "",
    position: "",
    type_of_business: "Civil",
    notes: "",
    area_covered: "",
    age: "",
    dob: "",
    reference_name: "",
    reference_mobile: "",
    is_architect: false,
    is_interior: false,
    is_furniture: false,
    is_active: true,

    type_id: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateAddress = (key, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  const handleCreateType = async () => {
    const name = newTypeName.trim();
    if (!name) return toast.error("Type name is required");

    try {
      await createPersonType({ name }).unwrap();
      toast.success(`"${name}" added successfully`);
      setNewTypeName("");
      setShowTypeInput(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add person type");
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Vendor name is required");
    if (!form.mobile_number.trim())
      return toast.error("Mobile number is required");
    if (!form.type_id) return toast.error("Person type is required");

    try {
      const address = {};
      Object.keys(form.address).forEach((key) => {
        if (form.address[key]) address[key] = form.address[key];
      });

      const payload = {
        name: form.name.trim(),
        mobile_number: form.mobile_number.trim(),
        optional_mobile: form.optional_mobile.trim() || null,
        company_name: form.company_name.trim() || null,
        position: form.position.trim() || null,
        type_of_business: form.type_of_business,
        notes: form.notes.trim() || null,
        area_covered: form.area_covered.trim() || null,
        age: form.age ? Number(form.age) : null,
        dob: form.dob || null,
        reference_name: form.reference_name.trim() || null,
        reference_mobile: form.reference_mobile.trim() || null,
        is_architect: form.is_architect,
        is_interior: form.is_interior,
        is_furniture: form.is_furniture,
        is_active: form.is_active,
        type_id: form.type_id,
        address: Object.keys(address).length > 0 ? address : null,
      };

      const response = await createPerson(payload).unwrap();

      toast.success("Vendor added successfully!");
      if (onSuccess) onSuccess(response);

      // Reset form
      setForm({
        name: "",
        mobile_number: "",
        optional_mobile: "",
        company_name: "",
        position: "",
        type_of_business: "Civil",
        notes: "",
        area_covered: "",
        age: "",
        dob: "",
        reference_name: "",
        reference_mobile: "",
        is_architect: false,
        is_interior: false,
        is_furniture: false,
        is_active: true,
        type_id: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add vendor");
    }
  };

  return (
    <div className="animate-fadeInUp rounded-2xl border bg-white p-6 shadow-sm flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold text-black">Add New Vendor</h2>
        <p className="text-sm text-gray-500">
          Manage vendor details and business information.
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>
              Vendor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div>
            <Label>
              Mobile Number <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.mobile_number}
              onChange={(e) => update("mobile_number", e.target.value)}
              placeholder="98765 43210"
            />
          </div>
          <div>
            <Label>Optional Mobile</Label>
            <Input
              value={form.optional_mobile}
              onChange={(e) => update("optional_mobile", e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Person Type */}
        <div>
          <Label>
            Person Type <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Select
              value={form.type_id}
              onValueChange={(v) => update("type_id", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select person type" />
              </SelectTrigger>
              <SelectContent>
                {personTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTypeInput(!showTypeInput)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {showTypeInput && (
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="New type name"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
              <Button onClick={handleCreateType} disabled={creatingType}>
                {creatingType ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowTypeInput(false);
                  setNewTypeName("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Company Name</Label>
            <Input
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
            />
          </div>
          <div>
            <Label>Position / Designation</Label>
            <Input
              value={form.position}
              onChange={(e) => update("position", e.target.value)}
            />
          </div>
          <div>
            <Label>Type of Business</Label>
            <Select
              value={form.type_of_business}
              onValueChange={(v) => update("type_of_business", v)}
            >
              <SelectTrigger>
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
            <Label>Area Covered</Label>
            <Input
              value={form.area_covered}
              onChange={(e) => update("area_covered", e.target.value)}
              placeholder="Delhi NCR, Gurgaon etc."
            />
          </div>
        </div>

        {/* Professional Roles */}
        <div>
          <Label className="mb-3 block">Professional Roles</Label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { label: "Architect", key: "is_architect" },
              { label: "Interior Designer", key: "is_interior" },
              { label: "Furniture Dealer", key: "is_furniture" },
            ].map(({ label, key }) => (
              <label
                key={key}
                className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => update(key, e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-3 rounded-xl border p-4">
          <h3 className="font-medium">Address</h3>
          <Input
            value={form.address.line1}
            onChange={(e) => updateAddress("line1", e.target.value)}
            placeholder="Address Line 1"
          />
          <Input
            value={form.address.line2}
            onChange={(e) => updateAddress("line2", e.target.value)}
            placeholder="Address Line 2 (Optional)"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={form.address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              placeholder="City"
            />
            <Input
              value={form.address.state}
              onChange={(e) => updateAddress("state", e.target.value)}
              placeholder="State"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={form.address.pincode}
              onChange={(e) => updateAddress("pincode", e.target.value)}
              placeholder="Pincode"
            />
            <Input
              value={form.address.country}
              onChange={(e) => updateAddress("country", e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
            />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => update("dob", e.target.value)}
            />
          </div>
          <div>
            <Label>Reference Name</Label>
            <Input
              value={form.reference_name}
              onChange={(e) => update("reference_name", e.target.value)}
            />
          </div>
          <div>
            <Label>Reference Mobile</Label>
            <Input
              value={form.reference_mobile}
              onChange={(e) => update("reference_mobile", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={4}
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={form.is_active}
            onCheckedChange={(checked) => update("is_active", checked)}
          />
          <Label>Active Vendor</Label>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex justify-end pt-4 border-t mt-4">
        <Button
          onClick={handleSubmit}
          disabled={isCreating}
          className="bg-[#ef7f1b] px-8 hover:bg-[#d66e15]"
        >
          {isCreating ? (
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
