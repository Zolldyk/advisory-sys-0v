import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "advisor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: students, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        matric_number,
        created_at,
        registrations (
          courses (
            code,
            title,
            credits
          )
        )
      `)
      .eq("role", "student")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching students:", error)
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
    }

    return NextResponse.json({ students: students || [] })
  } catch (error) {
    console.error("Error in students API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
