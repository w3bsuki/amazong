import { NextResponse } from "next/server"
import { z } from "zod"

/**
 * Cache profiles for different API endpoint types.
 * Align with next.config.ts cacheLife settings.
 */
export const CACHE_PROFILES = {
  /** Products: 5 min cache, 1 min stale-while-revalidate */
  products: { ttl: 300, swr: 60 },
  /** Deals: 2 min cache, 30s stale-while-revalidate (more dynamic) */
  deals: { ttl: 120, swr: 30 },
  /** Categories: 1 hour cache, 5 min stale-while-revalidate (rarely changes) */
  categories: { ttl: 3600, swr: 300 },
  /** Catalog-like endpoints: 1 hour cache, 5 min stale-while-revalidate */
  catalog: { ttl: 3600, swr: 300 },
  /** Shared/tokenized views: 1 min cache, 30s stale-while-revalidate */
  shared: { ttl: 60, swr: 30 },
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
  return NextResponse.json({ error: message, ...extra }, { status })
}

/**
 * Database unavailable response (503 Service Unavailable).
 */
export function dbUnavailableResponse(extra?: Record<string, unknown>): NextResponse {
  return errorResponse("Database unavailable", 503, extra)
}

/**
 * Parse common pagination params from search params.
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults: { page?: number; limit?: number; maxLimit?: number } = {}
): { page: number; limit: number; offset: number } {
  const { page: defaultPage = 1, limit: defaultLimit = 12, maxLimit = 24 } = defaults

  const page = z.coerce.number().int().min(1).catch(defaultPage).parse(searchParams.get("page") ?? defaultPage)
  const requestedLimit = z.coerce
    .number()
    .int()
    .min(1)
    .catch(defaultLimit)
    .parse(searchParams.get("limit") ?? defaultLimit)

  const limit = Math.min(requestedLimit, maxLimit)
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Create a JSON response with no-store cache headers.
 * Use for private/user-specific data that should never be cached.
 */
export function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(data, init)
  res.headers.set("Cache-Control", "private, no-store")
  res.headers.set("CDN-Cache-Control", "private, no-store")
  res.headers.set("Vercel-CDN-Cache-Control", "private, no-store")
  return res
}

