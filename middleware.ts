import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

<<<<<<< HEAD
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Protect dashboard and profile routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
=======
export default auth((req: NextRequest & { auth?: any }) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Protect dashboard, profile, and post creation routes
  if (pathname.startsWith("/dashboard") || 
      pathname.startsWith("/profile") ||
      pathname.startsWith("/posts/new")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url))
>>>>>>> origin/ralph/US-008
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