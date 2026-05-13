"use client";

import { useRouter } from "next/navigation";

import { FileText, ArrowRight, Clock3, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetBoqCategoriesQuery } from "@/api/boqApi";

const CATEGORY_META = {
  ARCH: {
    subtitle: "Construction",
    time: "~3 mins",
    gradient:
      "from-orange-500/20 via-orange-500/5 to-transparent dark:from-orange-500/10",
    glow: "shadow-orange-500/20",
    iconStyle: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    border: "hover:border-orange-500/40 hover:shadow-orange-500/10",
    button: "bg-orange-500 hover:bg-orange-600 text-white border-0",
    features: [
      "Civil work BOQ",
      "Flooring & masonry",
      "Architectural finishes",
      "Editable quantities",
    ],
  },

  INT: {
    subtitle: "Interior Fitout",
    time: "~5 mins",
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    glow: "shadow-violet-500/20",
    iconStyle: "bg-gradient-to-br from-violet-600 to-violet-700 text-white",
    border: "hover:border-violet-500/40 hover:shadow-violet-500/10",
    button: "bg-violet-600 hover:bg-violet-700 text-white border-0",
    features: [
      "False ceiling",
      "Partitions & paint",
      "Interior materials",
      "Room-wise costing",
    ],
  },

  FURN: {
    subtitle: "Furniture & Joinery",
    time: "~4 mins",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    glow: "shadow-emerald-500/20",
    iconStyle: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white",
    border: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white border-0",
    features: [
      "Modular furniture",
      "Wardrobes & storage",
      "Loose furniture",
      "Custom joinery",
    ],
  },
};

export default function NewEstimate() {
  const router = useRouter();

  const { data: categories = [], isLoading } = useGetBoqCategoriesQuery();

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      data-testid="new-estimate-page"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/30" />

      {/* Decorative */}
      <div className="absolute left-0 top-0 -z-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <PageHeader
            title="New Estimate"
            subtitle="Choose a BOQ category to generate professional costing, quantity estimates and project BOQs."
          />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="space-y-5 rounded-3xl p-6">
                <Skeleton className="h-16 w-16 rounded-2xl" />

                <div className="space-y-3">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-20 w-full" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>

                <Skeleton className="h-12 w-full rounded-xl" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {categories.map((category, index) => {
              const meta = CATEGORY_META[category.code] || CATEGORY_META.ARCH;

              return (
                <Card
                  key={category.id}
                  onClick={() => router.push(`/boq/create/${category.id}`)}
                  className={`group relative cursor-pointer overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${meta.border} ${meta.glow}`}
                  style={{
                    animationDelay: `${index * 120}ms`,
                  }}
                >
                  {/* Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`}
                  />

                  {/* Top Line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-primary to-orange-500 opacity-80" />

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                  </div>

                  <div className="relative space-y-6 p-7">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${meta.iconStyle}`}
                      >
                        <FileText className="h-8 w-8" />
                      </div>

                      <Badge
                        variant="outline"
                        className="gap-1 rounded-full border-border/60 bg-background/80 px-3 py-1 text-xs backdrop-blur"
                      >
                        <Clock3 className="h-3 w-3" />
                        {meta.time}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        {meta.subtitle}
                      </div>

                      <h3 className="mt-2 text-3xl font-bold tracking-tight">
                        {category.name}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        {category.description ||
                          "Generate detailed BOQs and professional estimates."}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {meta.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3 py-3 text-sm backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30"
                        >
                          <CheckCircle2 className="h-4 w-4 text-orange-500" />

                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      className={`group/btn h-12 w-full justify-between rounded-xl text-sm font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] ${meta.button}`}
                    >
                      <span>Start {category.name}</span>

                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
