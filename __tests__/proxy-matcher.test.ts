import { describe, expect, test } from 'vitest'

import { config } from '@/proxy'

describe('middleware/proxy matcher', () => {
  test('includes app routes but excludes static and api routes', () => {
    const pattern = config.matcher?.[0]
    expect(typeof pattern).toBe('string')

    // Next.js matchers are evaluated from the start of the pathname.
    // Anchor the regex so we don't accidentally match a substring.
    const re = new RegExp(`^${pattern}$`)

    // should match real app routes
    expect(re.test('/en')).toBe(true)
    expect(re.test('/bg/categories')).toBe(true)

    // should exclude API routes
    expect(re.test('/api/health/env')).toBe(false)

    // should exclude Next.js internals
    expect(re.test('/_next/static/chunks/app.js')).toBe(false)
    expect(re.test('/_vercel/insights/script.js')).toBe(false)

    // should exclude common static files
    expect(re.test('/favicon.ico')).toBe(false)
    expect(re.test('/robots.txt')).toBe(false)
    expect(re.test('/sitemap.xml')).toBe(false)

    // should exclude common assets
    expect(re.test('/images/logo.png')).toBe(false)
    expect(re.test('/fonts/inter.woff2')).toBe(false)
  })
})
