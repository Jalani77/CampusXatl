'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare } from 'lucide-react'
import { getInitials, timeAgo } from '@/lib/utils'
import EmptyState from './EmptyState'

interface Conversation {
  id: string
  listing?: { id: string; title: string; image_urls: string[]; status: string } | null
  other_user?: { id: string; name: string; avatar_url?: string; school?: string } | null
  last_message?: { body: string; sender_id: string; created_at: string } | null
  unread_count: number
  last_message_at: string
}

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => {
        setConversations(data.conversations || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No messages yet"
        body="When you message a seller or someone messages you, your conversations will appear here."
        cta={{ label: 'Browse listings', href: '/browse' }}
      />
    )
  }

  return (
    <div className="space-y-1">
      {conversations.map(conv => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
              {conv.other_user?.avatar_url ? (
                <Image
                  src={conv.other_user.avatar_url}
                  alt={conv.other_user.name}
                  width={44}
                  height={44}
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-teal-700">
                  {conv.other_user ? getInitials(conv.other_user.name) : '?'}
                </span>
              )}
            </div>
            {conv.unread_count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {conv.unread_count > 9 ? '9+' : conv.unread_count}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm truncate ${conv.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                {conv.other_user?.name || 'Unknown'}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {conv.last_message ? timeAgo(conv.last_message.created_at) : timeAgo(conv.last_message_at)}
              </span>
            </div>
            {conv.listing && (
              <p className="text-xs text-gray-400 truncate mb-0.5">{conv.listing.title}</p>
            )}
            <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {conv.last_message?.body || 'Start the conversation'}
            </p>
          </div>

          {/* Listing thumbnail */}
          {conv.listing?.image_urls?.[0] && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={conv.listing.image_urls[0]}
                alt={conv.listing.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
