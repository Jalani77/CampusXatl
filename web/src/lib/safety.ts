import { Filter } from 'bad-words'

const filter = new Filter()

export function containsProfanity(text: string): boolean {
  try {
    return filter.isProfane(text)
  } catch {
    return false
  }
}

export function sanitizeText(text: string): string {
  try {
    return filter.clean(text)
  } catch {
    return text
  }
}

const SCAM_PATTERNS = [
  /cash\s*app/gi,
  /venmo\s*only/gi,
  /western\s*union/gi,
  /wire\s*transfer/gi,
  /gift\s*card/gi,
  /crypto\s*only/gi,
  /bitcoin/gi,
  /send\s*money\s*first/gi,
  /pay\s*upfront/gi,
]

export function detectScamPatterns(text: string): { flagged: boolean; reason?: string } {
  for (const pattern of SCAM_PATTERNS) {
    if (pattern.test(text)) {
      return { flagged: true, reason: `Potential scam pattern detected` }
    }
  }
  return { flagged: false }
}

export function validateListing(title: string, description: string, price: number): { valid: boolean; error?: string } {
  if (containsProfanity(title) || containsProfanity(description)) {
    return { valid: false, error: 'Listing contains inappropriate language.' }
  }
  const scamCheck = detectScamPatterns(description)
  if (scamCheck.flagged) {
    return { valid: false, error: 'Listing description contains content that violates our guidelines. Avoid requesting payment methods outside the platform.' }
  }
  if (price < 0 || price > 100000) {
    return { valid: false, error: 'Price must be between $0 and $100,000.' }
  }
  if (title.length < 3 || title.length > 100) {
    return { valid: false, error: 'Title must be between 3 and 100 characters.' }
  }
  if (description.length < 10 || description.length > 2000) {
    return { valid: false, error: 'Description must be between 10 and 2000 characters.' }
  }
  return { valid: true }
}
