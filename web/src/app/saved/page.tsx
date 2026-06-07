'use client'

import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import EmptyState from '@/components/EmptyState'
import { Heart } from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  listing_type: string
  category: string
  campus_area: string
  image_urls: string[]
  status: string
  created_at: string
  condition?: string
  seller?: { id: string; name: string; school?: string; subscription_tier?: string }
}

export default function SavedPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(async data => {
        if (data.user?.id) {
          setCurrentUserId(data.user.id)
          // Fetch saved listings via supabase query through API
          const res = await fetch(`/api/saved`)
          if (res.ok) {
            const d = await res.json()
            setListings(d.listings || [])
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Saved listings</h1>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No saved listings yet"
              body="Tap the heart on any listing to save it here for later."
              cta={{ label: 'Browse listings', href: '/browse' }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  savedListingIds={listings.map(l => l.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
