'use client'

import { useEffect, useState, Suspense } from 'react'
import Nav from '@/components/Nav'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PLANS } from '@/lib/stripe'
import { Check } from 'lucide-react'

interface UserData {
  subscription_tier: string
  subscription_status?: string
  stripe_customer_id?: string
}

function BillingContent() {
  const searchParams = useSearchParams()
  const upgraded = searchParams.get('success') === 'true'
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(data => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleUpgrade = async (tier: 'campus_plus' | 'campus_pro') => {
    setCheckoutLoading(tier)
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier }),
    })
    const data = await res.json()
    setCheckoutLoading(null)
    if (data.url) {
      window.location.href = data.url
    }
  }

  const handleManage = async () => {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/create-portal', { method: 'POST' })
    const data = await res.json()
    setPortalLoading(false)
    if (data.url) {
      window.location.href = data.url
    }
  }

  const currentTier = user?.subscription_tier || 'free'

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Billing</h1>

          {/* Navigation */}
          <div className="flex gap-2 mb-8">
            <Link href="/settings" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
              Profile
            </Link>
            <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-200">
              Billing
            </span>
          </div>

          {upgraded && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6">
              <p className="text-green-800 font-medium text-sm">Subscription upgraded! Welcome to {PLANS[currentTier as keyof typeof PLANS]?.name || 'your new plan'}.</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
            </div>
          ) : (
            <>
              {/* Current plan */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Current plan</h2>
                <p className="text-2xl font-bold text-teal-700 mb-1">{PLANS[currentTier as keyof typeof PLANS]?.name || 'Free'}</p>
                {user?.subscription_status && user.subscription_status !== 'active' && (
                  <p className="text-sm text-amber-600">Status: {user.subscription_status}</p>
                )}
                {currentTier !== 'free' && user?.stripe_customer_id && (
                  <button
                    onClick={handleManage}
                    disabled={portalLoading}
                    className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {portalLoading ? 'Opening...' : 'Manage subscription'}
                  </button>
                )}
              </div>

              {/* Plans */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Free */}
                <div className={`bg-white rounded-2xl border p-5 ${currentTier === 'free' ? 'border-teal-600 ring-2 ring-teal-100' : 'border-gray-200'}`}>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">{PLANS.free.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">Free</p>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {PLANS.free.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {currentTier === 'free' && (
                    <span className="text-xs text-teal-700 font-medium">Current plan</span>
                  )}
                </div>

                {/* Campus+ */}
                <div className={`bg-white rounded-2xl border p-5 ${currentTier === 'campus_plus' ? 'border-teal-600 ring-2 ring-teal-100' : 'border-gray-200'}`}>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">{PLANS.campus_plus.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">${PLANS.campus_plus.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {PLANS.campus_plus.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {currentTier === 'campus_plus' ? (
                    <span className="text-xs text-teal-700 font-medium">Current plan</span>
                  ) : currentTier === 'free' ? (
                    <button
                      onClick={() => handleUpgrade('campus_plus')}
                      disabled={checkoutLoading === 'campus_plus'}
                      className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                    >
                      {checkoutLoading === 'campus_plus' ? 'Loading...' : 'Upgrade to Campus+'}
                    </button>
                  ) : null}
                </div>

                {/* Campus Pro */}
                <div className={`bg-white rounded-2xl border p-5 relative ${currentTier === 'campus_pro' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-gray-200'}`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">Best value</span>
                  </div>
                  <div className="mb-4 mt-2">
                    <h3 className="font-semibold text-gray-900">{PLANS.campus_pro.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">${PLANS.campus_pro.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {PLANS.campus_pro.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {currentTier === 'campus_pro' ? (
                    <span className="text-xs text-amber-700 font-medium">Current plan</span>
                  ) : (
                    <button
                      onClick={() => handleUpgrade('campus_pro')}
                      disabled={!!checkoutLoading}
                      className="w-full bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors"
                    >
                      {checkoutLoading === 'campus_pro' ? 'Loading...' : 'Upgrade to Campus Pro'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<><Nav /><main className="flex-1 bg-gray-50" /></>}>
      <BillingContent />
    </Suspense>
  )
}
