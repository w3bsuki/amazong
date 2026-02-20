import { requireAuth } from "@/lib/auth/require-auth"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { createUsernameSchema } from "@/lib/validation/username"
import { z } from "zod"

export { RESERVED_USERNAMES } from "@/lib/validation/username"

export const usernameSchema = createUsernameSchema({
  min: "Username must be at least 3 characters",
  max: "Username must be less than 30 characters",
  start: "Username must start with a letter or number",
  charset: "Username can only contain lowercase letters, numbers, and underscores",
  noConsecutiveUnderscores: "Username cannot have consecutive underscores",
  noTrailingUnderscore: "Username cannot end with an underscore",
})

export const publicProfileSchema = z.object({
  display_name: z.string().max(50, "Display name must be less than 50 characters").optional().nullable(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  location: z.string().max(100, "Location must be less than 100 characters").optional().nullable(),
  website_url: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  social_links: z
    .object({
      facebook: z.string().optional().nullable(),
      instagram: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      tiktok: z.string().optional().nullable(),
      youtube: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})

export const businessUpgradeSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters").max(100),
  vat_number: z.string().optional().nullable(),
  business_address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      postal_code: z.string().optional(),
      country: z.string().optional(),
    })
    .optional()
    .nullable(),
  website_url: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  change_username: z.boolean().optional(),
  new_username: z.string().optional(),
})

export function normalizeUsername(username: string): string {
  return username.toLowerCase().trim()
}

export async function requireUsernameAuth(
  errorMessage = "Not authenticated"
): Promise<
  | { userId: string; supabase: SupabaseClient<Database> }
  | { error: string }
> {
  const auth = await requireAuth()
  if (!auth) {
    return { error: errorMessage }
  }

  return {
    userId: auth.user.id,
    supabase: auth.supabase,
  }
}
