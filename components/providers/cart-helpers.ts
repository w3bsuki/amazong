import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { safeJsonParseUnknown } from "@/lib/safe-json"

import type { CartItem } from "./cart-types"

export const MAX_CART_QUANTITY = 99

const CART_ALLOWED_REMOTE_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "cdn.simpleicons.org",
  "flagcdn.com",
  "upload.wikimedia.org",
  "placehold.co",
  "api.dicebear.com",
])
const CART_ALLOWED_REMOTE_IMAGE_HOST_SUFFIXES = [".supabase.co"] as const

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

function isAllowedCartRemoteImageHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase()
  if (CART_ALLOWED_REMOTE_IMAGE_HOSTS.has(normalized)) return true
  return CART_ALLOWED_REMOTE_IMAGE_HOST_SUFFIXES.some((suffix) => normalized.endsWith(suffix))
}

export function normalizeCartImageUrl(image: unknown): string {
  const normalized = normalizeImageUrl(asString(image))

  if (!/^https?:\/\//i.test(normalized)) {
    return normalized
  }

  try {
    const parsed = new URL(normalized)
    if (!isAllowedCartRemoteImageHost(parsed.hostname)) return PLACEHOLDER_IMAGE_PATH
    return normalized
  } catch {
    return PLACEHOLDER_IMAGE_PATH
  }
}

export function sanitizeCartItems(rawItems: readonly unknown[]): CartItem[] {
  const sanitized: CartItem[] = []
  for (const item of rawItems) {
    const record = toRecord(item)
    if (!record) continue

    const id = asString(record.id)
    const title = asString(record.title)
    if (!id || !title) continue

    const price = normalizePrice(record.price)
    const quantity = normalizeQuantity(record.quantity)
    if (price === null || quantity === null) continue

    const variantId = asString(record.variantId)
    const variantName = asString(record.variantName)
    const slug = asString(record.slug)

    const username = asString(record.username)
    const storeSlug = asString(record.storeSlug)
    const sellerSlugs = normalizeSellerSlugs({
      username: username ?? undefined,
      storeSlug: storeSlug ?? undefined,
    })
    sanitized.push({
      id,
      title,
      ...(variantId ? { variantId } : {}),
      ...(variantName ? { variantName } : {}),
      ...(slug ? { slug } : {}),
      ...sellerSlugs,
      image: normalizeCartImageUrl(record.image),
      price,
      quantity,
    })
  }
  return sanitized
}

export type CartStorageReadResult = {
  items: CartItem[]
  hadRawValue: boolean
  wasCorrupt: boolean
  wasSanitized: boolean
}

export function readCartFromStorage(): CartStorageReadResult {
  const raw = localStorage.getItem("cart")
  if (!raw) {
    return {
      items: [],
      hadRawValue: false,
      wasCorrupt: false,
      wasSanitized: false,
    }
  }

  const parsed = safeJsonParseUnknown(raw)
  if (!Array.isArray(parsed)) {
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

export function parseStoredCartItems(raw: string | null): CartItem[] {
  const parsed = safeJsonParseUnknown(raw)
  return sanitizeCartItems(Array.isArray(parsed) ? parsed : [])
}
