import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(_req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      listing:listings(id, title, image_urls, status),
      messages(id, body, sender_id, is_read, created_at)
    `)
    .contains('participant_ids', [user.id])
    .order('last_message_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enrich with other participant info
  const enriched = await Promise.all(
    (conversations || []).map(async (conv) => {
      const otherId = conv.participant_ids.find((pid: string) => pid !== user.id)
      let otherUser = null
      if (otherId) {
        const { data } = await supabase
          .from('users')
          .select('id, name, avatar_url, school')
          .eq('id', otherId)
          .single()
        otherUser = data
      }

      const msgs = conv.messages || []
      const lastMsg = msgs.sort((a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]

      const unreadCount = msgs.filter(
        (m: { is_read: boolean; sender_id: string }) => !m.is_read && m.sender_id !== user.id
      ).length

      return { ...conv, other_user: otherUser, last_message: lastMsg, unread_count: unreadCount, messages: undefined }
    })
  )

  return NextResponse.json({ conversations: enriched })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { listing_id, seller_id } = body

  if (!listing_id || !seller_id) {
    return NextResponse.json({ error: 'listing_id and seller_id are required' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: buyer } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!buyer) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (buyer.id === seller_id) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
  }

  // Check for existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('listing_id', listing_id)
    .contains('participant_ids', [buyer.id, seller_id])
    .limit(1)
    .maybeSingle()

  if (existing) return NextResponse.json({ conversation: existing })

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      listing_id,
      participant_ids: [buyer.id, seller_id],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ conversation }, { status: 201 })
}
