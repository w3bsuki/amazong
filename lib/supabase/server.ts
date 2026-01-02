import 'server-only'

import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/supabase/database.types"
import { fetchWithTimeout, getPublicSupabaseEnv, withAuthCookieDomain } from "@/lib/supabase/shared"

// =============================================================================
// Supabase Clients - Use the right one for your context
// =============================================================================
//
// createClient()       → For auth-dependent queries (uses cookies)
// createStaticClient() → For cached queries (anon key, no cookies)
// createAdminClient()  → For bypassing RLS (service role key)
//
// =============================================================================

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Auth-dependent client with cookies (for user-specific data) */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const { url, anonKey } = getPublicSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient<Database>(url, anonKey, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = withAuthCookieDomain(
              options && typeof options === "object" ? (options as Record<string, unknown>) : undefined,
            )

            if (cookieOptions) cookieStore.set(name, value, cookieOptions)
            else cookieStore.set(name, value)
          })
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
  const { url, anonKey } = getPublicSupabaseEnv()

  const pendingCookies: Array<{ name: string; value: string; options?: Record<string, unknown> }> = []

  const supabase = createServerClient<Database>(url, anonKey, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        pendingCookies.push(
          ...cookiesToSet.map(({ name, value, options }) => {
            const normalizedOptions =
              options && typeof options === "object" ? (options as Record<string, unknown>) : undefined

            return normalizedOptions ? { name, value, options: normalizedOptions } : { name, value }
          }),
        )
      },
    },
  })

  const applyCookies = <TBody>(response: NextResponse<TBody>) => {
    pendingCookies.forEach(({ name, value, options }) => {
      const cookieOptions = withAuthCookieDomain(options)
      if (cookieOptions) response.cookies.set(name, value, cookieOptions)
      else response.cookies.set(name, value)
    })
    return response
  }

  return { supabase, applyCookies }
}

/** Static client for cached queries (no cookies, safe for 'use cache') */
export function createStaticClient(): SupabaseClient<Database> {
  const { url, anonKey } = getPublicSupabaseEnv()
  return createSupabaseClient<Database>(url, anonKey, {
    global: { fetch: fetchWithTimeout },
  })
}

/** Admin client bypassing RLS (use only after auth verification) */
export function createAdminClient(): SupabaseClient<Database> {
  const { url } = getPublicSupabaseEnv()
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  }
  return createSupabaseClient<Database>(url, SUPABASE_SERVICE_KEY, {
    global: { fetch: fetchWithTimeout },
  })
}
