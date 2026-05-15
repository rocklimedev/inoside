import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function SectionFields({ section, form, onChange }) {
  const field = (key, label, type = "input", opts = {}) => (
    <div key={key} className={opts.full ? "col-span-2" : ""}>
      <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </Label>
      {type === "input" && (
        <Input
          value={form[key] || ""}
          onChange={(e) => onChange(key, e.target.value)}
          className="mt-1"
          placeholder={opts.placeholder}
        />
      )}
      {type === "textarea" && (
        <Textarea
          value={form[key] || ""}
          onChange={(e) => onChange(key, e.target.value)}
          className="mt-1"
          rows={opts.rows || 2}
          placeholder={opts.placeholder}
        />
      )}
      {type === "select" && (
        <Select value={form[key] || ""} onValueChange={(v) => onChange(key, v)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder={opts.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {(opts.options || []).map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );

  // ... (keep all your section definitions: client, project, lifestyle, etc.)
  const sections = {
    /* paste your full sections object here */
  };

  return sections[section] || null;
}
