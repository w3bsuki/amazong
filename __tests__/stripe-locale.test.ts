import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  normalizeLocale,
  getAppUrl,
  buildLocaleUrl,
  inferLocaleFromRequest,
  inferLocaleFromHeaders,
  type SupportedLocale,
} from '@/lib/stripe-locale'

describe('lib/stripe-locale', () => {
  describe('normalizeLocale', () => {
    it('returns "bg" when passed "bg"', () => {
      expect(normalizeLocale('bg')).toBe('bg')
    })

    it('returns "en" when passed "en"', () => {
      expect(normalizeLocale('en')).toBe('en')
    })

    it('defaults to "en" for unsupported locales', () => {
      expect(normalizeLocale('de')).toBe('en')
      expect(normalizeLocale('fr')).toBe('en')
      expect(normalizeLocale('es')).toBe('en')
    })

    it('defaults to "en" for null/undefined/empty', () => {
      expect(normalizeLocale(null)).toBe('en')
      expect(normalizeLocale(undefined)).toBe('en')
      expect(normalizeLocale('')).toBe('en')
    })

    it('defaults to "en" for non-string values', () => {
      expect(normalizeLocale(123)).toBe('en')
      expect(normalizeLocale({})).toBe('en')
      expect(normalizeLocale([])).toBe('en')
    })
  })

  describe('getAppUrl', () => {
    const originalEnv = process.env

    beforeEach(() => {
      vi.resetModules()
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('returns NEXT_PUBLIC_APP_URL when set', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'
      process.env.NEXT_PUBLIC_SITE_URL = 'https://other.com'
      expect(getAppUrl()).toBe('https://example.com')
    })

    it('falls back to NEXT_PUBLIC_SITE_URL', () => {
      delete process.env.NEXT_PUBLIC_APP_URL
      process.env.NEXT_PUBLIC_SITE_URL = 'https://site.com'
      expect(getAppUrl()).toBe('https://site.com')
    })

    it('falls back to NEXT_PUBLIC_URL', () => {
      delete process.env.NEXT_PUBLIC_APP_URL
      delete process.env.NEXT_PUBLIC_SITE_URL
      process.env.NEXT_PUBLIC_URL = 'https://url.com'
      expect(getAppUrl()).toBe('https://url.com')
    })

    it('defaults to localhost:3000', () => {
      delete process.env.NEXT_PUBLIC_APP_URL
      delete process.env.NEXT_PUBLIC_SITE_URL
      delete process.env.NEXT_PUBLIC_URL
      expect(getAppUrl()).toBe('http://localhost:3000')
    })

    it('strips trailing slash', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com/'
      expect(getAppUrl()).toBe('https://example.com')
    })
  })

  describe('buildLocaleUrl', () => {
    const originalEnv = process.env

    beforeEach(() => {
      vi.resetModules()
      process.env = { ...originalEnv }
      process.env.NEXT_PUBLIC_APP_URL = 'https://treido.eu'
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('builds URL with bg locale', () => {
      expect(buildLocaleUrl('account/payments', 'bg')).toBe(
        'https://treido.eu/bg/account/payments'
      )
    })

    it('builds URL with en locale', () => {
      expect(buildLocaleUrl('account/payments', 'en')).toBe(
        'https://treido.eu/en/account/payments'
      )
    })

    it('normalizes leading slash in path', () => {
      expect(buildLocaleUrl('/account/payments', 'en')).toBe(
        'https://treido.eu/en/account/payments'
      )
    })

    it('appends query string when provided', () => {
      expect(buildLocaleUrl('account/payments', 'en', 'setup=success')).toBe(
        'https://treido.eu/en/account/payments?setup=success'
      )
    })

    it('handles complex query strings', () => {
      expect(buildLocaleUrl('checkout/success', 'bg', 'session_id=cs_123&ref=abc')).toBe(
        'https://treido.eu/bg/checkout/success?session_id=cs_123&ref=abc'
      )
    })

    it('normalizes unknown locale to en', () => {
      expect(buildLocaleUrl('account/plans', 'de')).toBe(
        'https://treido.eu/en/account/plans'
      )
    })

    it('handles null/undefined locale', () => {
      expect(buildLocaleUrl('account/plans', null)).toBe(
        'https://treido.eu/en/account/plans'
      )
      expect(buildLocaleUrl('account/plans', undefined)).toBe(
        'https://treido.eu/en/account/plans'
      )
    })
  })

  describe('inferLocaleFromRequest', () => {
    function makeRequest(headers: Record<string, string>): Request {
      return {
        headers: {
          get: (name: string) => headers[name.toLowerCase()] ?? null,
        },
      } as unknown as Request
    }

    it('prioritizes bodyLocale when provided', () => {
      const req = makeRequest({ 'x-next-intl-locale': 'en', referer: 'https://example.com/bg/page' })
      expect(inferLocaleFromRequest(req, 'bg')).toBe('bg')
    })

    it('normalizes invalid bodyLocale to en', () => {
      const req = makeRequest({})
      expect(inferLocaleFromRequest(req, 'de')).toBe('en')
    })

    it('uses x-next-intl-locale header when bodyLocale not provided', () => {
      const req = makeRequest({ 'x-next-intl-locale': 'bg' })
      expect(inferLocaleFromRequest(req)).toBe('bg')
    })

    it('normalizes invalid x-next-intl-locale header', () => {
      const req = makeRequest({ 'x-next-intl-locale': 'fr' })
      expect(inferLocaleFromRequest(req)).toBe('en')
    })

    it('extracts locale from referer path', () => {
      const req = makeRequest({ referer: 'https://treido.eu/bg/account/plans' })
      expect(inferLocaleFromRequest(req)).toBe('bg')
    })

    it('normalizes non-locale referer path segment', () => {
      const req = makeRequest({ referer: 'https://treido.eu/de/some-page' })
      expect(inferLocaleFromRequest(req)).toBe('en')
    })

    it('ignores invalid referer URL', () => {
      const req = makeRequest({ referer: 'not-a-url' })
      expect(inferLocaleFromRequest(req)).toBe('en')
    })

    it('defaults to en when no locale info available', () => {
      const req = makeRequest({})
      expect(inferLocaleFromRequest(req)).toBe('en')
    })

    it('handles referer with root path only', () => {
      const req = makeRequest({ referer: 'https://treido.eu/' })
      expect(inferLocaleFromRequest(req)).toBe('en')
    })

    it('priority order: bodyLocale > x-next-intl-locale > referer > default', () => {
      // All sources present - bodyLocale wins
      const req1 = makeRequest({
        'x-next-intl-locale': 'en',
        referer: 'https://treido.eu/en/page',
      })
      expect(inferLocaleFromRequest(req1, 'bg')).toBe('bg')

      // bodyLocale missing - header wins
      const req2 = makeRequest({
        'x-next-intl-locale': 'bg',
        referer: 'https://treido.eu/en/page',
      })
      expect(inferLocaleFromRequest(req2)).toBe('bg')

      // bodyLocale + header missing - referer wins
      const req3 = makeRequest({
        referer: 'https://treido.eu/bg/page',
      })
      expect(inferLocaleFromRequest(req3)).toBe('bg')
    })
  })

  describe('inferLocaleFromHeaders', () => {
    function makeHeaders(headers: Record<string, string>): { get: (name: string) => string | null } {
      return {
        get: (name: string) => headers[name.toLowerCase()] ?? null,
      }
    }

    it('uses x-next-intl-locale header first', () => {
      const headers = makeHeaders({
        'x-next-intl-locale': 'bg',
        referer: 'https://example.com/en/page',
      })
      expect(inferLocaleFromHeaders(headers)).toBe('bg')
    })

    it('normalizes invalid x-next-intl-locale header', () => {
      const headers = makeHeaders({ 'x-next-intl-locale': 'invalid' })
      expect(inferLocaleFromHeaders(headers)).toBe('en')
    })

    it('extracts locale from referer when header missing', () => {
      const headers = makeHeaders({ referer: 'https://treido.eu/bg/account' })
      expect(inferLocaleFromHeaders(headers)).toBe('bg')
    })

    it('ignores invalid referer URL', () => {
      const headers = makeHeaders({ referer: ':::invalid-url:::' })
      expect(inferLocaleFromHeaders(headers)).toBe('en')
    })

    it('extracts locale from origin when referer missing', () => {
      // Note: origin typically has no path, so this usually won't match
      // But if origin somehow includes a path, it should work
      const headers = makeHeaders({ origin: 'https://treido.eu/bg' })
      expect(inferLocaleFromHeaders(headers)).toBe('bg')
    })

    it('ignores invalid origin URL', () => {
      const headers = makeHeaders({ origin: 'not a url at all' })
      expect(inferLocaleFromHeaders(headers)).toBe('en')
    })

    it('defaults to en when no locale info available', () => {
      const headers = makeHeaders({})
      expect(inferLocaleFromHeaders(headers)).toBe('en')
    })

    it('defaults to en for origin without path', () => {
      // Standard origin header has no path - should fall through to default
      const headers = makeHeaders({ origin: 'https://treido.eu' })
      expect(inferLocaleFromHeaders(headers)).toBe('en')
    })

    it('priority order: x-next-intl-locale > referer > origin > default', () => {
      // All present - header wins
      const h1 = makeHeaders({
        'x-next-intl-locale': 'bg',
        referer: 'https://treido.eu/en/page',
        origin: 'https://treido.eu/en',
      })
      expect(inferLocaleFromHeaders(h1)).toBe('bg')

      // Header missing - referer wins
      const h2 = makeHeaders({
        referer: 'https://treido.eu/bg/page',
        origin: 'https://treido.eu/en',
      })
      expect(inferLocaleFromHeaders(h2)).toBe('bg')

      // Header + referer missing - origin path (if present)
      const h3 = makeHeaders({
        origin: 'https://treido.eu/bg',
      })
      expect(inferLocaleFromHeaders(h3)).toBe('bg')
    })

    it('handles empty strings gracefully', () => {
      const headers = makeHeaders({
        'x-next-intl-locale': '',
        referer: '',
        origin: '',
      })
      expect(inferLocaleFromHeaders(headers)).toBe('en')
    })
  })
})
