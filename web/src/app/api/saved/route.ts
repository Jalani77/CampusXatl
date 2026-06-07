import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: saved, error } = await supabase
    .from('saved_listings')
    .select(`
      listing:listings(
        id, title, price, listing_type, category, condition, campus_area,
        image_urls, status, created_at,
        seller:users!listings_seller_id_fkey(id, name, school, subscription_tier)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const listings = (saved || []).map((s: { listing: unknown }) => s.listing).filter(Boolean)

  return NextResponse.json({ listings })
}
