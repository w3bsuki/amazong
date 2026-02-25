import 'client-only'

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"
import { getPublicSupabaseEnvOptional } from "@/lib/supabase/shared"

import { logger } from "@/lib/logger"
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Creates a typed browser-side Supabase client.
 *
 * @throws {Error} When required environment variables are missing
 * @returns Singleton Supabase client instance
 */
export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const env = getPublicSupabaseEnvOptional()
  if (!env) {
    logger.error(
      "[Supabase] Missing required NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      undefined,
      {
        NODE_ENV: process.env.NODE_ENV ?? "unknown",
      },
    )

    throw new Error(
      "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in your environment (and ensure they are exposed via NEXT_PUBLIC_*) before using the browser client."
    )
  }

  supabaseInstance = createBrowserClient<Database>(env.url, env.anonKey)
  return supabaseInstance
}

/**
 * Creates a non-singleton browser-side Supabase client.
 *
 * Use this when auth cookies may have changed server-side (e.g. server actions)
 * and you need to force a fresh cookie read for session synchronization.
 */
export function createFreshClient() {
  const env = getPublicSupabaseEnvOptional()
  if (!env) {
    logger.error(
      "[Supabase] Missing required NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      undefined,
      {
        NODE_ENV: process.env.NODE_ENV ?? "unknown",
      },
    )

    throw new Error(
      "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in your environment (and ensure they are exposed via NEXT_PUBLIC_*) before using the browser client."
    )
  }

  return createBrowserClient<Database>(env.url, env.anonKey, { isSingleton: false })
}
