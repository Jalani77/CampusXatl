import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/conversations/[id]'>
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

  const { data: conversation, error } = await supabase
    .from('conversations')
    .select(`
      *,
      listing:listings(id, title, image_urls, price, status, seller_id)
    `)
    .eq('id', id)
    .single()

  if (error || !conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (!conversation.participant_ids.includes(user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get other participant
  const otherId = conversation.participant_ids.find((pid: string) => pid !== user.id)
  let otherUser = null
  if (otherId) {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_url, school')
      .eq('id', otherId)
      .single()
    otherUser = data
  }

  return NextResponse.json({ conversation: { ...conversation, other_user: otherUser } })
}
