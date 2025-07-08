import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"
import { StudentDashboard } from "@/components/student/dashboard"
import { redirect } from "next/navigation"

export default async function StudentDashboardPage() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/auth/student/login")
  }

  // Fetch student's registered courses
  const { data: registrations } = await supabase
    .from("registrations")
    .select(`
      id,
      created_at,
      courses (
        id,
        code,
        title,
        credits
      )
    `)
    .eq("student_id", session.id)

  const registeredCourses =
    registrations?.map((reg) => ({
      id: reg.courses.id,
      code: reg.courses.code,
      title: reg.courses.title,
      credits: reg.courses.credits,
      registeredAt: reg.created_at,
    })) || []

  return <StudentDashboard user={session} registeredCourses={registeredCourses} />
}
