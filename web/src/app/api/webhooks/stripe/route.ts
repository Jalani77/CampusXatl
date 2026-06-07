import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase/server'

function tierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_CAMPUS_PLUS_PRICE_ID) return 'campus_plus'
  if (priceId === process.env.STRIPE_CAMPUS_PRO_PRICE_ID) return 'campus_pro'
  return 'free'
}

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  const sig = headerPayload.get('stripe-signature')

  if (!sig) return new NextResponse('Missing stripe-signature', { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return new NextResponse('Webhook signature verification failed', { status: 400 })
  }

  const supabase = createServerClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id
    const tier = tierFromPriceId(priceId)

    await supabase
      .from('users')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_tier: tier,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customerId)

    // Also try matching by metadata clerk_id if available
    const clerkId = session.metadata?.clerk_id
    if (clerkId) {
      await supabase
        .from('users')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_tier: tier,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', clerkId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object
    const priceId = subscription.items.data[0]?.price.id
    const tier = subscription.status === 'active' ? tierFromPriceId(priceId) : 'free'

    await supabase
      .from('users')
      .update({
        subscription_tier: tier,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object

    await supabase
      .from('users')
      .update({
        subscription_tier: 'free',
        subscription_status: 'canceled',
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}
