'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, MessageSquare, Heart, Settings, LogOut, User, Plus } from 'lucide-react'
import { useUser, useClerk } from '@clerk/nextjs'
import { getInitials } from '@/lib/utils'

function UnreadBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isSignedIn) return
    fetch('/api/users/me')
      .then(r => r.json())
      .then(data => {
        if (data.user?.id) setCurrentUserId(data.user.id)
      })
      .catch(() => {})
  }, [isSignedIn])

  useEffect(() => {
    if (!isSignedIn) return
    const fetchUnread = () => {
      fetch('/api/conversations')
        .then(r => r.json())
        .then(data => {
          const total = (data.conversations || []).reduce(
            (sum: number, c: { unread_count: number }) => sum + (c.unread_count || 0),
            0
          )
          setUnreadCount(total)
        })
        .catch(() => {})
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [isSignedIn])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#1A7A6E' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7 2.5C4.5 2.5 2.5 4.5 2.5 7.5C2.5 10.5 4.5 12.5 7 12.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M8.5 4L12 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 4L8.5 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight text-[15px]">
            Campus<span style={{ color: '#1A7A6E' }}>XATL</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/browse" className="px-3.5 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            Browse
          </Link>
          <Link href="/about" className="px-3.5 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {!isSignedIn && (
            <>
            <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#1A7A6E' }}
            >
              Get started
            </Link>
            </>
          )}

          {isSignedIn && (
            <>
            <Link
              href="/listings/new"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#1A7A6E' }}
            >
              <Plus className="w-4 h-4" />
              Post
            </Link>

            {/* Inbox */}
            <Link href="/messages" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5" />
              <UnreadBadge count={unreadCount} />
            </Link>

            {/* Saved */}
            <Link href="/saved" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center hover:ring-2 hover:ring-teal-500 transition-all"
              >
                {user?.imageUrl ? (
                  <Image src={user.imageUrl} alt={user.fullName || 'Profile'} width={32} height={32} className="object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-teal-700">
                    {user?.fullName ? getInitials(user.fullName) : 'U'}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  {currentUserId && (
                    <Link
                      href={`/profile/${currentUserId}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My profile
                    </Link>
                  )}
                  <Link
                    href="/listings/new"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    My listings
                  </Link>
                  <Link
                    href="/saved"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Saved
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 pb-4 pt-2 flex flex-col gap-1">
          <Link href="/browse" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setOpen(false)}>
            Browse
          </Link>
          <Link href="/about" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setOpen(false)}>
            About
          </Link>

          {isSignedIn && (
            <>
            <Link href="/listings/new" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setOpen(false)}>
              Post a listing
            </Link>
            <Link href="/messages" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors" onClick={() => setOpen(false)}>
              Messages
              {unreadCount > 0 && <span className="text-xs bg-teal-600 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </Link>
            <Link href="/saved" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setOpen(false)}>
              Saved
            </Link>
            <Link href="/settings" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setOpen(false)}>
              Settings
            </Link>
            <button
              onClick={() => signOut()}
              className="px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left transition-colors"
            >
              Sign out
            </button>
            </>
          )}

          {!isSignedIn && (
            <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/sign-in" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-3 py-2.5 text-sm font-medium text-white rounded-lg text-center transition-colors"
                style={{ backgroundColor: '#1A7A6E' }}
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
