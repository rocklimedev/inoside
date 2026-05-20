import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware is intentionally kept as a passthrough.
 *
 * WHY: The app uses localStorage for token storage. Cookies are only written
 * by the React client after hydration. This means on any hard navigation or
 * first load, the cookie doesn't exist yet when middleware runs — causing
 * incorrect redirects on protected dynamic routes like /project/[id]/brief.
 *
 * Auth protection is handled entirely client-side in AppProviders:
 * - Unauthenticated users are redirected to /login via useEffect
 * - Protected pages render a spinner (not children) while auth resolves
 * - No flash of protected content is possible because isLoading gates rendering
 *
 * If you later switch to httpOnly server-set cookies (e.g. via an API route
 * that sets Set-Cookie), you can re-enable middleware redirects at that point.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
