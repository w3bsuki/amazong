import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

export type DbClient = SupabaseClient<Database>

export type DbError = { code?: string; message?: string }

export function toDbError(error: unknown): DbError {
  if (!error || typeof error !== "object") return {}
  const record = error as Record<string, unknown>
  const out: DbError = {}
  if (typeof record.code === "string") out.code = record.code
  if (typeof record.message === "string") out.message = record.message
  return out
}

