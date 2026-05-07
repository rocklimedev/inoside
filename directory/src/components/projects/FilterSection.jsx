import { Checkbox } from "../ui/checkbox";

export function FilterSection({ title, items, selected, onToggle }) {
  return (
    <div className="space-y-3">
      {/* Section Title */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>

        <div className="mt-1 h-[2px] w-10 rounded-full bg-[#ef7f1b]" />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const active = selected.includes(item);

          return (
            <label
              key={item}
              className={`
                group flex cursor-pointer items-center gap-3 rounded-xl border
                px-3 py-2 transition-all duration-200
                ${
                  active
                    ? "border-[#ef7f1b]/30 bg-[#ef7f1b]/5"
                    : "border-border bg-background hover:border-[#ef7f1b]/20 hover:bg-muted/40"
                }
              `}
            >
              <Checkbox
                checked={active}
                onCheckedChange={() => onToggle(item)}
                className="
                  border-border
                  data-[state=checked]:border-[#ef7f1b]
                  data-[state=checked]:bg-[#ef7f1b]
                  data-[state=checked]:text-white
                "
              />

              <span
                className={`
                  text-xs font-medium transition-colors
                  ${
                    active
                      ? "text-black"
                      : "text-muted-foreground group-hover:text-foreground"
                  }
                `}
              >
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
