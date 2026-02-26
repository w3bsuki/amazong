import "server-only"

import { toDbError, type DbClient, type DbError } from "./mutations.shared"

export async function fetchProductsForBulkTitleValidation(params: {
  supabase: DbClient
  sellerId: string
  productIds: string[]
}): Promise<
  | { ok: true; rows: Array<{ id: string; title: string | null; status: string | null }> }
  | { ok: false; error: unknown }
> {
  const { supabase, sellerId, productIds } = params

  const { data, error } = await supabase
    .from("products")
    .select("id,title,status")
    .eq("seller_id", sellerId)
    .in("id", productIds)

  if (error) {
    return { ok: false, error }
  }

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title ?? null,
    status: row.status ?? null,
  }))

  return { ok: true, rows }
}

export async function bulkUpdateProductStatus(params: {
  supabase: DbClient
  sellerId: string
  productIds: string[]
  status: string
  updatedAt: string
}): Promise<{ ok: true; updatedIds: string[] } | { ok: false; error: DbError }> {
  const { supabase, sellerId, productIds, status, updatedAt } = params

  const { data, error } = await supabase
    .from("products")
    .update({ status, updated_at: updatedAt })
    .eq("seller_id", sellerId)
    .in("id", productIds)
    .select("id")

  if (error) {
    return { ok: false, error: toDbError(error) }
  }

  const updatedIds = (data ?? [])
    .map((row) => (row && typeof row.id === "string" ? row.id : null))
    .filter((id): id is string => typeof id === "string" && id.length > 0)

  return { ok: true, updatedIds }
}

export async function bulkDeleteProducts(params: {
  supabase: DbClient
  sellerId: string
  productIds: string[]
}): Promise<{ ok: true; deletedIds: string[] } | { ok: false; error: unknown }> {
  const { supabase, sellerId, productIds } = params

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("seller_id", sellerId)
    .in("id", productIds)
    .select("id")

  if (error) {
    return { ok: false, error }
  }

  const deletedIds = (data ?? [])
    .map((row) => (row && typeof row.id === "string" ? row.id : null))
    .filter((id): id is string => typeof id === "string" && id.length > 0)

  return { ok: true, deletedIds }
}

