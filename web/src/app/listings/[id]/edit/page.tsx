'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Nav from '@/components/Nav'
import ListingForm from '@/components/ListingForm'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  listing_type: string
  condition?: string
  campus_area: string
  image_urls: string[]
}

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(data => {
        setListing(data.listing)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-5 py-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Edit listing</h1>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-xl" />)}
            </div>
          ) : listing ? (
            <ListingForm mode="edit" initialData={listing} />
          ) : (
            <p className="text-gray-500">Listing not found.</p>
          )}
        </div>
      </main>
    </>
  )
}
