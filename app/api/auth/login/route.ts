import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json()

    const user = await signIn(email, password)

    // Verify user role matches the expected type
    if (userType === "student" && user.role !== "student") {
      return NextResponse.json({ error: "Invalid credentials for student login" }, { status: 401 })
    }

    if (userType === "admin" && !["admin", "advisor"].includes(user.role)) {
      return NextResponse.json({ error: "Invalid credentials for admin/advisor login" }, { status: 401 })
    }

    const sessionToken = await createSession(user.id)

    const response = NextResponse.json({ user })
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}
