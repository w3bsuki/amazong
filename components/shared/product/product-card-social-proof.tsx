"use client"

import { Star } from "@phosphor-icons/react"

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardSocialProofProps {
  rating?: number | undefined
  reviews?: number | undefined
  soldCount?: number | undefined
  soldLabel: string
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Format count with K suffix for thousands (1234 → "1.2K")
 */
function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// =============================================================================
// COMPONENT
// =============================================================================

function ProductCardSocialProof({
  rating,
  reviews,
  soldCount,
  soldLabel,
}: ProductCardSocialProofProps) {
  const hasRating = typeof rating === "number" && rating > 0
  const reviewCount = reviews ?? 0
  const hasSoldCount = typeof soldCount === "number" && soldCount > 0

  if (!hasRating && !hasSoldCount) return null

  return (
    <div className="mt-1 flex items-center gap-1 text-2xs text-muted-foreground">
      {hasRating && (
        <>
          <Star size={10} weight="fill" className="text-muted-foreground" />
          <span className="font-medium tabular-nums">
            {rating.toFixed(1)}
          </span>
          {reviewCount > 0 && <span>({formatCount(reviewCount)})</span>}
        </>
      )}

      {hasRating && hasSoldCount && <span className="text-muted-foreground">·</span>}

      {hasSoldCount && (
        <span>
          {formatCount(soldCount)} {soldLabel}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardSocialProof, type ProductCardSocialProofProps }
