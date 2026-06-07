import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { containsProfanity } from '@/lib/safety'
import { sendMessageNotificationEmail } from '@/lib/resend'

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/conversations/[id]/messages'>
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = createServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: conversation } = await supabase
    .from('conversations')
    .select('participant_ids')
    .eq('id', id)
    .single()

  if (!conversation || !conversation.participant_ids.includes(user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(id, name, avatar_url)
    `)
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mark messages as read
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', id)
    .neq('sender_id', user.id)
    .eq('is_read', false)

  return NextResponse.json({ messages })
}

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/conversations/[id]/messages'>
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json()
  const { message } = body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: 'Message too long (max 2000 chars)' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, name, is_banned')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.is_banned) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  const { data: conversation } = await supabase
    .from('conversations')
    .select(`
      *,
      listing:listings(id, title)
    `)
    .eq('id', id)
    .single()

  if (!conversation || !conversation.participant_ids.includes(user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const isFlagged = containsProfanity(message)

  const { data: newMessage, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: id,
      sender_id: user.id,
      body: message.trim(),
      is_flagged: isFlagged,
    })
    .select(`
      *,
      sender:users!messages_sender_id_fkey(id, name, avatar_url)
    `)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update conversation last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', id)

  // Notify recipient
  const recipientId = conversation.participant_ids.find((pid: string) => pid !== user.id)
  if (recipientId) {
    const { data: recipient } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', recipientId)
      .single()

    if (recipient?.email) {
      try {
        await sendMessageNotificationEmail(
          recipient.email,
          user.name,
          conversation.listing?.title || 'your listing',
          id
        )
      } catch {}
    }
  }

  return NextResponse.json({ message: newMessage }, { status: 201 })
}
