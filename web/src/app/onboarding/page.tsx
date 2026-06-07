'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const ATL_SCHOOLS = [
  'Georgia Tech',
  'Georgia State University',
  'Morehouse College',
  'Spelman College',
  'Clark Atlanta University',
  'Emory University',
  'Kennesaw State University',
  'Agnes Scott College',
  'Mercer University - Atlanta',
  'Oglethorpe University',
  'Other',
]

const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => 2024 + i)

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [school, setSchool] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoaded) return
    // Check if already onboarded
    const checkUser = async () => {
      const res = await fetch('/api/users/me')
      if (res.ok) {
        const data = await res.json()
        if (data.user?.school) {
          router.push('/browse')
        }
      }
    }
    checkUser()
  }, [isLoaded, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!school) {
      setError('Please select your school.')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        school,
        graduation_year: graduationYear ? parseInt(graduationYear) : null,
        bio: bio.trim(),
      }),
    })

    if (!res.ok) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push('/browse')
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.firstName || 'Student'}!</h1>
          <p className="text-gray-500 text-sm mt-1">Tell us a bit about yourself to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your school *</label>
            <select
              value={school}
              onChange={e => setSchool(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select your school...</option>
              {ATL_SCHOOLS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected graduation year</label>
            <select
              value={graduationYear}
              onChange={e => setGraduationYear(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select year...</option>
              {GRAD_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio (optional)</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell other students a bit about yourself..."
              rows={3}
              maxLength={300}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{bio.length}/300</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Get started'}
          </button>
        </form>
      </div>
    </div>
  )
}
