export interface ListingCard {
  id: string
  title: string
  price: number
  currency?: string
  image?: string
  slug?: string
  storeSlug?: string
}

function isListingCard(value: unknown): value is ListingCard {
  if (!value || typeof value !== "object") return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.price === "number" &&
    Number.isFinite(candidate.price)
  )
}

export function extractListings(parts: unknown): ListingCard[] {
  const listings: ListingCard[] = []
  if (!Array.isArray(parts)) return listings

  for (const rawPart of parts) {
    if (!rawPart || typeof rawPart !== "object") continue
    const part = rawPart as { type?: string; output?: unknown; state?: string }

    // AI SDK v6: tool parts are typed as `tool-{toolName}` with state
    if (
      part.type === "tool-searchListings" &&
      part.state === "output-available" &&
      Array.isArray(part.output)
    ) {
      for (const rawListing of part.output) {
        if (isListingCard(rawListing)) {
          listings.push(rawListing)
        }
      }
    }
  }

  return listings
}

