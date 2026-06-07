import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendListingReportEmail } from '@/lib/resend'

const REASONS = ['spam', 'inappropriate', 'scam', 'wrong_category', 'other']

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/listings/[id]/report'>
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json()
  const { reason, details, reported_user_id } = body

  if (!reason || !REASONS.includes(reason)) {
    return NextResponse.json({ error: 'Invalid reason' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await supabase.from('reports').insert({
    reporter_id: user.id,
    listing_id: id,
    reported_user_id: reported_user_id || null,
    reason,
    details: details || null,
  })

  // Count reports on this listing
  const { count } = await supabase
    .from('reports')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', id)

  if ((count || 0) >= 3) {
    await supabase
      .from('listings')
      .update({ is_flagged: true, flag_reason: reason })
      .eq('id', id)

    try {
      await sendListingReportEmail(id, reason)
    } catch {}
  }

  return NextResponse.json({ success: true })
}
