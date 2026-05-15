import { Checkbox } from "@/components/ui/checkbox";

export function FilterSection({ title, items, selected, onToggle }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => onToggle(item)}
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
