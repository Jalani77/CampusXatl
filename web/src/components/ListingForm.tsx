'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

const CATEGORIES = [
  { value: 'textbooks', label: 'Textbooks', emoji: '📚' },
  { value: 'electronics', label: 'Electronics', emoji: '💻' },
  { value: 'furniture', label: 'Furniture', emoji: '🪑' },
  { value: 'clothing', label: 'Clothing', emoji: '👕' },
  { value: 'services', label: 'Services', emoji: '🔧' },
  { value: 'housing', label: 'Housing', emoji: '🏠' },
  { value: 'tutoring', label: 'Tutoring', emoji: '🎓' },
  { value: 'other', label: 'Other', emoji: '📦' },
]

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]

const ATL_AREAS = [
  'Midtown', 'Downtown', 'Buckhead', 'Decatur', 'East Point',
  'College Park', 'Forest Park', 'Dunwoody', 'Sandy Springs',
  'West End', 'Grant Park', 'Kirkwood', 'Vine City', 'Other',
]

interface ListingFormProps {
  mode?: 'create' | 'edit'
  initialData?: {
    id?: string
    title?: string
    description?: string
    price?: number
    category?: string
    listing_type?: string
    condition?: string
    campus_area?: string
    image_urls?: string[]
  }
}

export default function ListingForm({ mode = 'create', initialData }: ListingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [listingType, setListingType] = useState(initialData?.listing_type || 'item')
  const [category, setCategory] = useState(initialData?.category || '')
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [condition, setCondition] = useState(initialData?.condition || '')
  const [campusArea, setCampusArea] = useState(initialData?.campus_area || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.image_urls || [])

  const totalSteps = 4

  const canProceedStep1 = category !== ''
  const canProceedStep2 = title.trim().length >= 3 && description.trim().length >= 10 && campusArea !== ''
  const canProceedStep3 = price !== '' && parseFloat(price) >= 0

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      listing_type: listingType,
      condition: listingType === 'item' ? condition : undefined,
      campus_area: campusArea,
      image_urls: imageUrls,
    }

    const url = mode === 'edit' && initialData?.id
      ? `/api/listings/${initialData.id}`
      : '/api/listings'
    const method = mode === 'edit' ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      return
    }

    router.push(`/listings/${data.listing.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i < step ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
      </div>

      {/* Step 1: Type + Category */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">What are you listing?</h2>
          <p className="text-gray-500 text-sm mb-6">Choose a type and category</p>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Listing type</p>
            <div className="flex gap-3">
              {[{ value: 'item', label: 'Item for sale' }, { value: 'service', label: 'Service' }].map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setListingType(t.value)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                    listingType === t.value
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Category</p>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-colors ${
                    category === c.value
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="mt-8 w-full bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-40 hover:bg-teal-700 transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Listing details</h2>
          <p className="text-gray-500 text-sm mb-6">Help buyers know what you're offering</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Calculus textbook 8th edition"
                maxLength={100}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-400 mt-1">{title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your item — condition, details, what's included..."
                rows={5}
                maxLength={2000}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{description.length}/2000</p>
            </div>

            {listingType === 'item' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
                <div className="flex gap-2 flex-wrap">
                  {CONDITIONS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCondition(c.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        condition === c.value
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Campus area *</label>
              <select
                value={campusArea}
                onChange={e => setCampusArea(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select area...</option>
                {ATL_AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-40 hover:bg-teal-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Price + Images */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Price &amp; photos</h2>
          <p className="text-gray-500 text-sm mb-6">Set your price and add photos to attract buyers</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price * {listingType === 'service' ? '(per hour)' : '(enter 0 for free)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photos (optional)</label>
              <ImageUpload value={imageUrls} onChange={setImageUrls} />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!canProceedStep3}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-40 hover:bg-teal-700 transition-colors"
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Review before publishing</h2>
          <p className="text-gray-500 text-sm mb-6">Make sure everything looks good</p>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
              <span className="text-teal-700 font-bold text-lg">
                ${parseFloat(price).toFixed(2)}{listingType === 'service' ? '/hr' : ''}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-white border border-gray-200 rounded-md px-2 py-0.5 text-gray-600">{category}</span>
              {condition && <span className="text-xs bg-white border border-gray-200 rounded-md px-2 py-0.5 text-gray-600">{condition}</span>}
              <span className="text-xs bg-white border border-gray-200 rounded-md px-2 py-0.5 text-gray-600">{campusArea}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
            {imageUrls.length > 0 && (
              <p className="text-xs text-gray-500">{imageUrls.length} photo{imageUrls.length !== 1 ? 's' : ''} attached</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:bg-teal-700 transition-colors"
            >
              {loading ? 'Publishing...' : mode === 'edit' ? 'Save changes' : 'Publish listing'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
