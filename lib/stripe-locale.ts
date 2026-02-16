/**
 * Stripe locale URL utilities.
 *
 * Centralizes locale-safe return URL generation for Stripe checkout/portal flows.
 * No app imports allowed (pure lib module).
 */

export type SupportedLocale = 'en' | 'bg'

/**
 * Normalize unknown locale value to a supported locale.
 * Defaults to 'en' if invalid or missing.
 */
export function normalizeLocale(locale: unknown): SupportedLocale {
  return locale === 'bg' ? 'bg' : 'en'
}

/**
 * Get the base app URL without trailing slash.
 */
export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

/**
 * Build an absolute locale-prefixed URL using the app URL from environment.
 *
 * For Stripe return/refresh URLs, we MUST use the configured NEXT_PUBLIC_APP_URL
 * since Stripe redirects happen client-side and the request origin (e.g., 0.0.0.0:3000)
 * won't work after the redirect.
 */
export function buildLocaleUrlFromRequest(
  _req: Request,
  path: string,
  locale: unknown,
  query?: string,
): string {
  // Always use env var for Stripe URLs - request origin doesn't work for redirects
  const base = getAppUrl()
  const safeLocale = normalizeLocale(locale)
  const cleanPath = path.replace(/^\//, '')
  const url = `${base}/${safeLocale}/${cleanPath}`
  return query ? `${url}?${query}` : url
}

/**
 * Build an absolute locale-prefixed URL.
 *
 * @param path - Path without leading slash (e.g. 'account/payments')
 * @param locale - Locale to prefix, or unknown value that will be normalized
 * @param query - Optional query string (without leading ?)
 * @returns Absolute URL like https://example.com/en/account/payments?setup=success
 */
export function buildLocaleUrl(
  path: string,
  locale: unknown,
  query?: string,
): string {
  const base = getAppUrl()
  const safeLocale = normalizeLocale(locale)
  const cleanPath = path.replace(/^\//, '')
  const url = `${base}/${safeLocale}/${cleanPath}`
  return query ? `${url}?${query}` : url
}

/**
 * Infer locale from a Request object.
 *
 * Checks in order:
 * 1. Explicit bodyLocale parameter (if provided)
 * 2. x-next-intl-locale header
 * 3. First path segment of Referer header
 * 4. Defaults to 'en'
 */
export function inferLocaleFromRequest(
  req: Request,
  bodyLocale?: unknown,
): SupportedLocale {
  if (bodyLocale) return normalizeLocale(bodyLocale)
  return inferLocaleFromHeaders(req.headers)
}

function inferLocaleFromUrl(urlValue: string | null): SupportedLocale | null {
  if (!urlValue) return null
  try {
    const url = new URL(urlValue)
    const firstSegment = url.pathname.split('/').filter(Boolean)[0]
    return firstSegment ? normalizeLocale(firstSegment) : null
  } catch {
    return null
  }
}

/**
 * Infer locale from header-like objects (request headers or equivalent mocks).
 * Priority: x-next-intl-locale > referer path segment > origin path segment > en.
 */
export function inferLocaleFromHeaders(
  headers: { get: (name: string) => string | null },
): SupportedLocale {
  const headerLocale = headers.get('x-next-intl-locale')
  if (headerLocale) return normalizeLocale(headerLocale)

  const refererLocale = inferLocaleFromUrl(headers.get('referer'))
  if (refererLocale) return refererLocale

  const originLocale = inferLocaleFromUrl(headers.get('origin'))
  if (originLocale) return originLocale

  return 'en'
}
