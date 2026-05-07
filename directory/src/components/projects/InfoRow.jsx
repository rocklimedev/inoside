export function InfoRow({ icon: Icon, label, value, className = "" }) {
  return (
    <div
      className={`
        group flex items-start gap-3 rounded-xl
        border border-border bg-card
        p-3 transition-all duration-200
        hover:border-[#ef7f1b]/20
        hover:bg-muted/30
        ${className}
      `}
    >
      {/* Icon */}
      <div
        className="
          mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center
          rounded-lg bg-muted text-muted-foreground
          transition-colors duration-200
          group-hover:bg-[#ef7f1b]/10
          group-hover:text-[#ef7f1b]
        "
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className="
            text-[10px] font-black uppercase
            tracking-[0.18em] text-muted-foreground
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1 break-words text-sm
            font-medium leading-relaxed
            text-foreground
          "
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
