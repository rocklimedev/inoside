import { cn } from "@/lib/utils";

export function StatCard({ label, value, hint, accent = false, icon: Icon, testId }) {
  return (
    <div
      className={cn(
        "blueprint-card card-lift rounded-xl p-5",
        accent && "border-accent/40"
      )}
      data-testid={testId}
    >
      <div className="flex items-start justify-between">
        <div className="section-label">{label}</div>
        {Icon && (
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md",
            accent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
          )}>
            <Icon size={18} weight="bold" />
          </div>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-bold tabular-nums text-slate-900">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
