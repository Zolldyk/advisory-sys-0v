import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"
import { CourseRegistration } from "@/components/student/course-registration"
import { redirect } from "next/navigation"

export default async function StudentCoursesPage() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/auth/student/login")
  }

  // Fetch all available courses
  const { data: allCourses } = await supabase.from("courses").select("*").order("code")

  // Fetch student's registered courses
  const { data: registrations } = await supabase.from("registrations").select("course_id").eq("student_id", session.id)

  const registeredCourseIds = registrations?.map((reg) => reg.course_id) || []

  return <CourseRegistration user={session} allCourses={allCourses || []} registeredCourseIds={registeredCourseIds} />
}
