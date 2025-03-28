import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Get the pathname from the URL
  const path = request.nextUrl.pathname

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/cases",
    "/documents",
    "/clients",
    "/calendar",
    "/profile",
    "/settings",
    "/notifications",
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // If the route is protected and the user is not authenticated, redirect to the landing page
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (path === "/auth" || path.startsWith("/auth/"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}

