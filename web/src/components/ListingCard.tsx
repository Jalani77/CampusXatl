import Link from 'next/link'
import Image from 'next/image'
import SaveButton from './SaveButton'
import SubscriptionBadge from './SubscriptionBadge'
import { formatPrice, timeAgo } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  listing_type: string
  category: string
  condition?: string
  campus_area: string
  image_urls: string[]
  status: string
  created_at: string
  seller?: {
    id: string
    name: string
    school?: string
    subscription_tier?: string
  }
}

interface ListingCardProps {
  listing: Listing
  savedListingIds?: string[]
}

const CATEGORY_LABELS: Record<string, string> = {
  textbooks: 'Textbooks',
  electronics: 'Electronics',
  furniture: 'Furniture',
  clothing: 'Clothing',
  services: 'Services',
  housing: 'Housing',
  tutoring: 'Tutoring',
  other: 'Other',
}

export default function ListingCard({ listing, savedListingIds = [] }: ListingCardProps) {
  const isSaved = savedListingIds.includes(listing.id)
  const isActive = listing.status === 'active'

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-teal-50 to-teal-100 overflow-hidden">
          {listing.image_urls && listing.image_urls.length > 0 ? (
            <Image
              src={listing.image_urls[0]}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-30">
                {listing.category === 'textbooks' ? '📚' :
                 listing.category === 'electronics' ? '💻' :
                 listing.category === 'furniture' ? '🪑' :
                 listing.category === 'clothing' ? '👕' :
                 listing.category === 'tutoring' ? '🎓' :
                 listing.category === 'housing' ? '🏠' : '📦'}
              </span>
            </div>
          )}

          {/* Status badge */}
          {!isActive && (
            <div className="absolute top-2 left-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                listing.status === 'sold' ? 'bg-gray-800 text-white' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {listing.status === 'sold' ? 'Sold' : 'Archived'}
              </span>
            </div>
          )}

          {/* Save button */}
          <div className="absolute top-2 right-2">
            <SaveButton listingId={listing.id} initialSaved={isSaved} />
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug flex-1">
              {listing.title}
            </p>
            <span className="text-sm font-bold text-teal-700 whitespace-nowrap">
              {formatPrice(listing.price, listing.listing_type)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">
              {CATEGORY_LABELS[listing.category] || listing.category}
            </span>
            {listing.condition && (
              <span className="text-xs text-gray-500">{listing.condition.replace('_', ' ')}</span>
            )}
          </div>

          {listing.seller && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 truncate max-w-[100px]">{listing.seller.name}</span>
                {listing.seller.subscription_tier && listing.seller.subscription_tier !== 'free' && (
                  <SubscriptionBadge tier={listing.seller.subscription_tier} />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[80px]">{listing.campus_area}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-1">{timeAgo(listing.created_at)}</p>
        </div>
      </div>
    </Link>
  )
}
