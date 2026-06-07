'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import EmptyState from '@/components/EmptyState'
import { Search, SlidersHorizontal, BookOpen, Laptop, Sofa, Shirt, Wrench, Home, GraduationCap, Grid2x2, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

const CATEGORIES = [
  { label: 'All', value: '', icon: Grid2x2 },
  { label: 'Textbooks', value: 'textbooks', icon: BookOpen },
  { label: 'Electronics', value: 'electronics', icon: Laptop },
  { label: 'Furniture', value: 'furniture', icon: Sofa },
  { label: 'Clothing', value: 'clothing', icon: Shirt },
  { label: 'Services', value: 'services', icon: Wrench },
  { label: 'Housing', value: 'housing', icon: Home },
  { label: 'Tutoring', value: 'tutoring', icon: GraduationCap },
]

const ATL_AREAS = [
  'Midtown', 'Downtown', 'Buckhead', 'Decatur', 'East Point',
  'College Park', 'Forest Park', 'Dunwoody', 'Sandy Springs',
  'West End', 'Grant Park', 'Kirkwood', 'Vine City',
]

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
  seller?: { id: string; name: string; school?: string; subscription_tier?: string }
}

function BrowseContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isSignedIn } = useUser()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [campusArea, setCampusArea] = useState(searchParams.get('campus_area') || '')
  const [listings, setListings] = useState<Listing[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchListings = useCallback(async (p = 1, append = false) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)

    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (campusArea) params.set('campus_area', campusArea)
    params.set('page', p.toString())
    params.set('limit', '24')

    try {
      const res = await fetch(`/api/listings?${params}`)
      const data = await res.json()
      if (append) {
        setListings(prev => [...prev, ...(data.listings || [])])
      } else {
        setListings(data.listings || [])
      }
      setTotal(data.total || 0)
      setPage(p)
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [search, category, campusArea])

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchListings(1)
      // Update URL params
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (campusArea) params.set('campus_area', campusArea)
      router.replace(`/browse?${params}`, { scroll: false })
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, campusArea])

  // Fetch saved listing ids
  useEffect(() => {
    if (!isSignedIn) return
    fetch('/api/users/me')
      .then(r => r.json())
      .then(data => {
        if (data.user?.id) {
          fetch(`/api/users/${data.user.id}`)
            .then(r => r.json())
            .then(() => {
              // We'd need a separate saved endpoint — for now skip
            })
        }
      })
      .catch(() => {})
  }, [isSignedIn])

  const loadMore = () => fetchListings(page + 1, true)

  const hasMore = listings.length < total

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        {/* Search header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search listings, textbooks, services..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
                  campusArea ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal size={15} />
                Filter
                {campusArea && <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />}
              </button>
            </div>

            {/* Filters */}
            {filtersOpen && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Campus area</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCampusArea('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        !campusArea ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      All areas
                    </button>
                    {ATL_AREAS.map(area => (
                      <button
                        key={area}
                        onClick={() => setCampusArea(campusArea === area ? '' : area)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          campusArea === area ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {CATEGORIES.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    category === value
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={category === value ? { backgroundColor: '#1A7A6E' } : {}}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto px-5 py-6">
          {!loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {total > 0 ? `${total} listing${total !== 1 ? 's' : ''}` : 'No listings found'}
                {search && ` for "${search}"`}
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
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
              icon={Search}
              title="No listings found"
              body={search ? `No results for "${search}". Try a different search or browse all categories.` : 'No listings yet in this category. Check back soon!'}
              cta={{ label: 'Post a listing', href: '/listings/new' }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} savedListingIds={savedIds} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {loadingMore ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <><Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main></>
    }>
      <BrowseContent />
    </Suspense>
  )
}
