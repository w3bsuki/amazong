import type { SupabaseClient } from "@supabase/supabase-js"
import { revalidateTag } from "next/cache"

import type { Database } from "@/lib/supabase/database.types"

export type ProfileRevalidateProfile = "max" | "user" | "products"

function normalizeUsername(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 ? normalized : null
}

export function revalidatePublicProfileTagsByUsername(
  username: string | null | undefined,
  profile: ProfileRevalidateProfile = "max",
): void {
  const normalized = normalizeUsername(username)
  if (!normalized) return

  revalidateTag(`profile-${normalized}`, profile)
  revalidateTag(`profile-meta-${normalized}`, profile)
  revalidateTag(`seller-${normalized}`, profile)
}

export async function revalidatePublicProfileTagsForUser(
  supabase: SupabaseClient<Database>,
  userId: string,
  profile: ProfileRevalidateProfile = "max",
): Promise<string | null> {
  if (!userId) return null

  revalidateTag(`seller-${userId}`, profile)

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle()

  const username = normalizeUsername(profileRow?.username ?? null)
  if (username) {
    revalidatePublicProfileTagsByUsername(username, profile)
  }

  return username
}
