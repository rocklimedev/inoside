// middleware.ts (at project root, same level as app/)
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle root path
  if (pathname === "/") {
    // Get token from cookies
    const token = request.cookies.get("access_token")?.value;

    // Not authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // This middleware can't determine role, so let the page handle it
    // OR redirect to a default dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
