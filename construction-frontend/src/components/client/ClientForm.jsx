"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Make sure this exists in your UI library
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function ClientForm({ value, onChange, disabled = false }) {
  const handleChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4 py-2">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Name *
          </Label>
          <Input
            value={value.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1"
            disabled={disabled}
            data-testid="ac-name"
          />
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Contact Number *
          </Label>
          <Input
            value={value.contact_number}
            onChange={(e) => handleChange("contact_number", e.target.value)}
            className="mt-1"
            disabled={disabled}
            data-testid="ac-phone"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Email
          </Label>
          <Input
            value={value.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1"
            disabled={disabled}
            data-testid="ac-email"
          />
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Preferred Communication
          </Label>
          <Select
            value={value.preferred_communication || ""}
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

      {/* Owner & Representative */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Is Owner</Label>
            <p className="text-xs text-gray-500">Primary client is the owner</p>
          </div>
          <Switch
            checked={value.is_owner}
            onCheckedChange={(checked) => handleChange("is_owner", checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">
              Representative Involved
            </Label>
            <p className="text-xs text-gray-500">Client has a representative</p>
          </div>
          <Switch
            checked={value.representative_involved}
            onCheckedChange={(checked) =>
              handleChange("representative_involved", checked)
            }
            disabled={disabled}
          />
        </div>
      </div>

      {value.representative_involved && (
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Representative Comment / Details
          </Label>
          <Textarea
            value={value.representative_comment || ""}
            onChange={(e) =>
              handleChange("representative_comment", e.target.value)
            }
            className="mt-1"
            rows={3}
            disabled={disabled}
            placeholder="Name, relationship, notes about representative..."
          />
        </div>
      )}

      {/* Extra Business Fields (Kept for UX - can be moved to another table later) */}
      <div className="pt-4 border-t">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Project Preferences
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Location
            </Label>
            <Input
              value={value.location || ""}
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
              value={value.budget_comfort || ""}
              onChange={(e) => handleChange("budget_comfort", e.target.value)}
              className="mt-1"
              placeholder="e.g. Premium, Mid-range"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Design Style Preference
          </Label>
          <Input
            value={value.design_style || ""}
            onChange={(e) => handleChange("design_style", e.target.value)}
            className="mt-1"
            placeholder="e.g. Contemporary, Minimalist, Traditional"
            disabled={disabled}
          />
        </div>

        <div className="mt-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Material Preference
          </Label>
          <Input
            value={value.material_preference || ""}
            onChange={(e) =>
              handleChange("material_preference", e.target.value)
            }
            className="mt-1"
            placeholder="e.g. Marble, Teak Wood, Concrete"
            disabled={disabled}
          />
        </div>

        <div className="mt-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Special Requirements
          </Label>
          <Textarea
            value={value.special_requirements || ""}
            onChange={(e) =>
              handleChange("special_requirements", e.target.value)
            }
            className="mt-1"
            rows={3}
            disabled={disabled}
            placeholder="Any specific requirements..."
          />
        </div>
      </div>
    </div>
  );
}
