import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
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
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from Server Component - middleware handles session refresh
        }
      },
    },
  })
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
