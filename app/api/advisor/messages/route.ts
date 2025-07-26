import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "advisor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        created_at,
        sender:sender_id(id, name, email, role),
        recipient:recipient_id(id, name, email, role)
      `)
      .or(`sender_id.eq.${session.id},recipient_id.eq.${session.id}`)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching advisor messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "advisor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipient_id, content } = await request.json()

    if (!recipient_id || !content) {
      return NextResponse.json({ error: "Recipient and content are required" }, { status: 400 })
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        sender_id: session.id,
        recipient_id,
        content,
      })
      .select(`
        id,
        content,
        created_at,
        sender:sender_id(id, name, email, role),
        recipient:recipient_id(id, name, email, role)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error sending advisor message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
