'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

interface SaveButtonProps {
  listingId: string
  initialSaved?: boolean
  className?: string
}

export default function SaveButton({ listingId, initialSaved = false, className = '' }: SaveButtonProps) {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setLoading(true)
    // Optimistic
    setSaved(prev => !prev)

    try {
      const res = await fetch(`/api/listings/${listingId}/save`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setSaved(data.saved)
      } else {
        setSaved(prev => !prev) // revert
      }
    } catch {
      setSaved(prev => !prev) // revert
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Unsave listing' : 'Save listing'}
      className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors disabled:opacity-60 ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
      />
    </button>
  )
}
