import { ReactNode } from "react";

export default function SectionHeader({ title, hint, className = "" }) {
  return (
    <div className={className}>
      <h3 className="font-display text-xl font-semibold text-slate-900">
        {title}
      </h3>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}
