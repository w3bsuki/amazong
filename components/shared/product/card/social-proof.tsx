import { Star } from "lucide-react";


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
    <span className="inline-flex items-center gap-1 text-2xs font-medium text-muted-foreground">
      {hasRating && (
        <>
          <Star size={11} className="text-top-rated" />
          <span className="tabular-nums text-foreground">
            {rating.toFixed(1)}
          </span>
          {reviewCount > 0 && <span className="tabular-nums">({formatCount(reviewCount)})</span>}
        </>
      )}

      {hasRating && hasSoldCount && <span className="text-border">·</span>}

      {hasSoldCount && (
        <span className="tabular-nums">
          {formatCount(soldCount)} {soldLabel}
        </span>
      )}
    </span>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardSocialProof }
