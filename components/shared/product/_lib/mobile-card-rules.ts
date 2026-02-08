export type MobileTrustSignal = "rating" | null

const MIN_STRONG_RATING = 4.7
const MIN_STRONG_REVIEWS = 20

export interface ResolveMobileTrustSignalInput {
  rating?: number | undefined
  reviews?: number | undefined
}

export function shouldShowStrongRating(
  rating?: number | undefined,
  reviews?: number | undefined
): boolean {
  if (typeof rating !== "number" || typeof reviews !== "number") return false
  if (!Number.isFinite(rating) || !Number.isFinite(reviews)) return false
  return rating >= MIN_STRONG_RATING && reviews >= MIN_STRONG_REVIEWS
}

export function resolveMobileTrustSignal({
  rating,
  reviews,
}: ResolveMobileTrustSignalInput): MobileTrustSignal {
  if (shouldShowStrongRating(rating, reviews)) return "rating"
  return null
}
