"use client"

import { Badge } from "@/components/ui/badge"

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
        <Badge variant="secondary" className="text-2xs">
          {labels.moq}:{minOrderQuantity}
        </Badge>
      )}
      {samplesAvailable && (
        <Badge variant="secondary" className="text-2xs">
          {labels.samples}
        </Badge>
      )}
      {businessVerified && (
        <Badge variant="secondary" className="text-2xs">
          {labels.verified}
        </Badge>
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardB2BBadges, type ProductCardB2BBadgesProps }
