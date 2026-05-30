import React from "react";

export default function ProfileField({ icon: Icon, label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="flex items-start gap-3">
      {/* Icon */}
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[9px] md:text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="text-sm text-black break-words leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
}
