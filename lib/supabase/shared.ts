const DEFAULT_SUPABASE_FETCH_TIMEOUT_MS = 8000

export function getPublicSupabaseEnvOptional(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return { url, anonKey }
}

export function getPublicSupabaseEnv(): { url: string; anonKey: string } {
  const env = getPublicSupabaseEnvOptional()
  if (!env) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  return env
}

function getSupabaseFetchTimeoutMs(): number {
  const parsed = Number.parseInt(process.env.SUPABASE_FETCH_TIMEOUT_MS ?? "8000", 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_SUPABASE_FETCH_TIMEOUT_MS
  return parsed
}

export function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController()
  const timeout = getSupabaseFetchTimeoutMs()

  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // If the caller already supplied a signal, mirror its abort into ours.
  const signal = init?.signal
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener("abort", () => controller.abort(), { once: true })
  }

  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeoutId))
}

/**
 * Fetch without timeout - safe for 'use cache' functions.
 * AbortController signals interfere with RSC streaming in Next.js cache layer.
 * Use this for createStaticClient() queries that run inside 'use cache'.
 */
export function fetchWithoutTimeout(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, init)
}

export function withAuthCookieDomain<TOptions extends Record<string, unknown> | undefined>(
  options: TOptions,
): TOptions {
  if (!options || typeof options !== "object") return options
  const domain = process.env.AUTH_COOKIE_DOMAIN

  // Only apply an explicit cookie domain in production. In local dev/E2E on
  // localhost, setting a non-local domain prevents the browser from sending
  // the auth cookies back, which breaks SSR-protected routes.
  if (!domain || process.env.NODE_ENV !== "production") return options

  return { ...options, domain }
}
