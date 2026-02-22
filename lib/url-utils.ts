// =============================================================================
// PRODUCT URL UTILITIES
// Centralized functions for generating SEO-friendly product URLs
// =============================================================================

interface ProductUrlParams {
  id?: string
  slug?: string | null
  username?: string | null
  /** @deprecated Use 'username' instead */
  storeSlug?: string | null
}

/**
 * Generates an SEO-friendly product URL.
 * 
 * URL patterns (in order of preference):
 * 1. /{username}/{slug} - Best SEO (e.g., /john-store/blue-widget)
 * 2. /{username}/{id} - Canonical fallback when slug is missing (page supports UUID as productSlug)
 * 
 * @param product - Product data containing id, slug, and username/storeSlug
 * @returns The optimal product URL path
 * 
 * @example
 * // With username and slug (preferred)
 * getProductUrl({ id: '123', slug: 'blue-widget', username: 'john-store' })
 * // Returns: '/john-store/blue-widget'
 * 
 * @example
 * // Fallback with ID when slug is missing (still canonical)
 * getProductUrl({ id: 'uuid...', username: 'john-store' })
 * // Returns: '/john-store/uuid...'
 */
export function getProductUrl(product: ProductUrlParams): string {
  // Use username (prefer 'username' over deprecated 'storeSlug')
  const sellerUsername = product.username || product.storeSlug
  
  if (sellerUsername) {
    if (product.slug) return `/${sellerUsername}/${product.slug}`
    if (product.id) return `/${sellerUsername}/${product.id}`
  }

  // If seller username is missing, fail closed to avoid non-canonical routes.
  if (product.id) return "#"

  // If we can't build any safe URL, fail closed.
  return '#'
}
