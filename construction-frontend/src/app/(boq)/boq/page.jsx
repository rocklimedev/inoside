"use client";

import { useRouter } from "next/navigation";

import {
  Zap,
  FileText,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Sparkles,
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
    gradient:
      "from-orange-500/20 via-orange-500/5 to-transparent dark:from-orange-500/10",
    glow: "shadow-orange-500/20",
    iconStyle: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    border: "hover:border-orange-500/40 hover:shadow-orange-500/10",
    button: "bg-orange-500 hover:bg-orange-600 text-white border-0",
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
    gradient: "from-slate-500/15 via-slate-500/5 to-transparent",
    glow: "shadow-slate-500/10",
    iconStyle: "bg-gradient-to-br from-slate-800 to-slate-900 text-white",
    border: "hover:border-slate-500/40 hover:shadow-slate-500/10",
    button: "",
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
      className="relative min-h-screen overflow-hidden"
      data-testid="new-estimate-page"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/30" />

      {/* Decorative Blurs */}
      <div className="absolute left-0 top-0 -z-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <PageHeader
            title="New Estimate"
            subtitle="Choose a workflow to generate professional BOQs, estimates and costing reports."
          />
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {MODES.map((m, index) => {
            const Icon = m.icon;

            return (
              <Card
                key={m.key}
                onClick={() => router.push(`/boq/${m.key}`)}
                data-testid={`mode-${m.key}`}
                className={`group relative cursor-pointer overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${m.border} ${m.glow} animate-fadeInUp`}
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >
                {/* Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${m.gradient}`}
                />

                {/* Glow Line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-primary to-orange-500 opacity-80" />

                {/* Hover Blur */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                </div>

                <div className="relative space-y-6 p-7">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${m.iconStyle}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>

                    <Badge
                      variant="outline"
                      className="gap-1 rounded-full border-border/60 bg-background/80 px-3 py-1 text-xs backdrop-blur"
                    >
                      <Clock3 className="h-3 w-3" />
                      {m.time}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      {m.subtitle}
                    </div>

                    <h3 className="mt-2 text-3xl font-bold tracking-tight">
                      {m.name}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {m.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {m.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3 py-3 text-sm backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30"
                      >
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />

                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    className={`group/btn h-12 w-full justify-between rounded-xl text-sm font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] ${m.button}`}
                    variant={m.accent ? "default" : "outline"}
                  >
                    <span>Start {m.name}</span>

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
