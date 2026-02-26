import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { createStaticClient } from "@/lib/supabase/server"
import { fetchUsernameByUserId } from "@/lib/data/profile"

type DbClient = SupabaseClient<Database>

export async function getOnboardingProfileSnapshot(userId: string): Promise<{
  username: string | null
  displayName: string | null
  onboardingCompleted: boolean
} | null> {
  const supabase = createStaticClient()

  const { data } = await supabase
    .from("profiles")
    .select("username, display_name, onboarding_completed")
    .eq("id", userId)
    .single()

  if (!data) return null

  return {
    username: data.username ?? null,
    displayName: data.display_name ?? null,
    onboardingCompleted: Boolean(data.onboarding_completed),
  }
}

export async function getUsernameForUser(params: {
  supabase: DbClient
  userId: string
}): Promise<string | null> {
  return fetchUsernameByUserId(params)
}

export async function updateOnboardingProfile(params: {
  supabase: DbClient
  userId: string
  updateData: Record<string, unknown>
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId, updateData } = params

  const { error } = await supabase.from("profiles").update(updateData).eq("id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}
