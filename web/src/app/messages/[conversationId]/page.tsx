'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import MessageThread from '@/components/MessageThread'
import { ChevronLeft } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

interface ConversationData {
  id: string
  listing?: {
    id: string
    title: string
    price: number
    image_urls: string[]
    status: string
    listing_type: string
  } | null
  other_user?: {
    id: string
    name: string
    avatar_url?: string
    school?: string
  } | null
}

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const [conversation, setConversation] = useState<ConversationData | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(data => setCurrentUserId(data.user?.id || null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}`)
      .then(r => r.json())
      .then(data => {
        setConversation(data.conversation)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [conversationId])

  if (loading) {
    return (
      <>
        <Nav />
        <div className="h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="flex-1 bg-white" style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3 bg-white flex items-center gap-3 flex-shrink-0">
          <Link href="/messages" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>

          {conversation?.other_user && (
            <div className="w-9 h-9 rounded-full bg-teal-100 overflow-hidden flex items-center justify-center flex-shrink-0">
              {conversation.other_user.avatar_url ? (
                <Image
                  src={conversation.other_user.avatar_url}
                  alt={conversation.other_user.name}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-teal-700">
                  {getInitials(conversation.other_user.name)}
                </span>
              )}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{conversation?.other_user?.name || 'User'}</p>
            {conversation?.listing && (
              <Link href={`/listings/${conversation.listing.id}`} className="text-xs text-teal-600 hover:underline truncate block">
                {conversation.listing.title} · {formatPrice(conversation.listing.price, conversation.listing.listing_type)}
              </Link>
            )}
          </div>

          {conversation?.listing?.image_urls?.[0] && (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={conversation.listing.image_urls[0]}
                alt={conversation.listing.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-hidden">
          {currentUserId ? (
            <MessageThread conversationId={conversationId} currentUserId={currentUserId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
