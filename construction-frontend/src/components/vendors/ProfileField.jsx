import React from "react";

export default function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div>
        <p className="text-[10px] text-gray-400">{label}</p>
        <p className="text-sm text-black">{value}</p>
      </div>
    </div>
  );
}
