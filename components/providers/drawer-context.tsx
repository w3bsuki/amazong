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

export type AuthDrawerMode = "login" | "signup"
export type AuthDrawerEntrypoint =
  | "profile_tab"
  | "account_drawer"
  | "messages_drawer"
  | "cart_drawer"
  | "other"

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
  auth: {
    open: boolean
    mode: AuthDrawerMode
    entrypoint: AuthDrawerEntrypoint | null
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
    auth: boolean
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
  // Auth drawer
  openAuth: (options?: { mode?: AuthDrawerMode; entrypoint?: AuthDrawerEntrypoint }) => void
  setAuthMode: (mode: AuthDrawerMode) => void
  closeAuth: () => void
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
    auth: { open: false, mode: "login", entrypoint: null },
  })

  // Feature flags state (computed once on mount for consistency during session)
  const [featureFlags, setFeatureFlags] = useState({
    isSystemEnabled: true,
    enabledDrawers: {
      productQuickView: true,
      cart: true,
      messages: true,
      account: true,
      auth: true,
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
      auth: { ...prev.auth, open: false },
    }))
  }, [featureFlags.enabledDrawers.account])

  const closeAccount = useCallback(() => {
    trackDrawerClose({ type: "account", method: "button" })
    setState((prev) => ({
      ...prev,
      account: { open: false },
    }))
  }, [])

  // Auth actions
  const openAuth = useCallback(
    (options?: { mode?: AuthDrawerMode; entrypoint?: AuthDrawerEntrypoint }) => {
      if (!featureFlags.enabledDrawers.auth) return
      const mode = options?.mode ?? "login"
      const entrypoint = options?.entrypoint
      trackDrawerOpen({
        type: "auth",
        metadata: { mode, entrypoint },
      })
      setState((prev) => ({
        ...prev,
        account: { open: false },
        auth: {
          open: true,
          mode,
          entrypoint: entrypoint ?? null,
        },
      }))
    },
    [featureFlags.enabledDrawers.auth]
  )

  const setAuthMode = useCallback((mode: AuthDrawerMode) => {
    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        mode,
      },
    }))
  }, [])

  const closeAuth = useCallback(() => {
    setState((prev) => {
      if (!prev.auth.open) return prev
      trackDrawerClose({
        type: "auth",
        method: "button",
        metadata: { mode: prev.auth.mode, entrypoint: prev.auth.entrypoint },
      })
      return {
        ...prev,
        auth: {
          ...prev.auth,
          open: false,
        },
      }
    })
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
      openAuth,
      setAuthMode,
      closeAuth,
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
      openAuth,
      setAuthMode,
      closeAuth,
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
