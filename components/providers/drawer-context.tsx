"use client"

import * as React from "react"
import { createContext, useContext, useCallback, useState, useMemo, useEffect } from "react"
import { trackDrawerOpen, trackDrawerClose } from "@/components/providers/_lib/analytics-drawer"
import { isDrawerSystemEnabled, getEnabledDrawers } from "@/lib/feature-flags"
import type { ProductCardData } from "@/components/shared/product/product-card.types"

// =============================================================================
// TYPES
// =============================================================================

/** Product data passed to quick view drawer. */
export interface QuickViewProduct extends Pick<
  ProductCardData,
  | "id"
  | "title"
  | "price"
  | "image"
  | "images"
  | "originalPrice"
  | "description"
  | "categoryPath"
  | "condition"
  | "location"
  | "freeShipping"
  | "rating"
  | "reviews"
  | "inStock"
  | "slug"
  | "username"
  | "sellerId"
  | "sellerName"
  | "sellerAvatarUrl"
  | "sellerVerified"
> {
  sourceScrollY?: number
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
    const scrollY = typeof window !== "undefined" ? window.scrollY : undefined
    trackDrawerOpen({ type: "product_quick_view", productId: product.id })
    setState((prev) => ({
      ...prev,
      productQuickView: {
        open: true,
        product: {
          ...product,
          ...(product.sourceScrollY == null && scrollY != null ? { sourceScrollY: scrollY } : {}),
        },
      },
    }))
  }, [featureFlags.enabledDrawers.productQuickView])

  const closeProductQuickView = useCallback(() => {
    const restoreY = state.productQuickView.product?.sourceScrollY
    if (typeof window !== "undefined" && restoreY != null) {
      ;[0, 120, 280, 520].forEach((delay) => {
        window.setTimeout(() => {
          window.scrollTo({ top: restoreY, behavior: "auto" })
        }, delay)
      })
    }
    trackDrawerClose({ type: "product_quick_view", method: "button" })
    setState((prev) => ({
      ...prev,
      productQuickView: { open: false, product: null },
    }))
  }, [state.productQuickView.product?.sourceScrollY])

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
  const storybookDrawerContext =
    typeof window !== "undefined"
      ? (window as unknown as { __STORYBOOK_DRAWER_CONTEXT__?: unknown }).__STORYBOOK_DRAWER_CONTEXT__
      : undefined

  if (storybookDrawerContext) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockContext = useContext(
      storybookDrawerContext as React.Context<DrawerContextValue | undefined>
    )
    if (mockContext) return mockContext
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider")
  }
  return context
}
