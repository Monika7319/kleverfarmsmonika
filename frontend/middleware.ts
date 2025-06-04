import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path.startsWith("/about") ||
    path.startsWith("/farms") ||
    path.startsWith("/admin") || 
    path.startsWith("/farmer") || // Add this line to allow access to farmer routes
    path.startsWith("/_next") ||
    path.startsWith("/api/auth")

  // Get the token from the cookies
  const token = request.cookies.get("auth_session")?.value || ""

  // If the path is not public and there's no token, redirect to home page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the path is login/register and there's a token, redirect to dashboard
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes for authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
