import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { createStaticClient } from "@/lib/supabase/server"

type DbClient = SupabaseClient<Database>

export type PublicProfileRow = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  account_type: string | null
  is_seller: boolean | null
  is_verified_business: boolean | null
  verified: boolean | null
  location: string | null
  business_name: string | null
  website_url: string | null
  social_links: unknown
  created_at: string
}

export async function fetchPublicProfileByUsername(username: string): Promise<PublicProfileRow | null> {
  const supabase = createStaticClient()

  const { data } = await supabase
    .from("profiles")
    .select(
      `
        id,
        username,
        display_name,
        avatar_url,
        banner_url,
        bio,
        account_type,
        is_seller,
        is_verified_business,
        verified,
        location,
        business_name,
        website_url,
        social_links,
        created_at
      `
    )
    .ilike("username", username)
    .single()

  return data ?? null
}

export async function fetchUsernameByUserId(params: {
  supabase: DbClient
  userId: string
}): Promise<string | null> {
  const { supabase, userId } = params

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle()

  return data?.username ?? null
}

export async function fetchCurrentUserProfile(params: {
  supabase: DbClient
  userId: string
}): Promise<Record<string, unknown> | null> {
  const { supabase, userId } = params

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      [
        "id",
        "username",
        "display_name",
        "avatar_url",
        "banner_url",
        "bio",
        "account_type",
        "is_seller",
        "is_verified_business",
        "verified",
        "location",
        "business_name",
        "website_url",
        "social_links",
        "created_at",
        "last_username_change",
        "tier",
      ].join(",")
    )
    .eq("id", userId)
    .single()

  if (!profile) return null

  const { data: privateProfile } = await supabase
    .from("private_profiles")
    .select("vat_number")
    .eq("id", userId)
    .maybeSingle()

  const baseProfile = profile && typeof profile === "object" ? profile : {}

  return {
    ...(baseProfile as Record<string, unknown>),
    vat_number: privateProfile?.vat_number ?? null,
  }
}
