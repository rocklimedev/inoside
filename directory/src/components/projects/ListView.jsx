import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

import { Trash2, ArrowUpRight, Clock3, Building2 } from "lucide-react";

export function ListView({ projects, onSelect, onDelete }) {
  if (!projects?.length) {
    return (
      <div
        className="
          flex min-h-[300px] items-center justify-center
          rounded-2xl border border-dashed border-border
          bg-card
        "
      >
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            No projects found
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Try changing your filters or search query
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden rounded-2xl
        border border-border bg-card
        shadow-sm
      "
    >
      {/* Header */}
      <div
        className="
          grid grid-cols-12 gap-3 border-b border-border
          bg-muted/40 px-5 py-3
        "
      >
        <div className="col-span-3 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Project
        </div>

        <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Client
        </div>

        <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Stage
        </div>

        <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Progress
        </div>

        <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Activity
        </div>

        <div className="col-span-1 text-right text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Action
        </div>
      </div>

      {/* Rows */}
      <div>
        {projects.map((p, index) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            data-testid={`project-row-${index}`}
            className="
              group grid cursor-pointer grid-cols-12
              items-center gap-3 border-b border-border
              px-5 py-4 transition-all duration-200
              hover:bg-[#ef7f1b]/[0.03]
            "
          >
            {/* Project */}
            <div className="col-span-3 flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl bg-[#ef7f1b]/10
                  font-black text-[#ef7f1b]
                "
              >
                {p.name?.charAt(0) || "P"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {p.name}
                </p>

                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3" />
                  Open Details
                </div>
              </div>
            </div>

            {/* Client */}
            <div className="col-span-2 flex items-center gap-2 text-sm text-foreground">
              <Building2 className="h-4 w-4 text-muted-foreground" />

              <span className="truncate">{p.client_name || "—"}</span>
            </div>

            {/* Stage */}
            <div className="col-span-2">
              <Badge
                className="
                  border-0 bg-[#ef7f1b]/10
                  text-[#ef7f1b]
                "
              >
                {p.stage || "—"}
              </Badge>
            </div>

            {/* Progress */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Progress
                  value={p.completion || 0}
                  className="h-2 flex-1 bg-muted"
                />

                <span className="min-w-[36px] text-xs font-bold text-foreground">
                  {p.completion || 0}%
                </span>
              </div>
            </div>

            {/* Activity */}
            <div className="col-span-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="h-3 w-3" />

              <span className="truncate">
                {p.last_activity || "No activity"}
              </span>
            </div>

            {/* Delete */}
            <div className="col-span-1 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(p.id);
                }}
                className="
                  h-8 w-8 rounded-lg text-muted-foreground
                  transition-colors
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
