import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { NextRequest } from "next/server"

type ProxyRequest = {
  nextUrl: { pathname: string }
  cookies: {
    get: (name: string) => { value: string } | undefined
  }
  headers: {
    get: (name: string) => string | null
  }
}

type ProxyCookieSetEntry = { name: string; value: string; options: unknown }

type ProxyResponse = {
  headers: Headers
  cookies: {
    set: (name: string, value: string, options: unknown) => void
  }
  __cookiesSet: ProxyCookieSetEntry[]
}

const mocks = vi.hoisted(() => {
  return {
    createMiddleware: vi.fn(),
    updateSession: vi.fn(async (_req: unknown, res: unknown) => res),
  }
})

vi.mock('next-intl/middleware', () => {
  return {
    default: mocks.createMiddleware,
  }
})

vi.mock('@/lib/supabase/middleware', () => {
  return {
    updateSession: mocks.updateSession,
  }
})

function makeRequest(input: {
  pathname: string
  cookies?: Record<string, string>
  headers?: Record<string, string>
}): ProxyRequest {
  const cookies = input.cookies ?? {}
  const headers = Object.fromEntries(
    Object.entries(input.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])
  )

  return {
    nextUrl: { pathname: input.pathname },
    cookies: {
      get(name: string) {
        const value = cookies[name]
        return value ? { value } : undefined
      },
    },
    headers: {
      get(name: string) {
        return headers[name.toLowerCase()] ?? null
      },
    },
  }
}

function makeResponse(): ProxyResponse {
  const headers = new Headers()
  const cookiesSet: ProxyCookieSetEntry[] = []

  return {
    headers,
    cookies: {
      set(name: string, value: string, options: unknown) {
        cookiesSet.push({ name, value, options })
      },
    },
    __cookiesSet: cookiesSet,
  }
}

describe('proxy middleware', () => {
  beforeEach(() => {
    vi.resetModules()
    mocks.createMiddleware.mockReset()
    mocks.updateSession.mockClear()
  })

  it('sets x-pathname and geo cookies when missing', async () => {
    const response = makeResponse()
    mocks.createMiddleware.mockImplementation(() => {
      return () => response
    })

    const { proxy } = await import('@/proxy')

    const req = makeRequest({
      pathname: '/bg',
      headers: { 'x-vercel-ip-country': 'BG' },
    })

    const res = (await proxy(req as unknown as NextRequest)) as ProxyResponse

    expect(res.headers.get('x-middleware-request-x-pathname')).toBe('/bg')
    expect(res.headers.get('x-middleware-override-headers')).toContain('x-pathname')

    const cookiesSet = res.__cookiesSet
    expect(cookiesSet.find((c) => c.name === 'user-country')?.value).toBe('BG')
    expect(cookiesSet.find((c) => c.name === 'user-zone')?.value).toBeTruthy()

    expect(mocks.updateSession).toHaveBeenCalledTimes(1)
  })

  it('normalizes UK to GB', async () => {
    const response = makeResponse()
    mocks.createMiddleware.mockImplementation(() => {
      return () => response
    })

    const { proxy } = await import('@/proxy')

    const req = makeRequest({
      pathname: '/en',
      headers: { 'x-vercel-ip-country': 'UK' },
    })

    const res = (await proxy(req as unknown as NextRequest)) as ProxyResponse
    const cookiesSet = res.__cookiesSet
    expect(cookiesSet.find((c) => c.name === 'user-country')?.value).toBe('GB')
  })

  it('does not overwrite existing country/zone cookies', async () => {
    const response = makeResponse()
    mocks.createMiddleware.mockImplementation(() => {
      return () => response
    })

    const { proxy } = await import('@/proxy')

    const req = makeRequest({
      pathname: '/bg',
      cookies: { 'user-country': 'US', 'user-zone': 'US' },
      headers: { 'x-vercel-ip-country': 'BG' },
    })

    const res = (await proxy(req as unknown as NextRequest)) as ProxyResponse
    const cookiesSet = res.__cookiesSet

    expect(cookiesSet.find((c) => c.name === 'user-country')).toBeUndefined()
    expect(cookiesSet.find((c) => c.name === 'user-zone')).toBeUndefined()
  })

  it('has matcher exclusions for next/api/assets', async () => {
    const { config } = await import('@/proxy')
    expect(Array.isArray(config.matcher)).toBe(true)
    expect(config.matcher[0]).toContain('api')
    expect(config.matcher[0]).toContain('_next')
    expect(config.matcher[0]).toContain('favicon')
  })
})
