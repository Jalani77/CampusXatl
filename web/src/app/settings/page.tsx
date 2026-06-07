'use client'

import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

const ATL_SCHOOLS = [
  'Georgia Tech', 'Georgia State University', 'Morehouse College',
  'Spelman College', 'Clark Atlanta University', 'Emory University',
  'Kennesaw State University', 'Agnes Scott College',
  'Mercer University - Atlanta', 'Oglethorpe University', 'Other',
]
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => 2024 + i)

export default function SettingsPage() {
  const { user } = useUser()
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setName(data.user.name || '')
          setSchool(data.user.school || '')
          setGraduationYear(data.user.graduation_year?.toString() || '')
          setBio(data.user.bio || '')
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        school,
        graduation_year: graduationYear ? parseInt(graduationYear) : null,
        bio: bio.trim(),
      }),
    })

    setSaving(false)
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to save.')
    }
  }

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-5 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

          {/* Navigation */}
          <div className="flex gap-2 mb-8">
            <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-200">
              Profile
            </span>
            <Link href="/settings/billing" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
              Billing
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Profile information</h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="text"
                  value={user?.primaryEmailAddress?.emailAddress || ''}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Managed by Clerk</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={100}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">School</label>
                <select
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select school...</option>
                  {ATL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Graduation year</label>
                <select
                  value={graduationYear}
                  onChange={e => setGraduationYear(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select year...</option>
                  {GRAD_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Tell other students about yourself..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{bio.length}/300</p>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">Profile saved.</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
