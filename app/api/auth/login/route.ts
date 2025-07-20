import { type NextRequest, NextResponse } from "next/server"
import { signIn, type User } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(req: NextRequest) {
  try {
    const { email, password, userType } = await req.json()

    // 1 · Authenticate
    const user = (await signIn(email, password)) as User

    // 2 · Role guard
    if (userType === "student" && user.role !== "student") {
      return NextResponse.json({ error: "Use the student login page for student accounts." }, { status: 401 })
    }
    if (userType === "admin" && !["admin", "advisor"].includes(user.role)) {
      return NextResponse.json({ error: "Use the admin/advisor login page for those accounts." }, { status: 401 })
    }

    // 3 · Create cookie-based session (JWT)
    await createSession(user)

    return NextResponse.json({ user })
  } catch (err: any) {
    console.error("Login error:", err)
    return NextResponse.json({ error: err?.message ?? "Login failed" }, { status: 401 })
  }
}
