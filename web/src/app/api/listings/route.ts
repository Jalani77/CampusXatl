import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { validateListing } from '@/lib/safety'
import { PLANS } from '@/lib/stripe'

const CATEGORIES = ['textbooks', 'electronics', 'furniture', 'clothing', 'services', 'housing', 'tutoring', 'other']
const CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor']

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const campusArea = searchParams.get('campus_area') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '24', 10), 50)
  const offset = (page - 1) * limit

  const supabase = createServerClient()

  let query = supabase
    .from('listings')
    .select(`
      *,
      seller:users!listings_seller_id_fkey(id, name, school, avatar_url, subscription_tier)
    `, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category && CATEGORIES.includes(category)) {
    query = query.eq('category', category)
  }
  if (campusArea) {
    query = query.ilike('campus_area', `%${campusArea}%`)
  }
  if (search) {
    query = query.textSearch('fts', search, { type: 'websearch' })
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ listings: data, total: count, page, limit })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, price, category, listing_type, condition, campus_area, image_urls } = body

  // Validate required fields
  if (!title || !description || price === undefined || !category || !campus_area) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  if (condition && !CONDITIONS.includes(condition)) {
    return NextResponse.json({ error: 'Invalid condition' }, { status: 400 })
  }

  const validation = validateListing(title, description, parseFloat(price))
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 422 })
  }

  const supabase = createServerClient()

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('id, subscription_tier, is_banned')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.is_banned) return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 })

  // Check plan listing limit
  const tier = user.subscription_tier as keyof typeof PLANS
  const plan = PLANS[tier] || PLANS.free
  if (plan.listingLimit !== Infinity) {
    const { count } = await supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .eq('status', 'active')

    if ((count || 0) >= plan.listingLimit) {
      return NextResponse.json({
        error: `You've reached your listing limit (${plan.listingLimit}) for the ${plan.name} plan. Upgrade to post more.`,
      }, { status: 429 })
    }
  }

  // Rate limiting: max 10 per 24h
  const now = new Date()
  const { data: rateLimit } = await supabase
    .from('listing_rate_limits')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (rateLimit) {
    const resetAt = new Date(rateLimit.reset_at)
    if (now < resetAt) {
      if (rateLimit.count_today >= 10) {
        return NextResponse.json({ error: 'Rate limit exceeded. You can create up to 10 listings per day.' }, { status: 429 })
      }
      await supabase
        .from('listing_rate_limits')
        .update({ count_today: rateLimit.count_today + 1 })
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('listing_rate_limits')
        .update({ count_today: 1, reset_at: new Date(now.getTime() + 86400000).toISOString() })
        .eq('user_id', user.id)
    }
  } else {
    await supabase
      .from('listing_rate_limits')
      .insert({ user_id: user.id, count_today: 1, reset_at: new Date(now.getTime() + 86400000).toISOString() })
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      seller_id: user.id,
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      listing_type: listing_type || 'item',
      condition: condition || null,
      campus_area: campus_area.trim(),
      image_urls: image_urls || [],
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ listing }, { status: 201 })
}
