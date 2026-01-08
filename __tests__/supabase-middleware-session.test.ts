import { describe, expect, test } from 'vitest'

import { updateSession } from '@/lib/supabase/middleware'

function makeNextUrl(url: string) {
  const internal = new URL(url)

  return {
    clone() {
      return makeNextUrl(internal.toString())
    },
    get pathname() {
      return internal.pathname
    },
    set pathname(value: string) {
      internal.pathname = value
    },
    get search() {
      return internal.search
    },
    get searchParams() {
      return internal.searchParams
    },
    toString() {
      return internal.toString()
    },
  }
}

describe('supabase middleware updateSession', () => {
  test('redirects protected routes to locale-aware login when Supabase env missing', async () => {
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const prevAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Force the missing-env path (does not create a Supabase client)
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    try {
      const request = {
        nextUrl: makeNextUrl('http://localhost:3000/en/account'),
        cookies: {
          getAll: () => [],
          set: () => {},
          get: () => undefined,
        },
        headers: new Headers(),
      }

      const response = await updateSession(request as any)
      const location = response.headers.get('location')

      expect(response.status).toBeGreaterThanOrEqual(300)
      expect(location).toContain('/en/auth/login')
      expect(location).toContain('next=%2Fen%2Faccount')
    } finally {
      if (prevUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl
      else delete process.env.NEXT_PUBLIC_SUPABASE_URL

      if (prevAnon !== undefined) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = prevAnon
      else delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  })
})
