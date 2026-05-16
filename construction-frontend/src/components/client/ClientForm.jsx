"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const defaultValues = {
  name: "",
  contact_number: "",
  email: "",
  preferred_communication: "",
  is_owner: false,
  representative_involved: false,
  representative_comment: "",
  location: "",
  budget_comfort: "",
  design_style: "",
  material_preference: "",
  special_requirements: "",
};

export default function ClientForm({
  initialValues = defaultValues,
  onSubmit,
  disabled = false,
}) {
  const [form, setForm] = useState(initialValues);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      {/* BASIC INFO */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Basic Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Name *
            </Label>

            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1"
              disabled={disabled}
            />
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Contact Number *
            </Label>

            <Input
              value={form.contact_number}
              onChange={(e) => handleChange("contact_number", e.target.value)}
              className="mt-1"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Email
            </Label>

            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1"
              disabled={disabled}
            />
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Preferred Communication
            </Label>

            <Select
              value={form.preferred_communication}
              onValueChange={(v) => handleChange("preferred_communication", v)}
              disabled={disabled}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* OWNER / REPRESENTATIVE */}
      <div className="space-y-4 border-t pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Ownership & Representative
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label className="text-sm font-medium">Is Owner</Label>

              <p className="text-xs text-gray-500">
                Primary client is the owner
              </p>
            </div>

            <Switch
              checked={form.is_owner}
              onCheckedChange={(checked) => handleChange("is_owner", checked)}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label className="text-sm font-medium">
                Representative Involved
              </Label>

              <p className="text-xs text-gray-500">
                Client has a representative
              </p>
            </div>

            <Switch
              checked={form.representative_involved}
              onCheckedChange={(checked) =>
                handleChange("representative_involved", checked)
              }
              disabled={disabled}
            />
          </div>
        </div>

        {form.representative_involved && (
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Representative Details
            </Label>

            <Textarea
              value={form.representative_comment}
              onChange={(e) =>
                handleChange("representative_comment", e.target.value)
              }
              className="mt-1"
              rows={3}
              disabled={disabled}
              placeholder="Name, relationship, notes..."
            />
          </div>
        )}
      </div>

      {/* PROJECT PREFERENCES */}
      <div className="space-y-4 border-t pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Project Preferences
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Location
            </Label>

            <Input
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="mt-1"
              disabled={disabled}
              placeholder="Project location"
            />
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Budget Comfort
            </Label>

            <Input
              value={form.budget_comfort}
              onChange={(e) => handleChange("budget_comfort", e.target.value)}
              className="mt-1"
              disabled={disabled}
              placeholder="Premium / Mid-range"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Design Style Preference
          </Label>

          <Input
            value={form.design_style}
            onChange={(e) => handleChange("design_style", e.target.value)}
            className="mt-1"
            disabled={disabled}
            placeholder="Minimalist / Contemporary"
          />
        </div>

        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Material Preference
          </Label>

          <Input
            value={form.material_preference}
            onChange={(e) =>
              handleChange("material_preference", e.target.value)
            }
            className="mt-1"
            disabled={disabled}
            placeholder="Marble / Wood / Concrete"
          />
        </div>

        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Special Requirements
          </Label>

          <Textarea
            value={form.special_requirements}
            onChange={(e) =>
              handleChange("special_requirements", e.target.value)
            }
            className="mt-1"
            rows={4}
            disabled={disabled}
            placeholder="Any specific requirements..."
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="submit" disabled={disabled}>
          Save Client
        </Button>
      </div>
    </form>
  );
}
