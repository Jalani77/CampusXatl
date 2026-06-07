import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { validateListing } from '@/lib/safety'

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/listings/[id]'>
) {
  const { id } = await ctx.params
  const supabase = createServerClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      seller:users!listings_seller_id_fkey(id, name, school, avatar_url, subscription_tier, created_at, bio)
    `)
    .eq('id', id)
    .single()

  if (error || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  // Increment view count async (fire and forget)
  supabase
    .from('listings')
    .update({ view_count: (listing.view_count || 0) + 1 })
    .eq('id', id)
    .then(() => {})

  return NextResponse.json({ listing })
}

export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/listings/[id]'>
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = createServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, is_banned')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.is_banned) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  const { data: existing } = await supabase
    .from('listings')
    .select('seller_id')
    .eq('id', id)
    .single()

  if (!existing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  if (existing.seller_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const updates: Record<string, unknown> = {}

  if (body.title !== undefined) updates.title = body.title.trim()
  if (body.description !== undefined) updates.description = body.description.trim()
  if (body.price !== undefined) updates.price = parseFloat(body.price)
  if (body.category !== undefined) updates.category = body.category
  if (body.condition !== undefined) updates.condition = body.condition
  if (body.campus_area !== undefined) updates.campus_area = body.campus_area.trim()
  if (body.status !== undefined) updates.status = body.status
  if (body.image_urls !== undefined) updates.image_urls = body.image_urls
  updates.updated_at = new Date().toISOString()

  if (updates.title && updates.description && updates.price !== undefined) {
    const v = validateListing(updates.title as string, updates.description as string, updates.price as number)
    if (!v.valid) return NextResponse.json({ error: v.error }, { status: 422 })
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ listing })
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/listings/[id]'>
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

  const { data: existing } = await supabase
    .from('listings')
    .select('seller_id')
    .eq('id', id)
    .single()

  if (!existing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  if (existing.seller_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase.from('listings').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
