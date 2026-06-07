'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import SubscriptionBadge from '@/components/SubscriptionBadge'
import ReportModal from '@/components/ReportModal'
import { useUser } from '@clerk/nextjs'
import { getInitials } from '@/lib/utils'
import { Flag, GraduationCap, MapPin } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  school?: string
  graduation_year?: number
  bio?: string
  avatar_url?: string
  subscription_tier: string
  created_at: string
}

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

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { isSignedIn } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [listingCount, setListingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setProfile(data.user)
        setListings(data.listings || [])
        setListingCount(data.listing_count || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 bg-gray-50">
          <div className="max-w-4xl mx-auto px-5 py-10 animate-pulse">
            <div className="flex gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">User not found.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 py-8">
          {/* Profile header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-teal-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-teal-700">{getInitials(profile.name)}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                  {profile.subscription_tier !== 'free' && (
                    <SubscriptionBadge tier={profile.subscription_tier} />
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-3">
                  {profile.school && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5" /> {profile.school}
                    </span>
                  )}
                  {profile.graduation_year && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <GraduationCap className="w-3.5 h-3.5" /> Class of {profile.graduation_year}
                    </span>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{profile.bio}</p>
                )}

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{listingCount}</p>
                    <p className="text-xs text-gray-500">Active listings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {isSignedIn && (
                <button
                  onClick={() => setReportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-xs hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              )}
            </div>
          </div>

          {/* Listings */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active listings ({listingCount})</h2>
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No active listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={{ ...listing, seller: { id: profile.id, name: profile.name, school: profile.school, subscription_tier: profile.subscription_tier } }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {reportOpen && (
        <ReportModal
          listingId={userId}
          onClose={() => setReportOpen(false)}
        />
      )}
    </>
  )
}
