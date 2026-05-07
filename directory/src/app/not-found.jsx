"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-8xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold">Page Not Found</h2>

        <p className="mt-4 text-muted-foreground">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-border px-6 py-3 transition hover:bg-accent hover:text-accent-foreground"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
