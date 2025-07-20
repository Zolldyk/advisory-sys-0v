import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    const user = await signUp({
      name,
      email,
      password,
      role: "advisor",
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
  }
}
