import React from "react";

export default function ProfileSection({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 md:p-4 shadow-sm">
      <h3 className="mb-3 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#ef7f1b]">
        {title}
      </h3>

      <div className="space-y-3 md:space-y-4">{children}</div>
    </div>
  );
}
