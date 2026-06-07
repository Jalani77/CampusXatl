import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: 'Welcome to CampusXATL',
    html: `<p>Hi ${name}, welcome to CampusXATL — your campus marketplace. Start by posting your first listing.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/new">Post a listing</a></p>`,
  })
}

export async function sendMessageNotificationEmail(to: string, senderName: string, listingTitle: string, conversationId: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `${senderName} messaged you about "${listingTitle}"`,
    html: `<p>${senderName} sent you a message about your listing <strong>${listingTitle}</strong>.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/messages/${conversationId}">Reply</a></p>`,
  })
}

export async function sendListingReportEmail(listingId: string, reason: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.RESEND_FROM_EMAIL!,
    subject: `[Report] Listing ${listingId} reported: ${reason}`,
    html: `<p>Listing <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}">${listingId}</a> was reported for: ${reason}</p>`,
  })
}
