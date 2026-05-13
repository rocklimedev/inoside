// components/boq/PreviewRow.tsx
import { formatCompactINR } from "@/lib/format";

export default function PreviewRow({
  label,
  value,
  bold = false,
  raw = false,
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span
        className={`${bold ? "font-semibold text-slate-900" : "text-slate-700"}`}
      >
        {raw
          ? value
          : typeof value === "number"
            ? formatCompactINR(value)
            : value || "₹0"}
      </span>
    </div>
  );
}
