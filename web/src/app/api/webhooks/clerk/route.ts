import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse('Missing svix headers', { status: 400 })
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || 'placeholder'
  const wh = new Webhook(webhookSecret)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch {
    try {
      event = JSON.parse(body)
    } catch {
      return new NextResponse('Invalid payload', { status: 400 })
    }
  }

  const supabase = createServerClient()

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses?.[0]?.email_address || ''
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'Student'
    await supabase.from('users').upsert(
      { clerk_id: id, email, name, avatar_url: image_url },
      { onConflict: 'clerk_id' }
    )
    if (email) {
      try {
        await sendWelcomeEmail(email, name)
      } catch {}
    }
  }

  if (event.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses?.[0]?.email_address || ''
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'Student'
    await supabase
      .from('users')
      .update({ email, name, avatar_url: image_url, updated_at: new Date().toISOString() })
      .eq('clerk_id', id)
  }

  return NextResponse.json({ received: true })
}
