// src/app/not-found.jsx

"use client";

import Link from "next/link";
import { Home, ArrowLeft, Construction } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="glass card-modern animate-fadeInUp w-full max-w-2xl p-10 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <Construction className="h-12 w-12 text-primary animate-subtlePulse" />
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-foreground">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page you are looking for doesn&apos;t exist, was moved, or is
          temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium"
          >
            <Home className="h-4 w-4" />
            Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="surface inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition hover:border-primary/40 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Bottom Text */}
        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          InoSide Construction • Modern Project Management Platform
        </div>
      </div>
    </div>
  );
}
