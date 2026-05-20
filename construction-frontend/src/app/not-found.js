"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Construction } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* Card */}
      <div className="glass card-modern animate-fadeInUp w-full max-w-2xl rounded-3xl border border-border/50 p-10 text-center shadow-2xl backdrop-blur-xl">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <Construction className="h-12 w-12 animate-subtlePulse text-primary" />
        </div>

        {/* 404 */}
        <h1 className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-8xl font-black tracking-tight text-transparent">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you&apos;re trying to access doesn&apos;t exist or may have
          been moved.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-6 py-3 font-medium transition-all duration-200 hover:border-primary/40 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          InoSide Construction • Modern Project Management Platform
        </div>
      </div>
    </main>
  );
}
