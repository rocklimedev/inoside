import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

import { ArrowUpRight, MapPin, AlertTriangle, Clock3 } from "lucide-react";

export function GridView({ projects, onSelect }) {
  if (!projects?.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border bg-card">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            No projects found
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Try changing filters or search query
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {projects.map((p, index) => (
        <Card
          key={p.id}
          onClick={() => onSelect(p)}
          data-testid={`project-card-${index}`}
          className="
            group relative cursor-pointer overflow-hidden
            rounded-2xl border border-border bg-card
            p-5 shadow-sm transition-all duration-300
            hover:-translate-y-1
            hover:border-[#ef7f1b]/20
            hover:shadow-xl
            animate-fadeInUp
          "
        >
          {/* Top Glow */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#ef7f1b]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-black tracking-tight text-foreground">
                {p.name}
              </h3>

              <p className="mt-1 truncate text-[11px] text-muted-foreground">
                {p.client_name || "No Client"}
              </p>
            </div>

            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-xl bg-muted text-muted-foreground
                transition-all duration-300
                group-hover:bg-[#ef7f1b]/10
                group-hover:text-[#ef7f1b]
              "
            >
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge
              className="
                border-0 bg-[#ef7f1b]/10
                px-2 py-1 text-[10px]
                font-bold text-[#ef7f1b]
              "
            >
              {p.stage || "Stage"}
            </Badge>

            {p.type && (
              <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                {p.type}
              </span>
            )}

            {p.location && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {p.location}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Completion
              </p>

              <span className="text-[11px] font-black text-foreground">
                {p.completion || 0}%
              </span>
            </div>

            <Progress value={p.completion || 0} className="h-2 bg-muted" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock3 className="h-3 w-3" />
              {p.last_activity || "No activity"}
            </div>

            <div className="flex items-center gap-2">
              {p.pending_approvals > 0 && (
                <span className="rounded-md bg-[#ef7f1b]/10 px-2 py-1 text-[10px] font-semibold text-[#ef7f1b]">
                  {p.pending_approvals} approvals
                </span>
              )}

              {p.has_issues && (
                <div className="rounded-md bg-red-50 p-1 text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                </div>
              )}

              {p.has_delay && (
                <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">
                  Delayed
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
