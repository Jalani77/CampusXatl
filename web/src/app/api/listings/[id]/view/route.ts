import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(
  _req: Request,
  ctx: RouteContext<'/api/listings/[id]/view'>
) {
  const { id } = await ctx.params
  const supabase = createServerClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('view_count')
    .eq('id', id)
    .single()

  if (listing) {
    await supabase
      .from('listings')
      .update({ view_count: (listing.view_count || 0) + 1 })
      .eq('id', id)
  }

  return NextResponse.json({ success: true })
}
