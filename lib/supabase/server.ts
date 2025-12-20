import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"
import type { Database } from "./database.types"

// =============================================================================
// Supabase Clients - Use the right one for your context
// =============================================================================
//
// createClient()       → For auth-dependent queries (uses cookies)
// createStaticClient() → For cached queries (anon key, no cookies)
// createAdminClient()  → For bypassing RLS (service role key)
//
// =============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const AUTH_COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN

function withAuthCookieDomain(options: unknown): unknown {
  if (!AUTH_COOKIE_DOMAIN || !options || typeof options !== 'object') return options
  return { ...(options as Record<string, unknown>), domain: AUTH_COOKIE_DOMAIN }
}

function assertEnvVars() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
}

/** Auth-dependent client with cookies (for user-specific data) */
export async function createClient() {
  assertEnvVars()
  const cookieStore = await cookies()

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, withAuthCookieDomain(options) as any)
          )
        } catch {
          // Called from Server Component - middleware handles session refresh
        }
      },
    },
  })
}

/**
 * Route Handler client (app/api/*) that reads cookies from the incoming request.
 *
 * IMPORTANT: In Cache Components mode, `next/headers`'s `cookies()` can reject during prerender.
 * Route handlers should not rely on it; use request cookies instead.
 */
export function createRouteHandlerClient(request: NextRequest) {
  assertEnvVars()

  const pendingCookies: Array<{ name: string; value: string; options?: unknown }> = []

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        pendingCookies.push(...cookiesToSet)
      },
    },
  })

  const applyCookies = <TBody>(response: NextResponse<TBody>) => {
    pendingCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, withAuthCookieDomain(options) as any))
    return response
  }

  return { supabase, applyCookies }
}

/** Static client for cached queries (no cookies, safe for 'use cache') */
export function createStaticClient() {
  assertEnvVars()
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/** Admin client bypassing RLS (use only after auth verification) */
export function createAdminClient() {
  assertEnvVars()
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  }
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)
}
