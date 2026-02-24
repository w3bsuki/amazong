import { describe, expect, it } from "vitest"

import {
  calculateCartSubtotal,
  calculateCartTotalItems,
} from "@/components/providers/cart-calculations"
import type { CartItem } from "@/components/providers/cart-types"

function item(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "p1",
    title: "Item",
    price: 10,
    image: "/placeholder.png",
    quantity: 1,
    ...overrides,
  }
}

describe("cart-calculations", () => {
  it("calculates total items across cart rows", () => {
    const total = calculateCartTotalItems([item({ quantity: 2 }), item({ id: "p2", quantity: 3 })])
    expect(total).toBe(5)
  })

  it("ignores invalid quantities in total items", () => {
    const total = calculateCartTotalItems([item({ quantity: 0 }), item({ id: "p2", quantity: -2 })])
    expect(total).toBe(0)
  })

  it("calculates subtotal using price * quantity", () => {
    const subtotal = calculateCartSubtotal([item({ price: 12, quantity: 2 }), item({ id: "p2", price: 5, quantity: 3 })])
    expect(subtotal).toBe(39)
  })

  it("ignores invalid price rows in subtotal", () => {
    const subtotal = calculateCartSubtotal([item({ price: -10, quantity: 2 }), item({ id: "p2", price: 5, quantity: 2 })])
    expect(subtotal).toBe(10)
  })
})
