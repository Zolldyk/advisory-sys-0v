import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseIds } = await request.json()

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: "No courses selected" }, { status: 400 })
    }

    // Check credit limit
    const { data: courses } = await supabase.from("courses").select("credits").in("id", courseIds)

    const { data: currentRegistrations } = await supabase
      .from("registrations")
      .select("courses(credits)")
      .eq("student_id", session.id)

    const currentCredits = currentRegistrations?.reduce((sum, reg) => sum + reg.courses.credits, 0) || 0
    const newCredits = courses?.reduce((sum, course) => sum + course.credits, 0) || 0

    if (currentCredits + newCredits > 24) {
      return NextResponse.json({ error: "Credit limit exceeded" }, { status: 400 })
    }

    // Register for courses
    const registrations = courseIds.map((courseId) => ({
      student_id: session.id,
      course_id: courseId,
    }))

    const { error } = await supabase.from("registrations").insert(registrations)

    if (error) {
      return NextResponse.json({ error: "Registration failed" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
