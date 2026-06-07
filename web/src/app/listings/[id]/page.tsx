'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SaveButton from '@/components/SaveButton'
import ReportModal from '@/components/ReportModal'
import SubscriptionBadge from '@/components/SubscriptionBadge'
import { useUser } from '@clerk/nextjs'
import { formatPrice, timeAgo, getInitials } from '@/lib/utils'
import { MapPin, Eye, Flag, Edit, Trash2, CheckCircle, Archive, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  listing_type: string
  category: string
  condition?: string
  campus_area: string
  image_urls: string[]
  status: string
  view_count: number
  created_at: string
  seller_id: string
  seller?: {
    id: string
    name: string
    school?: string
    avatar_url?: string
    subscription_tier?: string
    created_at: string
    bio?: string
  }
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [reportOpen, setReportOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/users/me')
        .then(r => r.json())
        .then(data => setCurrentUserId(data.user?.id || null))
        .catch(() => {})
    }
  }, [isSignedIn])

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(data => {
        setListing(data.listing)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const isSeller = currentUserId && listing?.seller_id === currentUserId

  const handleMessage = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
    if (!listing) return

    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listing.id, seller_id: listing.seller_id }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push(`/messages/${data.conversation.id}`)
    }
  }

  const handleStatusChange = async (status: string) => {
    const res = await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const data = await res.json()
      setListing(data.listing)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    setDeleting(true)
    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/browse')
    } else {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 bg-gray-50">
          <div className="max-w-5xl mx-auto px-5 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!listing) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Listing not found</h1>
            <Link href="/browse" className="text-teal-600 hover:underline text-sm">Back to browse</Link>
          </div>
        </main>
      </>
    )
  }

  const images = listing.image_urls || []
  const CONDITION_LABELS: Record<string, string> = {
    new: 'New', like_new: 'Like New', good: 'Good', fair: 'Fair', poor: 'Poor'
  }

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 py-8">
          {/* Breadcrumb */}
          <Link href="/browse" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to browse
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="relative aspect-square bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[currentImage]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImage(i => Math.max(0, i - 1))}
                          disabled={currentImage === 0}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full disabled:opacity-30 hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCurrentImage(i => Math.min(images.length - 1, i + 1))}
                          disabled={currentImage === images.length - 1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full disabled:opacity-30 hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-20">📦</span>
                  </div>
                )}

                {listing.status !== 'active' && (
                  <div className="absolute top-3 left-3">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      listing.status === 'sold' ? 'bg-gray-800 text-white' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.status === 'sold' ? 'Sold' : 'Archived'}
                    </span>
                  </div>
                )}

                {!isSeller && (
                  <div className="absolute top-3 right-3">
                    <SaveButton listingId={listing.id} />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === currentImage ? 'border-teal-600' : 'border-gray-200'
                      }`}
                    >
                      <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{listing.title}</h1>
              </div>

              <div className="text-3xl font-bold text-teal-700 mb-4">
                {formatPrice(listing.price, listing.listing_type)}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium capitalize">
                  {listing.category}
                </span>
                {listing.condition && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                    {CONDITION_LABELS[listing.condition] || listing.condition}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" /> {listing.campus_area}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="w-3 h-3" /> {listing.view_count} views
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Description</h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>

              {/* Actions */}
              {isSeller ? (
                <div className="space-y-2 mb-6">
                  <Link
                    href={`/listings/${listing.id}/edit`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit listing
                  </Link>
                  {listing.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange('sold')}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark as sold
                    </button>
                  )}
                  {listing.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange('archived')}
                      className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Archive className="w-4 h-4" /> Archive
                    </button>
                  )}
                  {listing.status !== 'active' && (
                    <button
                      onClick={() => handleStatusChange('active')}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      Re-activate listing
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting...' : 'Delete listing'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  <button
                    onClick={handleMessage}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Message seller
                  </button>
                  <button
                    onClick={() => setReportOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" /> Report listing
                  </button>
                </div>
              )}

              {/* Seller card */}
              {listing.seller && (
                <Link href={`/profile/${listing.seller.id}`} className="block">
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-teal-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {listing.seller.avatar_url ? (
                          <Image
                            src={listing.seller.avatar_url}
                            alt={listing.seller.name}
                            width={44}
                            height={44}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-teal-700">
                            {getInitials(listing.seller.name)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{listing.seller.name}</span>
                          {listing.seller.subscription_tier && listing.seller.subscription_tier !== 'free' && (
                            <SubscriptionBadge tier={listing.seller.subscription_tier} />
                          )}
                        </div>
                        {listing.seller.school && (
                          <p className="text-xs text-gray-500">{listing.seller.school}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Member since {new Date(listing.seller.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              <p className="text-xs text-gray-400 mt-3">Listed {timeAgo(listing.created_at)}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {reportOpen && (
        <ReportModal listingId={listing.id} onClose={() => setReportOpen(false)} />
      )}
    </>
  )
}
