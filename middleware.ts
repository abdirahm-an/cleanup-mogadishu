import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

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
    // Protect these routes
    "/dashboard/:path*",
    "/profile/:path*",
    "/posts/new/:path*",
    // Don't run middleware on these paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}