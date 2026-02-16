import type { UIProduct } from "@/lib/types/products"

const FOR_YOU_PROMOTED_LIMIT = 8

/**
 * Phase-one "For you" blend:
 * - Up to 8 promoted products first.
 * - Fill remaining slots with newest products.
 * - Deduplicate by product id.
 */
export function buildForYouPool(promoted: UIProduct[], newest: UIProduct[], limit: number): UIProduct[] {
  const out: UIProduct[] = []
  const seen = new Set<string>()

  for (const product of promoted.slice(0, FOR_YOU_PROMOTED_LIMIT)) {
    if (seen.has(product.id)) continue
    seen.add(product.id)
    out.push(product)
  }

  for (const product of newest) {
    if (out.length >= limit) break
    if (seen.has(product.id)) continue
    seen.add(product.id)
    out.push(product)
  }

  return out.slice(0, limit)
}
