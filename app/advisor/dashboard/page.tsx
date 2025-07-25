import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"
import { AdvisorDashboard } from "@/components/advisor/dashboard"
import { redirect } from "next/navigation"

export default async function AdvisorDashboardPage() {
  const session = await getSession()

  if (!session || session.role !== "advisor") {
    redirect("/auth/advisor/login")
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

  // Fetch messages for this advisor
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      created_at,
      sender:users!sender_id (
        id,
        name,
        matric_number,
        role
      ),
      recipient:users!recipient_id (
        id,
        name,
        role
      )
    `)
    .or(`sender_id.eq.${session.id},recipient_id.eq.${session.id}`)
    .order("created_at", { ascending: true })

  return <AdvisorDashboard user={session} students={students || []} messages={messages || []} />
}
