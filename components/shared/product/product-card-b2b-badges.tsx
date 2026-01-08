"use client"

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardB2BBadgesProps {
  minOrderQuantity?: number | undefined
  businessVerified?: boolean | undefined
  samplesAvailable?: boolean | undefined
  labels: {
    moq: string
    samples: string
    verified: string
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

function ProductCardB2BBadges({
  minOrderQuantity,
  businessVerified,
  samplesAvailable,
  labels,
}: ProductCardB2BBadgesProps) {
  const showMoq = minOrderQuantity && minOrderQuantity > 1

  if (!showMoq && !businessVerified && !samplesAvailable) return null

  return (
    <div className="mt-0.5 hidden lg:flex flex-wrap gap-1">
      {showMoq && (
        <span className="rounded-sm bg-info/10 px-1 py-px text-2xs font-medium text-info">
          {labels.moq}:{minOrderQuantity}
        </span>
      )}
      {samplesAvailable && (
        <span className="rounded-sm bg-warning/10 px-1 py-px text-2xs font-medium text-warning">
          {labels.samples}
        </span>
      )}
      {businessVerified && (
        <span className="rounded-sm bg-success/10 px-1 py-px text-2xs font-medium text-success">
          {labels.verified}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardB2BBadges, type ProductCardB2BBadgesProps }
