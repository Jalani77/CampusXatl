import { Resend } from 'resend'

// Lazy-initialize so the constructor never runs at build time
// when RESEND_API_KEY is a placeholder or missing
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key || key.startsWith('re_placeholder') || key === 'placeholder') return null
  return new Resend(key)
}

const FROM = process.env.RESEND_FROM_EMAIL || 'hello@campusxatl.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://campusxatl.com'

export async function sendWelcomeEmail(to: string, name: string) {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to CampusXATL',
    html: `<p>Hi ${name}, welcome to CampusXATL — your campus marketplace.</p><p><a href="${APP_URL}/listings/new">Post your first listing</a></p>`,
  })
}

export async function sendMessageNotificationEmail(
  to: string,
  senderName: string,
  listingTitle: string,
  conversationId: string
) {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `${senderName} messaged you about "${listingTitle}"`,
    html: `<p>${senderName} sent you a message about <strong>${listingTitle}</strong>.</p><p><a href="${APP_URL}/messages/${conversationId}">Reply</a></p>`,
  })
}

export async function sendListingReportEmail(listingId: string, reason: string) {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: FROM,
    subject: `[Report] Listing ${listingId}: ${reason}`,
    html: `<p>Listing <a href="${APP_URL}/listings/${listingId}">${listingId}</a> was reported for: ${reason}</p>`,
  })
}
