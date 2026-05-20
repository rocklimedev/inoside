import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that never require authentication
const PUBLIC_PATHS = ["/login", "/register", "/no-access", "/not-found"];

// Paths that are only for unauthenticated users (redirect away if already authed)
const GUEST_ONLY_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookie (set during login in AuthContext)
  const token = request.cookies.get("access_token")?.value;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isGuestOnly = GUEST_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  // Already logged in → don't show login/register again
  if (token && isGuestOnly) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Not logged in → redirect to login for protected routes
  if (!token && !isPublic && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
