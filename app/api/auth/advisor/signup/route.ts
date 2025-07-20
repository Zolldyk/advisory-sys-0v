import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, adminCode } = await request.json()

    // Verify advisor registration code (same as admin)
    if (adminCode !== "ADMIN2024") {
      return NextResponse.json({ error: "Invalid advisor registration code" }, { status: 400 })
    }

    const user = await signUp({
      name,
      email,
      password,
      role: "advisor",
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error: any) {
    console.error("Advisor signup error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
  }
}
