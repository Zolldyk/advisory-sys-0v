import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json()

    const user = await signIn(email, password)

    // Verify user role matches expected type
    if (userType === "admin" && user.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admin credentials required." }, { status: 403 })
    }

    if (userType === "student" && user.role !== "student") {
      return NextResponse.json({ error: "Access denied. Student credentials required." }, { status: 403 })
    }

    await createSession(user)

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}
