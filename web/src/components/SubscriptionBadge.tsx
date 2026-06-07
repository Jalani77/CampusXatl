interface SubscriptionBadgeProps {
  tier: string
  className?: string
}

export default function SubscriptionBadge({ tier, className = '' }: SubscriptionBadgeProps) {
  if (tier === 'campus_plus') {
    return (
      <span className={`inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
        Campus+
      </span>
    )
  }

  if (tier === 'campus_pro') {
    return (
      <span className={`inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
        Campus Pro
      </span>
    )
  }

  return null
}
