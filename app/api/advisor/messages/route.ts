import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "advisor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, recipientId } = await request.json()

    if (!content || !recipientId) {
      return NextResponse.json({ error: "Content and recipient are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: session.id,
        recipient_id: recipientId,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to send message" }, { status: 400 })
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
