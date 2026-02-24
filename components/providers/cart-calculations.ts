import type { CartItem } from "./cart-types"
import { normalizePrice, normalizeQuantity } from "./cart-helpers"

export function calculateCartTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const quantity = normalizeQuantity(item.quantity) ?? 0
    return total + quantity
  }, 0)
}

export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = normalizePrice(item.price) ?? 0
    const quantity = normalizeQuantity(item.quantity) ?? 0
    return total + price * quantity
  }, 0)
}
