"use client"

import * as React from "react"
import { createContext, useContext, useCallback, useState, useMemo, useEffect } from "react"
import { trackDrawerOpen, trackDrawerClose } from "@/lib/analytics-drawer"
import { isDrawerSystemEnabled, getEnabledDrawers } from "@/lib/feature-flags"

// =============================================================================
// TYPES
// =============================================================================

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
  cart: {
    open: boolean
  }
  messages: {
    open: boolean
  }
  account: {
    open: boolean
  }
}

interface DrawerContextValue {
  state: DrawerState
  /** Feature flags - which drawers are enabled */
  enabledDrawers: {
    productQuickView: boolean
    cart: boolean
    messages: boolean
    account: boolean
  }
  /** Whether the drawer system is enabled at all */
  isDrawerSystemEnabled: boolean
  // Product quick view
  openProductQuickView: (product: QuickViewProduct) => void
  closeProductQuickView: () => void
  // Cart drawer
  openCart: () => void
  closeCart: () => void
  // Messages drawer
  openMessages: () => void
  closeMessages: () => void
  // Account drawer
  openAccount: () => void
  closeAccount: () => void
}

// =============================================================================
// CONTEXT
// =============================================================================

const DrawerContext = createContext<DrawerContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DrawerState>({
    productQuickView: { open: false, product: null },
    cart: { open: false },
    messages: { open: false },
    account: { open: false },
  })

  // Feature flags state (computed once on mount for consistency during session)
  const [featureFlags, setFeatureFlags] = useState({
    isSystemEnabled: true,
    enabledDrawers: {
      productQuickView: true,
      cart: true,
      messages: true,
      account: true,
    },
  })

  // Initialize feature flags on client-side
  useEffect(() => {
    setFeatureFlags({
      isSystemEnabled: isDrawerSystemEnabled(),
      enabledDrawers: getEnabledDrawers(),
    })
  }, [])

  // Product quick view actions
  const openProductQuickView = useCallback((product: QuickViewProduct) => {
    if (!featureFlags.enabledDrawers.productQuickView) return
    trackDrawerOpen({ type: "product_quick_view", productId: product.id })
    setState((prev) => ({
      ...prev,
      productQuickView: { open: true, product },
    }))
  }, [featureFlags.enabledDrawers.productQuickView])

  const closeProductQuickView = useCallback(() => {
    trackDrawerClose({ type: "product_quick_view", method: "button" })
    setState((prev) => ({
      ...prev,
      productQuickView: { open: false, product: null },
    }))
  }, [])

  // Cart actions
  const openCart = useCallback(() => {
    if (!featureFlags.enabledDrawers.cart) return
    trackDrawerOpen({ type: "cart" })
    setState((prev) => ({
      ...prev,
      cart: { open: true },
    }))
  }, [featureFlags.enabledDrawers.cart])

  const closeCart = useCallback(() => {
    trackDrawerClose({ type: "cart", method: "button" })
    setState((prev) => ({
      ...prev,
      cart: { open: false },
    }))
  }, [])

  // Messages actions
  const openMessages = useCallback(() => {
    if (!featureFlags.enabledDrawers.messages) return
    trackDrawerOpen({ type: "messages" })
    setState((prev) => ({
      ...prev,
      messages: { open: true },
    }))
  }, [featureFlags.enabledDrawers.messages])

  const closeMessages = useCallback(() => {
    trackDrawerClose({ type: "messages", method: "button" })
    setState((prev) => ({
      ...prev,
      messages: { open: false },
    }))
  }, [])

  // Account actions
  const openAccount = useCallback(() => {
    if (!featureFlags.enabledDrawers.account) return
    trackDrawerOpen({ type: "account" })
    setState((prev) => ({
      ...prev,
      account: { open: true },
    }))
  }, [featureFlags.enabledDrawers.account])

  const closeAccount = useCallback(() => {
    trackDrawerClose({ type: "account", method: "button" })
    setState((prev) => ({
      ...prev,
      account: { open: false },
    }))
  }, [])

  const value = useMemo<DrawerContextValue>(
    () => ({
      state,
      enabledDrawers: featureFlags.enabledDrawers,
      isDrawerSystemEnabled: featureFlags.isSystemEnabled,
      openProductQuickView,
      closeProductQuickView,
      openCart,
      closeCart,
      openMessages,
      closeMessages,
      openAccount,
      closeAccount,
    }),
    [
      state,
      featureFlags.enabledDrawers,
      featureFlags.isSystemEnabled,
      openProductQuickView,
      closeProductQuickView,
      openCart,
      closeCart,
      openMessages,
      closeMessages,
      openAccount,
      closeAccount,
    ]
  )

  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export function useDrawer(): DrawerContextValue {
  // In Storybook, use the mock context if available
  if (typeof window !== "undefined" && (window as any).__STORYBOOK_DRAWER_CONTEXT__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockContext = useContext((window as any).__STORYBOOK_DRAWER_CONTEXT__) as DrawerContextValue | undefined
    if (mockContext) return mockContext
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider")
  }
  return context
}
