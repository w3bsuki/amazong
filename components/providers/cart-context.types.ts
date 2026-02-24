import type { CartItem } from "./cart-types"

export interface CartContextType {
  items: CartItem[]
  isReady: boolean
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, variantId?: string) => void
  updateQuantity: (id: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}
