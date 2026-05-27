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
  is_owner: true,
  representative_involved: false,
  representative_comment: "",
};

export default function ClientForm({
  initialValues = defaultValues,
  onSubmit,
  disabled = false,
}) {
  const [form, setForm] = useState({
    ...defaultValues,
    ...initialValues,
  });

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
    <form onSubmit={handleSubmit} className="w-full space-y-6 sm:space-y-7">
      {/* ================= BASIC INFO ================= */}
      <div className="space-y-5">
        <div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Basic Information
          </p>
        </div>

        {/* NAME + CONTACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Name *
            </Label>

            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={disabled}
              placeholder="Enter client name"
              className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>

          {/* CONTACT NUMBER (NOW OPTIONAL) */}
          <div className="space-y-2">
            <Label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Contact Number
            </Label>

            <Input
              value={form.contact_number || ""}
              onChange={(e) => handleChange("contact_number", e.target.value)}
              disabled={disabled}
              placeholder="Enter contact number (optional)"
              className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
        </div>

        {/* EMAIL + COMMUNICATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Email
            </Label>

            <Input
              type="email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={disabled}
              placeholder="Enter email address"
              className="h-11 rounded-xl border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 pt-6">
        <Button
          type="submit"
          disabled={disabled}
          className="h-11 rounded-xl px-6 text-sm font-medium w-full sm:w-auto"
        >
          Save Client
        </Button>
      </div>
    </form>
  );
}
