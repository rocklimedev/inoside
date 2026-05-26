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
              className="
                h-11
                rounded-xl
                border-gray-200
                bg-white
                focus-visible:ring-2
                focus-visible:ring-black
              "
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Contact Number *
            </Label>

            <Input
              value={form.contact_number}
              onChange={(e) => handleChange("contact_number", e.target.value)}
              disabled={disabled}
              placeholder="Enter contact number"
              className="
                h-11
                rounded-xl
                border-gray-200
                bg-white
                focus-visible:ring-2
                focus-visible:ring-black
              "
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
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={disabled}
              placeholder="Enter email address"
              className="
                h-11
                rounded-xl
                border-gray-200
                bg-white
                focus-visible:ring-2
                focus-visible:ring-black
              "
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Preferred Communication
            </Label>

            <Select
              value={form.preferred_communication || undefined}
              onValueChange={(v) => handleChange("preferred_communication", v)}
              disabled={disabled}
            >
              <SelectTrigger
                className="
                  h-11
                  rounded-xl
                  border-gray-200
                  bg-white
                  focus:ring-2
                  focus:ring-black
                "
              >
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

      {/* ================= OWNER / REPRESENTATIVE ================= */}
      <div className="space-y-5 border-t border-gray-100 pt-6">
        <div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Ownership & Representative
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* IS OWNER */}
          <div
            className="
              flex items-center justify-between gap-4
              rounded-2xl
              border border-gray-200
              bg-white
              p-4 sm:p-5
              shadow-sm
            "
          >
            <div className="min-w-0">
              <Label className="text-sm sm:text-base font-semibold text-gray-900">
                Is Owner
              </Label>

              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Primary client is the owner
              </p>
            </div>

            <Switch
              checked={form.is_owner}
              onCheckedChange={(checked) => handleChange("is_owner", checked)}
              disabled={disabled}
              className="
                shrink-0
                scale-110

                data-[state=checked]:bg-black
                data-[state=unchecked]:bg-gray-300

                border border-gray-400
                shadow-sm
              "
            />
          </div>

          {/* REPRESENTATIVE */}
          <div
            className="
              flex items-center justify-between gap-4
              rounded-2xl
              border border-gray-200
              bg-white
              p-4 sm:p-5
              shadow-sm
            "
          >
            <div className="min-w-0">
              <Label className="text-sm sm:text-base font-semibold text-gray-900">
                Representative Involved
              </Label>

              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Client has a representative
              </p>
            </div>

            <Switch
              checked={form.representative_involved}
              onCheckedChange={(checked) =>
                handleChange("representative_involved", checked)
              }
              disabled={disabled}
              className="
                shrink-0
                scale-110

                data-[state=checked]:bg-black
                data-[state=unchecked]:bg-gray-300

                border border-gray-400
                shadow-sm
              "
            />
          </div>
        </div>

        {/* REPRESENTATIVE DETAILS */}
        {form.representative_involved && (
          <div className="space-y-2">
            <Label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Representative Details
            </Label>

            <Textarea
              value={form.representative_comment}
              onChange={(e) =>
                handleChange("representative_comment", e.target.value)
              }
              rows={4}
              disabled={disabled}
              placeholder="Name, relationship, notes..."
              className="
                rounded-2xl
                border-gray-200
                bg-white
                resize-none
                focus-visible:ring-2
                focus-visible:ring-black
              "
            />
          </div>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div
        className="
          flex flex-col-reverse sm:flex-row
          justify-end
          gap-3
          border-t border-gray-100
          pt-6
        "
      >
        <Button
          type="submit"
          disabled={disabled}
          className="
            h-11
            rounded-xl
            px-6
            text-sm font-medium
            w-full sm:w-auto
          "
        >
          Save Client
        </Button>
      </div>
    </form>
  );
}
