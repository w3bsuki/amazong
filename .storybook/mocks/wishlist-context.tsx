"use client"

import * as React from "react"

export interface WishlistItem {
  id: string
  product_id: string
  title: string
  price: number
  image: string
  created_at: string
  slug?: string
  username?: string
}

export interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  isInWishlist: (productId: string) => boolean
  addToWishlist: (product: { id: string; title: string; price: number; image: string }) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  toggleWishlist: (product: { id: string; title: string; price: number; image: string }) => Promise<void>
  refreshWishlist: () => Promise<void>
  totalItems: number
}

const defaultWishlist: WishlistContextType = {
  items: [],
  isLoading: false,
  isInWishlist: () => false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  toggleWishlist: async () => {},
  refreshWishlist: async () => {},
  totalItems: 0,
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useWishlist(): WishlistContextType {
  return defaultWishlist
}

