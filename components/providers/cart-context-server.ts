import { createClient } from "@/lib/supabase/client"
import { normalizeImageUrl } from "@/lib/normalize-image-url"
import { safeJsonParse } from "@/lib/safe-json"
import type { CartItem } from "./cart-context-types"
import {
  asString,
  asStringArray,
  normalizePrice,
  normalizeQuantity,
  toRecord,
  sanitizeCartItems,
} from "./cart-context-utils"

export async function fetchServerCart(activeUserId: string): Promise<CartItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      product_id,
      variant_id,
      quantity,
      products (
        title,
        price,
        images,
        slug,
        seller:profiles!products_seller_id_fkey(username)
      ),
      variant:product_variants!cart_items_variant_id_fkey(
        id,
        name
      )
    `)
    .eq("user_id", activeUserId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching server cart:", error)
    return []
  }

  const rows: unknown[] = Array.isArray(data) ? data : []
  return rows
    .map((row): CartItem | null => {
      const record = toRecord(row)
      const productId = asString(record?.product_id) ?? ""
      const variantId = asString(record?.variant_id) ?? undefined
      const quantity = normalizeQuantity(record?.quantity)

      const products = toRecord(record?.products)
      const title = asString(products?.title) ?? "Unknown Product"
      const price = normalizePrice(products?.price)

      const images = asStringArray(products?.images)
      const image = normalizeImageUrl(images?.[0] ?? null)
      const slug = asString(products?.slug)
      const seller = toRecord(products?.seller)
      const username = asString(seller?.username)

      const variant = toRecord(record?.variant)
      const variantName = asString(variant?.name) ?? undefined

      if (!productId || quantity === null || price === null) {
        return null
      }

      return {
        id: productId,
        ...(variantId ? { variantId } : {}),
        ...(variantName ? { variantName } : {}),
        title,
        price,
        image,
        quantity,
        ...(slug ? { slug } : {}),
        ...(username ? { username, storeSlug: username } : {}),
      }
    })
    .filter((item): item is CartItem => Boolean(item))
}

export async function syncLocalCartToServerStorage(): Promise<boolean> {
  const savedCart = localStorage.getItem("cart")
  const localItems = sanitizeCartItems(safeJsonParse<CartItem[]>(savedCart) || [])

  if (localItems.length === 0) {
    if (savedCart) localStorage.removeItem("cart")
    return true
  }

  if (savedCart) {
    localStorage.setItem("cart", JSON.stringify(localItems))
  }

  const supabase = createClient()

  for (const item of localItems) {
    const qty = normalizeQuantity(item.quantity)
    if (!item.id || qty === null) continue

    const { error } = await supabase.rpc("cart_add_item", {
      p_product_id: item.id,
      p_quantity: qty,
      ...(item.variantId ? { p_variant_id: item.variantId } : {}),
    })

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Cart sync skipped (RPC unavailable):", error.message || error.code || "unknown")
      }
      return false
    }
  }

  localStorage.removeItem("cart")
  return true
}

export async function addServerCartItem(item: CartItem): Promise<void> {
  const supabase = createClient()
  const qty = normalizeQuantity(item.quantity)
  if (!qty) return

  const { error } = await supabase.rpc("cart_add_item", {
    p_product_id: item.id,
    p_quantity: qty,
    ...(item.variantId ? { p_variant_id: item.variantId } : {}),
  })

  if (error) {
    console.error("Error adding to server cart:", error)
  }
}

export async function setServerCartQuantity(id: string, quantity: number, variantId?: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.rpc("cart_set_quantity", {
    p_product_id: id,
    p_quantity: quantity,
    ...(variantId ? { p_variant_id: variantId } : {}),
  })

  if (error) {
    console.error("Error updating server cart quantity:", error)
  }
}

export async function clearServerCart(): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.rpc("cart_clear")
  if (error) {
    console.error("Error clearing server cart:", error)
  }
}
