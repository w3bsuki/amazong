import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database.types"

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Creates a typed browser-side Supabase client.
 * 
 * @throws {Error} In production when environment variables are missing
 * @returns Singleton Supabase client instance
 */
export function createClient() {
  // Return cached instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // In production, fail fast - silent failures cause debugging nightmares
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "These must be configured in production."
      )
    }
    
    // In development, warn and return mock client for testing without Supabase
    console.warn(
      "[Supabase] Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Using mock client - Supabase features will not work."
    )
    
    // Return a mock client that won't crash but won't work either
    const mockQueryBuilder = {
      select: () => mockQueryBuilder,
      eq: () => mockQueryBuilder,
      neq: () => mockQueryBuilder,
      gt: () => mockQueryBuilder,
      gte: () => mockQueryBuilder,
      lt: () => mockQueryBuilder,
      lte: () => mockQueryBuilder,
      like: () => mockQueryBuilder,
      ilike: () => mockQueryBuilder,
      is: () => mockQueryBuilder,
      in: () => mockQueryBuilder,
      contains: () => mockQueryBuilder,
      containedBy: () => mockQueryBuilder,
      overlaps: () => mockQueryBuilder,
      textSearch: () => mockQueryBuilder,
      match: () => mockQueryBuilder,
      not: () => mockQueryBuilder,
      or: () => mockQueryBuilder,
      filter: () => mockQueryBuilder,
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      order: () => mockQueryBuilder,
      limit: () => mockQueryBuilder,
      range: () => mockQueryBuilder,
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: "Mock client - Supabase not configured" } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: "Mock client - Supabase not configured" } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        refreshSession: async () => ({ data: { user: null, session: null }, error: null }),
      },
      from: () => mockQueryBuilder,
      rpc: () => Promise.resolve({ data: null, error: null }),
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
        subscribe: () => ({ unsubscribe: () => {} }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: { message: "Mock client" } }),
          download: async () => ({ data: null, error: { message: "Mock client" } }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          remove: async () => ({ data: null, error: null }),
          list: async () => ({ data: [], error: null }),
        }),
      },
    } as unknown as ReturnType<typeof createBrowserClient<Database>>
  }

  supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}
