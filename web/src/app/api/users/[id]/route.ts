import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/users/[id]'>
) {
  const { id } = await ctx.params
  const supabase = createServerClient()

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, school, graduation_year, bio, avatar_url, subscription_tier, created_at')
    .eq('id', id)
    .single()

  if (error || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, price, image_urls, category, campus_area, created_at, listing_type, condition, status')
    .eq('seller_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { count: listingCount } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('seller_id', id)
    .eq('status', 'active')

  return NextResponse.json({ user, listings: listings || [], listing_count: listingCount || 0 })
}
