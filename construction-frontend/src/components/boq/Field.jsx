import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

export default function Field({
  label,
  children,
  required = false,
  className = "",
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
