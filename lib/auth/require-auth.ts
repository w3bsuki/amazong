import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

/**
 * Standardized action result type for server actions.
 * All server actions should return this type for consistency.
 */
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

/**
 * Auth context returned by requireAuth.
 * Contains the authenticated user and configured Supabase client.
 */
export interface AuthContext {
  user: User
  supabase: SupabaseClient<Database>
}

/**
 * Auth failure result - use this pattern in server actions
 */
export const authFailure = (error: string = "Not authenticated"): ActionResult<never> => ({
  success: false,
  error,
})

/**
 * Require authentication for a server action.
 * 
 * SECURITY NOTE: Per Supabase docs, always use supabase.auth.getUser() to verify auth.
 * Never trust getSession() in server code as it doesn't validate the JWT.
 * 
 * @returns AuthContext if authenticated, null if not
 * 
 * @example
 * ```ts
 * export async function myServerAction() {
 *   const auth = await requireAuth()
 *   if (!auth) return authFailure()
 *   
 *   const { user, supabase } = auth
 *   // ... perform authenticated action
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthContext | null> {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return { user, supabase }
  } catch {
    return null
  }
}

/**
 * Require authentication and return a standardized result.
 * 
 * Alternative to requireAuth() that returns ActionResult directly,
 * useful when you want to return the error immediately.
 * 
 * @example
 * ```ts
 * export async function myServerAction(): Promise<ActionResult<MyData>> {
 *   const authResult = await requireAuthOrFail()
 *   if (!authResult.success) return authResult
 *   
 *   const { user, supabase } = authResult.data
 *   // ... perform authenticated action
 * }
 * ```
 */
export async function requireAuthOrFail(): Promise<
  | { success: true; data: AuthContext }
  | { success: false; error: string }
> {
  const auth = await requireAuth()
  
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }
  
  return { success: true, data: auth }
}

/**
 * Check if user is authenticated without creating an error response.
 * Useful for conditional logic where authentication is optional.
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  return requireAuth()
}

/**
 * Get just the user ID if authenticated.
 * Convenience function when you only need the user ID.
 */
export async function getAuthUserId(): Promise<string | null> {
  const auth = await requireAuth()
  return auth?.user.id ?? null
}
