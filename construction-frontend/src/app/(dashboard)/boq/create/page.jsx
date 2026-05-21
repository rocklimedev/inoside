"use client";

import { useRouter } from "next/navigation";

import {
  FileText,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Sparkles,
  Calculator,
  Layers3,
  ShieldCheck,
  Wand2,
} from "lucide-react";

import { motion } from "framer-motion";

import { PageHeader } from "@/components/PageHeader";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

import { Separator } from "@/components/ui/separator";

import { useGetBoqCategoriesQuery } from "@/api/boqApi";

const CATEGORY_META = {
  ARCH: {
    subtitle: "Construction",

    time: "~3 mins",

    gradient:
      "from-orange-500/20 via-orange-500/5 to-transparent dark:from-orange-500/10",

    glow: "hover:shadow-orange-500/20",

    iconStyle: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",

    border: "hover:border-orange-500/40",

    button: "bg-orange-500 hover:bg-orange-600 text-white border-0",

    badge: "bg-orange-100 text-orange-700 border-orange-200",

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

    glow: "hover:shadow-violet-500/20",

    iconStyle: "bg-gradient-to-br from-violet-600 to-violet-700 text-white",

    border: "hover:border-violet-500/40",

    button: "bg-violet-600 hover:bg-violet-700 text-white border-0",

    badge: "bg-violet-100 text-violet-700 border-violet-200",

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

    glow: "hover:shadow-emerald-500/20",

    iconStyle: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white",

    border: "hover:border-emerald-500/40",

    button: "bg-emerald-600 hover:bg-emerald-700 text-white border-0",

    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",

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
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      {/* ====================================================== */}
      {/* BACKGROUND */}
      {/* ====================================================== */}

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#fafafa] to-orange-50/40" />

      <div className="absolute left-0 top-0 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-violet-500/10 blur-3xl" />

      {/* ====================================================== */}
      {/* CONTAINER */}
      {/* ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* ====================================================== */}
        {/* SECTION HEADER */}
        {/* ====================================================== */}

        <div className="mt-12 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
              Categories
            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Select Your Estimate Type
            </h2>
          </div>

          <div className="text-sm text-muted-foreground max-w-md leading-7">
            Choose a BOQ category below to begin generating structured estimates
            and costing sheets.
          </div>
        </div>

        <Separator className="mb-8" />

        {/* ====================================================== */}
        {/* LOADING */}
        {/* ====================================================== */}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="rounded-[30px] border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-7 space-y-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-16 w-16 rounded-2xl" />

                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />

                    <Skeleton className="h-10 w-52" />

                    <Skeleton className="h-20 w-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 rounded-2xl" />
                    ))}
                  </div>

                  <Skeleton className="h-12 rounded-2xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* ====================================================== */
          /* GRID */
          /* ====================================================== */

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {categories.map((category, index) => {
              const meta = CATEGORY_META[category.code] || CATEGORY_META.ARCH;

              return (
                <motion.div
                  key={category.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.12,
                  }}
                >
                  <Card
                    onClick={() =>
                      router.push(`/boq/new?category=${category.id}`)
                    }
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-[32px]
                      border
                      bg-white/90
                      backdrop-blur-xl
                      shadow-xl
                      cursor-pointer
                      transition-all
                      duration-500
                      hover:-translate-y-3
                      hover:shadow-2xl
                      ${meta.border}
                      ${meta.glow}
                    `}
                  >
                    {/* Gradient */}

                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`}
                    />

                    {/* Top Border */}

                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-violet-500 to-orange-500" />

                    {/* Glow */}

                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                    </div>

                    <CardContent className="relative z-10 p-7">
                      {/* TOP */}

                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`
                            h-16
                            w-16
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            transition-transform
                            duration-300
                            group-hover:scale-110
                            ${meta.iconStyle}
                          `}
                        >
                          <FileText className="h-8 w-8" />
                        </div>

                        <Badge
                          variant="outline"
                          className={`
                            rounded-full
                            px-4
                            py-1.5
                            border
                            ${meta.badge}
                          `}
                        >
                          <Clock3 className="h-3 w-3 mr-1" />

                          {meta.time}
                        </Badge>
                      </div>

                      {/* CONTENT */}

                      <div className="mt-8">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                          {meta.subtitle}
                        </div>

                        <h3 className="mt-3 text-3xl font-black tracking-tight leading-tight">
                          {category.name}
                        </h3>

                        <p className="mt-5 text-sm leading-7 text-muted-foreground">
                          {category.description ||
                            "Generate detailed BOQs and professional project estimates."}
                        </p>
                      </div>

                      {/* FEATURES */}

                      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {meta.features.map((feature) => (
                          <div
                            key={feature}
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                bg-white/70
                                px-4
                                py-4
                                text-sm
                                backdrop-blur-sm
                                transition-all
                                duration-300
                                hover:border-orange-500/30
                              "
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                              <CheckCircle2 className="h-4 w-4 text-orange-500" />
                            </div>

                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}

                      <Button
                        className={`
                          group/btn
                          mt-8
                          h-14
                          w-full
                          justify-between
                          rounded-2xl
                          px-5
                          text-sm
                          font-semibold
                          shadow-lg
                          transition-all
                          duration-300
                          hover:scale-[1.02]
                          ${meta.button}
                        `}
                      >
                        <span>Start {category.name}</span>

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
