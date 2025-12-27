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

  // If we can't build a canonical URL, fail closed.
  console.warn('getProductUrl: Missing seller username and/or product identifier', product)
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
 * @param baseUrl - Base URL (defaults to NEXT_PUBLIC_SITE_URL or 'https://amazong.com')
 * @returns Absolute URL (e.g., 'https://amazong.com/en/john-store/blue-widget')
 */
export function getAbsoluteProductUrl(
  product: ProductUrlParams, 
  locale: string,
  baseUrl?: string
): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://amazong.com'
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
