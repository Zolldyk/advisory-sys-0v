import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const { pathname } = request.nextUrl

  // Protect student routes
  if (pathname.startsWith("/student")) {
    if (!session || session.role !== "student") {
      return NextResponse.redirect(new URL("/auth/student/login", request.url))
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"],
}
