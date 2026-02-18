import { safeJsonParse } from "@/lib/safe-json"
import { normalizeImageUrl } from "@/lib/normalize-image-url"
import type { CartItem } from "./cart-context-types"

export const MAX_CART_QUANTITY = 99

export function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null
}

export function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

export function asNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const out: string[] = []
  for (const item of value) {
    if (typeof item !== "string") return null
    out.push(item)
  }
  return out
}

export function normalizeQuantity(value: unknown): number | null {
  const numeric = asNumber(value)
  if (numeric === null) return null
  const rounded = Math.floor(numeric)
  if (!Number.isSafeInteger(rounded) || rounded <= 0) return null
  return Math.min(rounded, MAX_CART_QUANTITY)
}

export function normalizePrice(value: unknown): number | null {
  const numeric = asNumber(value)
  if (numeric === null || numeric < 0) return null
  return numeric
}

export function normalizeSellerSlugs(item: {
  username?: string | undefined
  storeSlug?: string | null | undefined
}): Pick<CartItem, "username" | "storeSlug"> {
  const username = item.username ?? (item.storeSlug || undefined)
  const storeSlug = item.storeSlug || item.username || undefined

  return {
    ...(username ? { username } : {}),
    ...(storeSlug ? { storeSlug } : {}),
  }
}

export function sanitizeCartItems(rawItems: CartItem[]): CartItem[] {
  const sanitized: CartItem[] = []
  for (const item of rawItems) {
    if (!item?.id) continue
    const price = normalizePrice(item.price)
    const quantity = normalizeQuantity(item.quantity)
    if (price === null || quantity === null) continue
    const sellerSlugs = normalizeSellerSlugs({
      username: item.username,
      storeSlug: item.storeSlug ?? null,
    })
    sanitized.push({
      ...item,
      ...sellerSlugs,
      image: normalizeImageUrl(item.image),
      price,
      quantity,
    })
  }
  return sanitized
}

export function readCartFromStorage(): {
  items: CartItem[]
  hadRawValue: boolean
  wasCorrupt: boolean
  wasSanitized: boolean
} {
  const raw = localStorage.getItem("cart")
  if (!raw) {
    return {
      items: [],
      hadRawValue: false,
      wasCorrupt: false,
      wasSanitized: false,
    }
  }

  const parsed = safeJsonParse<CartItem[]>(raw)
  if (!parsed) {
    return {
      items: [],
      hadRawValue: true,
      wasCorrupt: true,
      wasSanitized: false,
    }
  }

  const sanitized = sanitizeCartItems(parsed)
  return {
    items: sanitized,
    hadRawValue: true,
    wasCorrupt: false,
    wasSanitized: sanitized.length !== parsed.length,
  }
}
