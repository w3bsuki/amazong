import type { CartItem } from "@/components/providers/cart-context"

export type SellerInfo = {
  sellerId: string
  stripeAccountId: string | null
  chargesEnabled: boolean
}

const MAX_CHECKOUT_QUANTITY = 99

export function isValidQuantity(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= MAX_CHECKOUT_QUANTITY
  )
}

export function hasValidCartItems(items: CartItem[]): boolean {
  if (!items || items.length === 0) {
    return false
  }

  return items.every(
    (item) =>
      Boolean(item.id) &&
      Boolean(item.title) &&
      typeof item.price === "number" &&
      Number.isFinite(item.price) &&
      item.price > 0 &&
      isValidQuantity(item.quantity)
  )
}

export type SessionItem = {
  id: string
  variantId?: string | null
  qty: number
  price: number
}

export function parseSessionItemsJson(itemsJson: string | undefined): SessionItem[] | null {
  if (!itemsJson) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(itemsJson) as unknown
  } catch {
    return null
  }

  if (!Array.isArray(parsed) || parsed.length === 0) return null

  const items: SessionItem[] = []

  for (const rawItem of parsed) {
    if (!rawItem || typeof rawItem !== "object") return null
    const record = rawItem as Record<string, unknown>

    const id = typeof record.id === "string" ? record.id : ""
    const qty = typeof record.qty === "number" ? record.qty : Number.NaN
    const price = typeof record.price === "number" ? record.price : Number.NaN

    const variantIdRaw = record.variantId
    const variantId = typeof variantIdRaw === "string" ? variantIdRaw : null

    if (!id) return null
    if (!isValidQuantity(qty)) return null
    if (!Number.isFinite(price) || price <= 0) return null

    items.push({ id, variantId, qty, price })
  }

  return items
}
