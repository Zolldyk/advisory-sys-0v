import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"
import { AdminDashboard } from "@/components/admin/dashboard"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/auth/admin/login")
  }

  // Fetch students with their registered courses
  const { data: students } = await supabase
    .from("users")
    .select(`
      id,
      matric_number,
      name,
      email,
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

  // Fetch all courses
  const { data: courses } = await supabase.from("courses").select("*").order("code")

  // Fetch recent messages
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      created_at,
      sender:users!sender_id (
        name,
        matric_number
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <AdminDashboard user={session} students={students || []} courses={courses || []} recentMessages={messages || []} />
  )
}
