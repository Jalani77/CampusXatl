'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getInitials, timeAgo } from '@/lib/utils'
import { containsProfanity } from '@/lib/safety'

interface Message {
  id: string
  body: string
  sender_id: string
  is_read: boolean
  created_at: string
  sender?: {
    id: string
    name: string
    avatar_url?: string
  }
}

interface MessageThreadProps {
  conversationId: string
  currentUserId: string
}

export default function MessageThread({ conversationId, currentUserId }: MessageThreadProps) {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/conversations/${conversationId}/messages`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data.messages || [])
    }
  }, [conversationId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch full message with sender info
          const { data } = await supabase
            .from('messages')
            .select('*, sender:users!messages_sender_id_fkey(id, name, avatar_url)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => {
              const exists = prev.some(m => m.id === data.id)
              return exists ? prev : [...prev, data]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    if (containsProfanity(text)) {
      setError('Your message contains inappropriate language. Please revise it.')
      return
    }

    setSending(true)
    setError('')
    setInput('')

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })

    setSending(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to send message.')
      setInput(text) // restore
    }
  }

  const groupedMessages = messages.reduce<Array<{ date: string; messages: Message[] }>>((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const last = acc[acc.length - 1]
    if (last && last.date === date) {
      last.messages.push(msg)
    } else {
      acc.push({ date, messages: [msg] })
    }
    return acc
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {groupedMessages.map(group => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">{group.date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {group.messages.map((msg, idx) => {
              const isMe = msg.sender_id === currentUserId
              const prevMsg = group.messages[idx - 1]
              const showAvatar = !prevMsg || prevMsg.sender_id !== msg.sender_id

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 mb-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 flex-shrink-0">
                    {!isMe && showAvatar && (
                      <div className="w-7 h-7 rounded-full bg-teal-100 overflow-hidden flex items-center justify-center">
                        {msg.sender?.avatar_url ? (
                          <Image
                            src={msg.sender.avatar_url}
                            alt={msg.sender.name}
                            width={28}
                            height={28}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-teal-700">
                            {msg.sender ? getInitials(msg.sender.name) : '?'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    {msg.body}
                    <div className={`text-xs mt-0.5 ${isMe ? 'text-teal-200' : 'text-gray-400'}`}>
                      {timeAgo(msg.created_at)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        {error && (
          <p className="text-xs text-red-600 mb-2">{error}</p>
        )}
        <form onSubmit={handleSend} className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setError('')
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e as unknown as React.FormEvent)
              }
            }}
            placeholder="Message..."
            rows={1}
            maxLength={2000}
            className="flex-1 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-40 transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
