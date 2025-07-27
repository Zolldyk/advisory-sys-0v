import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"

export async function GET() {
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

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Error in advisor messages API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "advisor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipient_id, content } = await request.json()

    if (!recipient_id || !content?.trim()) {
      return NextResponse.json({ error: "Recipient and content are required" }, { status: 400 })
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        sender_id: session.id,
        recipient_id,
        content: content.trim(),
      })
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
      .single()

    if (error) {
      console.error("Error sending message:", error)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error in advisor send message API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
