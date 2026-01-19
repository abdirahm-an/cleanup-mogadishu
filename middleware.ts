import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Protect moderator routes - require MODERATOR role
    if (pathname.startsWith("/moderator")) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      if (req.nextauth.token.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Protect dashboard, profile, and post creation routes
    if (pathname.startsWith("/dashboard") || 
        pathname.startsWith("/profile") ||
        pathname.startsWith("/posts/new")) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    // Protect specific routes only
    "/dashboard/:path*",
    "/profile/:path*",
    "/posts/new/:path*",
    "/moderator/:path*",
    // Don't run on api, _next, or static files
  ],
}
