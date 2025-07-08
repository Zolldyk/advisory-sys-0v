import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"
import { StudentMessages } from "@/components/student/messages"
import { redirect } from "next/navigation"

export default async function StudentMessagesPage() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/auth/student/login")
  }

  // Fetch messages for this student
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      created_at,
      sender:users!sender_id (
        id,
        name,
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

  // Get admin user for sending messages
  const { data: admin } = await supabase.from("users").select("id, name").eq("role", "admin").single()

  return <StudentMessages user={session} messages={messages || []} adminUser={admin} />
}
