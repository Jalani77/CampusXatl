import Stripe from 'stripe'

// Lazy-initialize to avoid constructor throw at build time with placeholder keys
let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2026-05-27.dahlia',
    })
  }
  return _stripe
}

// Keep named export for direct use in webhooks etc.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    listingLimit: 3,
    features: ['3 active listings', 'Standard profile', 'Direct messaging'],
  },
  campus_plus: {
    name: 'Campus+',
    price: 4,
    priceId: process.env.STRIPE_CAMPUS_PLUS_PRICE_ID || '',
    listingLimit: 15,
    features: ['15 active listings', 'Seller badge', 'Activity insights', 'Priority placement'],
  },
  campus_pro: {
    name: 'Campus Pro',
    price: 9,
    priceId: process.env.STRIPE_CAMPUS_PRO_PRICE_ID || '',
    listingLimit: Infinity,
    features: ['Unlimited listings', 'Advanced seller tools', 'Enhanced profile', 'All Campus+ features'],
  },
}
