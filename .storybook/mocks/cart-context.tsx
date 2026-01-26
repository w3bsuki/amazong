"use client"

import * as React from "react"

export interface CartItem {
  id: string
  variantId?: string
  variantName?: string
  title: string
  price: number
  image: string
  quantity: number
  slug?: string
  username?: string
  storeSlug?: string | null
}

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

const defaultCart: CartContextType = {
  items: [],
  isReady: true,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useCart(): CartContextType {
  return defaultCart
}

