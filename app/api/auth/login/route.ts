import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("Attempting login for:", email)

    const user = await signIn(email, password)
    console.log("User authenticated:", user.email, user.role)

    await createSession(user)
    console.log("Session created successfully")

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        matric_number: user.matric_number,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Login failed",
      },
      { status: 401 },
    )
  }
}
