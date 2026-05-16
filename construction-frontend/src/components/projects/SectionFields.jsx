"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SectionFields({
  fields,
  form,
  onChange,
  readonlyFields = [],
  getPlaceholder,
  DatePicker,
  projects = [],
  clients = [],
  onAddProject, // ← New
  onAddClient, // ← New
}) {
  const isDateField = (key) =>
    key === "expected_start_date" || key === "expected_completion";

  const isProjectField = (key) => key === "project_name";
  const isClientField = (key) => key === "client_name";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((key) => {
        const isReadonly = readonlyFields.includes(key);
        const label = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-widest text-gray-400">
                {label}
              </Label>

              {(isProjectField(key) || isClientField(key)) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700"
                  onClick={() =>
                    isProjectField(key) ? onAddProject?.() : onAddClient?.()
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isDateField(key) && DatePicker ? (
              <DatePicker
                value={form[key]}
                onChange={(value) => onChange(key, value)}
                placeholder={getPlaceholder?.(key)}
              />
            ) : isProjectField(key) ? (
              <Select
                value={form[key] || ""}
                onValueChange={(value) => onChange(key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getPlaceholder?.(key)} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.name}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : isClientField(key) ? (
              <Select
                value={form[key] || ""}
                onValueChange={(value) => onChange(key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getPlaceholder?.(key)} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={form[key] || ""}
                disabled={isReadonly}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={getPlaceholder?.(key)}
                className={isReadonly ? "opacity-60 cursor-not-allowed" : ""}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
