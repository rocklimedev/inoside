import React from "react";

export default function ProfileSection({ title, children }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#ef7f1b] mb-3">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
