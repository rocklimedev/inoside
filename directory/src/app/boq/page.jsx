"use client";

import { useRouter } from "next/navigation";

import {
  Zap,
  FileText,
  Wrench,
  Armchair,
  ArrowRight,
  Clock3,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MODES = [
  {
    key: "quick",
    name: "Quick Estimate",
    subtitle: "Fast Budgeting",
    time: "~30 seconds",
    description:
      "Enter built-up area, quality and location. Get an approximate total budget with instant category-wise cost split.",
    icon: Zap,
    accent: true,
    gradient: "from-accent/20 via-accent/5 to-transparent",
    iconStyle: "bg-accent text-accent-foreground",
    border: "hover:border-accent/50",
    features: [
      "Area + quality based",
      "Category cost split",
      "Cost per sqft",
      "No room-level inputs",
    ],
  },

  {
    key: "detailed",
    name: "Detailed BOQ",
    subtitle: "Professional",
    time: "~5 minutes",
    description:
      "Granular inputs for rooms, materials and floors. Generates detailed editable BOQ line items.",
    icon: FileText,
    accent: false,
    gradient: "from-primary/15 via-primary/5 to-transparent",
    iconStyle: "bg-primary text-primary-foreground",
    border: "hover:border-primary/40",
    features: [
      "Room-wise materials",
      "20+ BOQ categories",
      "Editable line items",
      "Client-ready PDF",
    ],
  },
];

export default function NewEstimate() {
  const router = useRouter();

  return (
    <div
      className="space-y-6 animate-in fade-in duration-300"
      data-testid="new-estimate-page"
    >
      <PageHeader
        title="New Estimate"
        subtitle="Choose a workflow to generate professional BOQs, estimates and costing reports."
      />

      {/* Mode Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {MODES.map((m) => {
          const Icon = m.icon;

          return (
            <Card
              key={m.key}
              onClick={() => router.push(`/boq/${m.key}`)}
              data-testid={`mode-${m.key}`}
              className={`group relative cursor-pointer overflow-hidden border border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${m.border}`}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${m.gradient}`}
              />

              {/* Top Glow */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />

              <div className="relative space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${m.iconStyle}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <Badge
                    variant="outline"
                    className="gap-1 rounded-full px-3 py-1 text-xs"
                  >
                    <Clock3 className="h-3 w-3" />
                    {m.time}
                  </Badge>
                </div>

                {/* Content */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    {m.subtitle}
                  </div>

                  <h3 className="mt-1 text-3xl font-bold tracking-tight">
                    {m.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {m.description}
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {m.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />

                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  className="group/btn w-full justify-between"
                  variant={m.accent ? "default" : "outline"}
                >
                  <span>Start {m.name}</span>

                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/70 p-4 text-center backdrop-blur-sm">
      <div className="text-2xl font-bold tracking-tight">{value}</div>

      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
