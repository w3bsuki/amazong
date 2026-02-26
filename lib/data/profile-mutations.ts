import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function updateProfileFields(params: {
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

export async function updateProfileAndPrivateProfile(params: {
  supabase: DbClient
  userId: string
  profileUpdatePayload: Record<string, unknown>
  privateProfilePayload: Record<string, unknown> | null
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId, profileUpdatePayload, privateProfilePayload } = params

  const [{ error: updateError }, { error: privateError }] = await Promise.all([
    supabase.from("profiles").update(profileUpdatePayload).eq("id", userId),
    privateProfilePayload
      ? supabase
          .from("private_profiles")
          .upsert({ id: userId, ...privateProfilePayload }, { onConflict: "id" })
      : Promise.resolve({ error: null }),
  ])

  if (updateError || privateError) {
    return { ok: false, error: updateError ?? privateError }
  }

  return { ok: true }
}

export async function updateUserEmail(params: {
  supabase: DbClient
  email: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, email } = params

  const { error } = await supabase.auth.updateUser({ email })
  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function updateUserPasswordWithVerification(params: {
  supabase: DbClient
  email: string
  currentPassword: string
  newPassword: string
}): Promise<
  | { ok: true }
  | { ok: false; reason: "CURRENT_PASSWORD_INCORRECT" }
  | { ok: false; reason: "PASSWORD_UPDATE_FAILED"; error: unknown }
> {
  const { supabase, email, currentPassword, newPassword } = params

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  })

  if (signInError) {
    return { ok: false, reason: "CURRENT_PASSWORD_INCORRECT" }
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
  if (updateError) {
    return { ok: false, reason: "PASSWORD_UPDATE_FAILED", error: updateError }
  }

  return { ok: true }
}
