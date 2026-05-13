import { Input } from "@/components/ui/input";

export default function NumField({
  label,
  value,
  onChange,
  testId,
  min = 0,
  max,
  step = 1,
  placeholder,
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </div>
      <Input
        type="number"
        className="h-9"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        data-testid={testId}
      />
    </div>
  );
}
