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

function getOriginFromRequest(req: Request): string | null {
  try {
    return new URL(req.url).origin
  } catch {
    return null
  }
}

/**
 * Build an absolute locale-prefixed URL using the incoming request origin as the base.
 *
 * This is safer than relying on env vars for Stripe return/refresh URLs, especially on Vercel,
 * where missing/incorrect `NEXT_PUBLIC_SITE_URL` can break Connect onboarding flows.
 */
export function buildLocaleUrlFromRequest(
  req: Request,
  path: string,
  locale: unknown,
  query?: string,
): string {
  const base = getOriginFromRequest(req) ?? getAppUrl()
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

  const headerLocale = req.headers.get('x-next-intl-locale')
  if (headerLocale) return normalizeLocale(headerLocale)

  const referer = req.headers.get('referer')
  if (referer) {
    try {
      const url = new URL(referer)
      const firstSegment = url.pathname.split('/').filter(Boolean)[0]
      if (firstSegment) return normalizeLocale(firstSegment)
    } catch {
      // ignore invalid referer
    }
  }

  return 'en'
}

/**
 * Infer locale from headers() async call (Next.js server context).
 *
 * Checks in order:
 * 1. x-next-intl-locale header
 * 2. First path segment of Referer header
 * 3. First path segment of Origin header (fallback - only useful if origin includes locale path)
 * 4. Defaults to 'en'
 */
export function inferLocaleFromHeaders(headersList: {
  get: (name: string) => string | null
}): SupportedLocale {
  const headerLocale = headersList.get('x-next-intl-locale')
  if (headerLocale) return normalizeLocale(headerLocale)

  const referer = headersList.get('referer')
  if (referer) {
    try {
      const url = new URL(referer)
      const firstSegment = url.pathname.split('/').filter(Boolean)[0]
      if (firstSegment) return normalizeLocale(firstSegment)
    } catch {
      // ignore invalid referer
    }
  }

  // Origin fallback (rarely useful since origin typically has no path, but included for completeness)
  const origin = headersList.get('origin')
  if (origin) {
    try {
      const url = new URL(origin)
      const firstSegment = url.pathname.split('/').filter(Boolean)[0]
      if (firstSegment) return normalizeLocale(firstSegment)
    } catch {
      // ignore invalid origin
    }
  }

  return 'en'
}
