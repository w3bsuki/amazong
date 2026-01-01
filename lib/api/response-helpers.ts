import { NextResponse } from "next/server"

/**
 * Cache profiles for different API endpoint types.
 * Align with next.config.ts cacheLife settings.
 */
export const CACHE_PROFILES = {
  /** Products: 5 min cache, 1 min stale-while-revalidate */
  products: { ttl: 300, swr: 60 },
  /** Deals: 2 min cache, 30s stale-while-revalidate (more dynamic) */
  deals: { ttl: 120, swr: 30 },
  /** Categories: 10 min cache, 2 min stale-while-revalidate (rarely changes) */
  categories: { ttl: 600, swr: 120 },
  /** User data: no cache */
  private: { ttl: 0, swr: 0 },
} as const

export type CacheProfile = keyof typeof CACHE_PROFILES

/**
 * Create a cached JSON response with proper CDN headers.
 * 
 * @param data - Response data to serialize as JSON
 * @param profile - Cache profile to use (default: 'products')
 * @param init - Additional ResponseInit options
 */
export function cachedJsonResponse(
  data: unknown,
  profile: CacheProfile = "products",
  init?: ResponseInit
): NextResponse {
  const { ttl, swr } = CACHE_PROFILES[profile]
  const res = NextResponse.json(data, init)
  
  if (ttl > 0) {
    res.headers.set(
      "Cache-Control",
      `public, s-maxage=${ttl}, stale-while-revalidate=${swr}`
    )
    res.headers.set("CDN-Cache-Control", `public, max-age=${ttl}`)
    res.headers.set("Vercel-CDN-Cache-Control", `public, max-age=${ttl}`)
  } else {
    res.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate")
  }
  
  return res
}

/**
 * Standard error response for API routes.
 */
export function errorResponse(
  message: string,
  status: number = 500,
  extra?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    { 
      error: message,
      products: [],
      hasMore: false,
      ...extra 
    },
    { status }
  )
}

/**
 * Database unavailable response (503 Service Unavailable).
 */
export function dbUnavailableResponse(): NextResponse {
  return errorResponse("Database unavailable", 503)
}

/**
 * Parse common pagination params from search params.
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults: { page?: number; limit?: number; maxLimit?: number } = {}
): { page: number; limit: number; offset: number } {
  const { page: defaultPage = 1, limit: defaultLimit = 12, maxLimit = 24 } = defaults
  
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || String(defaultPage), 10))
  const requestedLimit = Number.parseInt(searchParams.get("limit") || String(defaultLimit), 10)
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit)
  const offset = (page - 1) * limit
  
  return { page, limit, offset }
}

/**
 * Build standard paginated response.
 */
export function paginatedResponse<T>(
  items: T[],
  totalCount: number,
  page: number,
  offset: number,
  profile: CacheProfile = "products"
): NextResponse {
  return cachedJsonResponse({
    products: items,
    hasMore: offset + items.length < totalCount,
    totalCount,
    page,
  }, profile)
}
