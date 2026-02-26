import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function uploadFileToAvatarsBucket(params: {
  supabase: DbClient
  filePath: string
  file: File | Blob | ArrayBuffer | ArrayBufferView
  options: { upsert: boolean; contentType?: string; cacheControl?: string }
}): Promise<{ ok: true; publicUrl: string } | { ok: false; error: unknown }> {
  const { supabase, filePath, file, options } = params

  const { error } = await supabase.storage.from("avatars").upload(filePath, file, options)
  if (error) {
    return { ok: false, error }
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
  return { ok: true, publicUrl: data.publicUrl }
}

export async function removeAvatarFiles(params: {
  supabase: DbClient
  filePaths: string[]
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, filePaths } = params

  const { error } = await supabase.storage.from("avatars").remove(filePaths)
  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function updateProfileAvatarUrl(params: {
  supabase: DbClient
  userId: string
  avatarUrl: string
  updatedAt: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId, avatarUrl, updatedAt } = params

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl,
      updated_at: updatedAt,
    })
    .eq("id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function updateProfileBannerUrl(params: {
  supabase: DbClient
  userId: string
  bannerUrl: string
  updatedAt: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, userId, bannerUrl, updatedAt } = params

  const { error } = await supabase
    .from("profiles")
    .update({
      banner_url: bannerUrl,
      updated_at: updatedAt,
    })
    .eq("id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function getProfileAvatarAndUsername(params: {
  supabase: DbClient
  userId: string
}): Promise<{ avatarUrl: string | null; username: string | null } | null> {
  const { supabase, userId } = params

  const { data } = await supabase
    .from("profiles")
    .select("avatar_url, username")
    .eq("id", userId)
    .single()

  if (!data) return null

  return {
    avatarUrl: data.avatar_url ?? null,
    username: data.username ?? null,
  }
}

