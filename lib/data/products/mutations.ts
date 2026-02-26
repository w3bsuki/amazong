import "server-only"

import type { Database } from "@/lib/supabase/database.types"
import { toDbError, type DbClient, type DbError } from "./mutations.shared"

export { bulkDeleteProducts, bulkUpdateProductStatus, fetchProductsForBulkTitleValidation } from "./mutations.bulk"

export async function fetchSellerProfileUsername(params: {
  supabase: DbClient
  userId: string
}): Promise<
  | { ok: true; profile: { id: string; username: string | null } | null }
  | { ok: false; error: unknown }
> {
  const { supabase, userId } = params

  const { data, error } = await supabase.from("profiles").select("id,username").eq("id", userId).maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  if (!data) {
    return { ok: true, profile: null }
  }

  return { ok: true, profile: { id: data.id, username: data.username ?? null } }
}

export async function fetchProductForDuplicate(params: {
  supabase: DbClient
  productId: string
  sellerId: string
}): Promise<
  | {
      ok: true
      product: {
        title: string
        description: string | null
        price: number
        list_price: number | null
        stock: number
        track_inventory: boolean
        category_id: string | null
        weight: number | null
        weight_unit: string | null
        condition: string | null
        images: string[] | null
      } | null
    }
  | { ok: false; error: unknown }
> {
  const { supabase, productId, sellerId } = params

  const duplicateSelect =
    "title,description,price,list_price,stock,track_inventory,category_id,weight,weight_unit,condition,images" as const

  const { data, error } = await supabase
    .from("products")
    .select(duplicateSelect)
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  if (!data) {
    return { ok: true, product: null }
  }

  return {
    ok: true,
    product: {
      title: data.title,
      description: data.description ?? null,
      price: Number(data.price),
      list_price: data.list_price == null ? null : Number(data.list_price),
      stock: Number(data.stock ?? 0),
      track_inventory: data.track_inventory ?? true,
      category_id: data.category_id ?? null,
      weight: data.weight == null ? null : Number(data.weight),
      weight_unit: data.weight_unit ?? null,
      condition: data.condition ?? null,
      images: (data.images as string[] | null) ?? null,
    },
  }
}

export async function fetchProductPrivateForDuplicate(params: {
  supabase: DbClient
  productId: string
  sellerId: string
}): Promise<
  | { ok: true; private: { cost_price: number | null; sku: string | null } | null }
  | { ok: false; error: unknown }
> {
  const { supabase, productId, sellerId } = params

  const { data, error } = await supabase
    .from("product_private")
    .select("cost_price, sku")
    .eq("product_id", productId)
    .eq("seller_id", sellerId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return {
    ok: true,
    private: data
      ? {
          cost_price: data.cost_price == null ? null : Number(data.cost_price),
          sku: data.sku ?? null,
        }
      : null,
  }
}

export async function insertProductReturningId(params: {
  supabase: DbClient
  insert: Database["public"]["Tables"]["products"]["Insert"]
}): Promise<{ ok: true; id: string } | { ok: false; error: DbError }> {
  const { supabase, insert } = params

  const { data, error } = await supabase.from("products").insert(insert).select("id").maybeSingle()

  if (error || !data) {
    return { ok: false, error: toDbError(error ?? new Error("Insert failed")) }
  }

  return { ok: true, id: data.id }
}

export async function deleteProductById(params: {
  supabase: DbClient
  productId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, productId } = params

  const { error } = await supabase.from("products").delete().eq("id", productId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function insertProductPrivate(params: {
  supabase: DbClient
  insert: Database["public"]["Tables"]["product_private"]["Insert"]
}): Promise<{ ok: true } | { ok: false; error: DbError }> {
  const { supabase, insert } = params

  const { error } = await supabase.from("product_private").insert(insert)

  if (error) {
    return { ok: false, error: toDbError(error) }
  }

  return { ok: true }
}

export async function upsertProductPrivate(params: {
  supabase: DbClient
  upsert: Database["public"]["Tables"]["product_private"]["Insert"]
}): Promise<{ ok: true } | { ok: false; error: DbError }> {
  const { supabase, upsert } = params

  const { error } = await supabase.from("product_private").upsert(upsert, { onConflict: "product_id" })

  if (error) {
    return { ok: false, error: toDbError(error) }
  }

  return { ok: true }
}

export async function deleteProductAttributes(params: {
  supabase: DbClient
  productId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, productId } = params

  const { error } = await supabase.from("product_attributes").delete().eq("product_id", productId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function insertProductAttributes(params: {
  supabase: DbClient
  rows: Array<Database["public"]["Tables"]["product_attributes"]["Insert"]>
}): Promise<{ ok: true } | { ok: false; error: DbError }> {
  const { supabase, rows } = params

  if (rows.length === 0) {
    return { ok: true }
  }

  const { error } = await supabase.from("product_attributes").insert(rows)

  if (error) {
    return { ok: false, error: toDbError(error) }
  }

  return { ok: true }
}

export async function fetchExistingProductForUpdate(params: {
  supabase: DbClient
  productId: string
}): Promise<
  | {
      ok: true
      product: {
        id: string
        seller_id: string
        category_id: string | null
        title: string
        status: string | null
        price: number
        list_price: number | null
      } | null
    }
  | { ok: false; error: unknown }
> {
  const { supabase, productId } = params

  const { data, error } = await supabase
    .from("products")
    .select("id, seller_id, category_id, title, status, price, list_price")
    .eq("id", productId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  if (!data) {
    return { ok: true, product: null }
  }

  return {
    ok: true,
    product: {
      id: data.id,
      seller_id: data.seller_id,
      category_id: data.category_id ?? null,
      title: data.title,
      status: data.status ?? null,
      price: Number(data.price),
      list_price: data.list_price == null ? null : Number(data.list_price),
    },
  }
}

export async function updateProduct(params: {
  supabase: DbClient
  productId: string
  update: Database["public"]["Tables"]["products"]["Update"]
}): Promise<{ ok: true } | { ok: false; error: DbError }> {
  const { supabase, productId, update } = params

  const { error } = await supabase.from("products").update(update).eq("id", productId)

  if (error) {
    return { ok: false, error: toDbError(error) }
  }

  return { ok: true }
}
