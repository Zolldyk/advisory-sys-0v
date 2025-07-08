import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, title, credits } = await request.json()

    if (!code || !title || !credits) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({
        code: code.toUpperCase(),
        title,
        credits: Number.parseInt(credits),
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json({ error: "Course code already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: "Failed to create course" }, { status: 400 })
    }

    return NextResponse.json({ course: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
