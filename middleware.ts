import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Protect dashboard and profile routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Protect these routes
    "/dashboard/:path*",
    "/profile/:path*",
    // Don't run middleware on these paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}