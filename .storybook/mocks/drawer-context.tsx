"use client"

import * as React from "react"

/** Product data passed to quick view drawer (reuses ProductCard props) */
export interface QuickViewProduct {
  id: string
  title: string
  price: number
  image: string
  images?: string[]
  originalPrice?: number | null
  description?: string | null
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }>
  condition?: string | null
  location?: string | null
  freeShipping?: boolean
  rating?: number
  reviews?: number
  inStock?: boolean
  slug?: string | null
  username?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
}

interface DrawerState {
  productQuickView: {
    open: boolean
    product: QuickViewProduct | null
  }
  cart: { open: boolean }
  messages: { open: boolean }
  account: { open: boolean }
}

interface DrawerContextValue {
  state: DrawerState
  enabledDrawers: {
    productQuickView: boolean
    cart: boolean
    messages: boolean
    account: boolean
  }
  isDrawerSystemEnabled: boolean
  openProductQuickView: (product: QuickViewProduct) => void
  closeProductQuickView: () => void
  openCart: () => void
  closeCart: () => void
  openMessages: () => void
  closeMessages: () => void
  openAccount: () => void
  closeAccount: () => void
}

const defaultValue: DrawerContextValue = {
  state: {
    productQuickView: { open: false, product: null },
    cart: { open: false },
    messages: { open: false },
    account: { open: false },
  },
  enabledDrawers: {
    productQuickView: false,
    cart: false,
    messages: false,
    account: false,
  },
  isDrawerSystemEnabled: false,
  openProductQuickView: () => {},
  closeProductQuickView: () => {},
  openCart: () => {},
  closeCart: () => {},
  openMessages: () => {},
  closeMessages: () => {},
  openAccount: () => {},
  closeAccount: () => {},
}

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useDrawer(): DrawerContextValue {
  return defaultValue
}

