import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
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
    priceId: process.env.STRIPE_CAMPUS_PLUS_PRICE_ID!,
    listingLimit: 15,
    features: ['15 active listings', 'Seller badge', 'Activity insights', 'Priority placement'],
  },
  campus_pro: {
    name: 'Campus Pro',
    price: 9,
    priceId: process.env.STRIPE_CAMPUS_PRO_PRICE_ID!,
    listingLimit: Infinity,
    features: ['Unlimited listings', 'Advanced seller tools', 'Enhanced profile', 'All Campus+ features'],
  },
}
