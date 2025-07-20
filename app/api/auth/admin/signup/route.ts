import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, adminCode } = await request.json()

    // Verify admin registration code
    if (adminCode !== "ADMIN2024") {
      return NextResponse.json({ error: "Invalid admin registration code" }, { status: 400 })
    }

    const user = await signUp({
      name,
      email,
      password,
      role: "admin",
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error: any) {
    console.error("Admin signup error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
  }
}
