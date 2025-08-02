import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { AdvisorDashboard } from "@/components/advisor/dashboard"
import { supabase } from "@/lib/supabase"

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdvisorDashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/advisor/login")
    return
  }

  if (session.role !== "advisor") {
    redirect("/")
    return
  }

  // Fetch students for the advisor
  const { data: students } = await supabase
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
        email,
        role,
        matric_number
      ),
      recipient:users!recipient_id (
        id,
        name,
        email,
        role,
        matric_number
      )
    `)
    .or(`sender_id.eq.${session.id},recipient_id.eq.${session.id}`)
    .order("created_at", { ascending: true })

  return <AdvisorDashboard user={session} students={students || []} messages={messages || []} />
}
