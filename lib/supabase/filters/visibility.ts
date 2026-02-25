export const PUBLIC_PRODUCT_VISIBILITY_OR_FILTER =
  "status.eq.active,status.is.null" as const

/**
 * Public browsing surfaces must not show non-active listings.
 *
 * Temporary legacy allowance:
 * - Some older rows may have `status = NULL`; treat them as "active" until a cleanup pass
 *   normalizes them. (PROD-DATA-002)
 */
export function applyPublicProductVisibilityFilter<Q extends { or: (filters: string) => Q }>(
  query: Q,
): Q {
  return query.or(PUBLIC_PRODUCT_VISIBILITY_OR_FILTER)
}
