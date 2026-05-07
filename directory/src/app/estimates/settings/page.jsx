"use client";

import { useEffect, useState } from "react";

import {
  Ruler,
  Info,
  Database,
  IndianRupee,
  Building2,
  Calculator,
  Layers3,
  BarChart3,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getStats } from "@/lib/api";

import { formatCompactINR, formatNumber } from "@/lib/format";

const MODE_BADGE = {
  quick: "border border-accent/20 bg-accent/10 text-accent",
  detailed: "border border-primary/20 bg-primary/10 text-primary",
  renovation:
    "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  interior:
    "border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export default function Settings() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div
      className="space-y-6 animate-in fade-in duration-300"
      data-testid="settings-page"
    >
      <PageHeader
        title="Settings"
        subtitle="Application info, workspace statistics and calculation rules"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* App Info */}
        <Card className="overflow-hidden border border-border/60 bg-card/80 xl:col-span-1">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Ruler className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">BOQify</h2>

                <p className="text-sm text-muted-foreground">
                  Construction BOQ Calculator · v1.0
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow icon={IndianRupee} label="Currency" value="INR (₹)" />

              <InfoRow
                icon={Building2}
                label="Unit System"
                value="Imperial (ft, sqft, cu.ft)"
              />

              <InfoRow
                icon={Layers3}
                label="BOQ Style"
                value="India-style (IS codes compatible)"
              />

              <InfoRow
                icon={Calculator}
                label="Calculation Engine"
                value="Pure rule-based"
              />

              <InfoRow
                icon={Database}
                label="Data Storage"
                value="MongoDB (server-side)"
              />
            </div>
          </div>
        </Card>

        {/* Workspace Stats */}
        <Card className="overflow-hidden border border-border/60 bg-card/80 xl:col-span-2">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  Usage Analytics
                </div>

                <div className="text-xl font-semibold tracking-tight">
                  Your Workspace
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                title="Projects"
                value={formatNumber(stats?.total_projects || 0, 0)}
              />

              <StatCard
                title="Estimated Value"
                value={formatCompactINR(stats?.total_estimated_value || 0)}
              />

              <StatCard
                title="Total Area"
                value={`${formatNumber(stats?.total_area || 0, 0)} sqft`}
              />

              <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Modes Used
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(stats?.by_mode || {}).map(([mode, count]) => (
                    <Badge
                      key={mode}
                      variant="outline"
                      className={`capitalize ${MODE_BADGE[mode] || ""}`}
                    >
                      {mode} · {count}
                    </Badge>
                  ))}

                  {Object.keys(stats?.by_mode || {}).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      None yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Calculation Info */}
        <Card className="overflow-hidden border border-border/60 bg-card/80 xl:col-span-3">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Info className="h-5 w-5" />
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  System Logic
                </div>

                <div className="text-xl font-semibold tracking-tight">
                  How BOQify Calculates
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RuleCard
                title="Flooring"
                text="Room area × (1 + wastage %). Per-room material calculated from flooring selection."
              />

              <RuleCard
                title="Wall Tiling"
                text="Wall perimeter × tile height × wastage. Remaining wall area uses paint."
              />

              <RuleCard
                title="Paint"
                text="Wall area × (primer + 2 coats). Emulsion or distemper applied by selection."
              />

              <RuleCard
                title="Brickwork"
                text="Wall volume ÷ 0.0703 cu.ft per brick with 15% mortar allowance."
              />

              <RuleCard
                title="RCC + Steel"
                text="Built-up area × standard rates (₹285 RCC + 4kg steel per sqft)."
              />

              <RuleCard
                title="Plumbing"
                text="Fixtures × per-unit cost + CPVC and drainage line calculations."
              />

              <RuleCard
                title="Electrical"
                text="Light points, wiring and conduit estimated using room area standards."
              />

              <RuleCard
                title="Markup & GST"
                text="Markup → Contingency → GST applied sequentially on totals."
              />
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />

              <p className="text-sm text-muted-foreground">
                BOQify uses standardized estimation formulas designed for fast
                and consistent construction costing workflows.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-sm text-muted-foreground">{label}</span>
      </div>

      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </div>

      <div className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
        {value}
      </div>
    </div>
  );
}

function RuleCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/20 p-5 transition-colors hover:border-primary/30">
      <div className="font-semibold tracking-tight">{title}</div>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
