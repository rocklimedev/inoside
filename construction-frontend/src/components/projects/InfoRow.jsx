import { User, MapPin, FileText, Clock, Calendar } from "lucide-react";

const iconMap = { User, MapPin, FileText, Clock, Calendar };

export function InfoRow({ icon, label, value }) {
  const Icon = iconMap[icon];

  return (
    <div className="flex gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p className="font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}
