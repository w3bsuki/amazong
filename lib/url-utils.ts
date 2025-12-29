// =============================================================================
// PRODUCT URL UTILITIES
// Centralized functions for generating SEO-friendly product URLs
// =============================================================================

export interface ProductUrlParams {
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

  // Fallback: if we have an ID but no seller username, route via /product/{id}.
  // This avoids broken links and keeps the console clean when partial product data is rendered.
  if (product.id) return `/product/${product.id}`

  // If we can't build any safe URL, fail closed.
  return '#'
}

/**
 * Generates an absolute product URL with locale prefix.
 * 
 * @param product - Product data
 * @param locale - Locale code (e.g., 'en', 'bg')
 * @returns Full URL path with locale (e.g., '/en/john-store/blue-widget')
 */
export function getProductUrlWithLocale(product: ProductUrlParams, locale: string): string {
  return `/${locale}${getProductUrl(product)}`
}

/**
 * Generates an absolute product URL with domain.
 * Useful for social sharing, canonical URLs, and sitemaps.
 * 
 * @param product - Product data
 * @param locale - Locale code
 * @param baseUrl - Base URL (defaults to NEXT_PUBLIC_SITE_URL or 'https://treido.eu')
 * @returns Absolute URL (e.g., 'https://treido.eu/en/john-store/blue-widget')
 */
export function getAbsoluteProductUrl(
  product: ProductUrlParams, 
  locale: string,
  baseUrl?: string
): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://treido.eu'
  return `${base}${getProductUrlWithLocale(product, locale)}`
}

/**
 * Generates a seller/store profile URL.
 * 
 * @param username - Seller's username
 * @returns Profile URL (e.g., '/john-store')
 */
export function getSellerUrl(username: string): string {
  return `/${username}`
}

/**
 * Generates a seller/store profile URL with locale.
 * 
 * @param username - Seller's username
 * @param locale - Locale code
 * @returns Full profile URL with locale (e.g., '/en/john-store')
 */
export function getSellerUrlWithLocale(username: string, locale: string): string {
  return `/${locale}/${username}`
}
