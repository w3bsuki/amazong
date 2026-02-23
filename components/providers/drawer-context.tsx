"use client"

import * as React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { trackDrawerClose, trackDrawerOpen } from "@/components/providers/analytics-drawer"
import { getEnabledDrawers, isDrawerSystemEnabled } from "@/lib/feature-flags"
import type { ProductCardData } from "@/components/shared/product/card/types"

/** Product data passed to quick view drawer. */
export interface QuickViewProduct
  extends Pick<
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

export type DrawerName = "productQuickView" | "cart" | "messages" | "wishlist" | "account" | "auth"

interface AuthDrawerState {
  mode: AuthDrawerMode
  entrypoint: AuthDrawerEntrypoint | null
}

interface DrawerContextValue {
  activeDrawer: DrawerName | null
  quickViewProduct: QuickViewProduct | null
  authState: AuthDrawerState
  enabledDrawers: {
    productQuickView: boolean
    cart: boolean
    messages: boolean
    wishlist: boolean
    account: boolean
    auth: boolean
  }
  isDrawerSystemEnabled: boolean
  openDrawer: (
    name: DrawerName,
    options?: {
      product?: QuickViewProduct
      mode?: AuthDrawerMode
      entrypoint?: AuthDrawerEntrypoint
    }
  ) => void
  closeDrawer: () => void
  setAuthMode: (mode: AuthDrawerMode) => void
  openAccountAfterAuthClose: () => void
}

const DrawerContext = createContext<DrawerContextValue | null>(null)

const drawerAnalyticsType: Record<DrawerName, "product_quick_view" | "cart" | "messages" | "wishlist" | "account" | "auth"> = {
  productQuickView: "product_quick_view",
  cart: "cart",
  messages: "messages",
  wishlist: "wishlist",
  account: "account",
  auth: "auth",
}

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [activeDrawer, setActiveDrawer] = useState<DrawerName | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null)
  const [authState, setAuthState] = useState<AuthDrawerState>({
    mode: "login",
    entrypoint: null,
  })

  const [featureFlags, setFeatureFlags] = useState({
    isSystemEnabled: true,
    enabledDrawers: {
      productQuickView: true,
      cart: true,
      messages: true,
      wishlist: true,
      account: true,
      auth: true,
    },
  })

  useEffect(() => {
    setFeatureFlags({
      isSystemEnabled: isDrawerSystemEnabled(),
      enabledDrawers: getEnabledDrawers(),
    })
  }, [])

  const previousDrawerRef = useRef<DrawerName | null>(null)
  useEffect(() => {
    const previousDrawer = previousDrawerRef.current

    if (previousDrawer && previousDrawer !== activeDrawer) {
      trackDrawerClose({
        type: drawerAnalyticsType[previousDrawer],
        method: "button",
        ...(previousDrawer === "auth"
          ? { metadata: { mode: authState.mode, entrypoint: authState.entrypoint } }
          : {}),
      })
    }

    if (activeDrawer && activeDrawer !== previousDrawer) {
      if (activeDrawer === "productQuickView") {
        trackDrawerOpen(
          quickViewProduct?.id
            ? {
                type: drawerAnalyticsType[activeDrawer],
                productId: quickViewProduct.id,
              }
            : { type: drawerAnalyticsType[activeDrawer] }
        )
      } else if (activeDrawer === "auth") {
        trackDrawerOpen({
          type: drawerAnalyticsType[activeDrawer],
          metadata: { mode: authState.mode, entrypoint: authState.entrypoint },
        })
      } else {
        trackDrawerOpen({ type: drawerAnalyticsType[activeDrawer] })
      }
    }

    previousDrawerRef.current = activeDrawer
  }, [activeDrawer, authState.entrypoint, authState.mode, quickViewProduct?.id])

  const openDrawer = useCallback<DrawerContextValue["openDrawer"]>(
    (name, options) => {
      if (!featureFlags.isSystemEnabled) return
      if (!featureFlags.enabledDrawers[name]) return

      if (name === "productQuickView") {
        if (!options?.product) return
        const scrollY = typeof window !== "undefined" ? window.scrollY : undefined
        setQuickViewProduct({
          ...options.product,
          ...(options.product.sourceScrollY == null && scrollY != null ? { sourceScrollY: scrollY } : {}),
        })
      } else {
        setQuickViewProduct(null)
      }

      if (name === "auth") {
        setAuthState({
          mode: options?.mode ?? "login",
          entrypoint: options?.entrypoint ?? null,
        })
      }

      setActiveDrawer(name)
    },
    [featureFlags.enabledDrawers, featureFlags.isSystemEnabled]
  )

  const closeDrawer = useCallback(() => {
    if (activeDrawer === "productQuickView") {
      setQuickViewProduct(null)
    }
    if (activeDrawer === "auth") {
      setAuthState((previous) => ({ ...previous, entrypoint: null }))
    }
    setActiveDrawer(null)
  }, [activeDrawer])

  const setAuthMode = useCallback((mode: AuthDrawerMode) => {
    setAuthState((previous) => ({ ...previous, mode }))
  }, [])

  const openAccountAfterAuthClose = useCallback(() => {
    if (!featureFlags.enabledDrawers.account) {
      setActiveDrawer(null)
      return
    }
    setQuickViewProduct(null)
    setActiveDrawer("account")
  }, [featureFlags.enabledDrawers.account])

  const value = useMemo<DrawerContextValue>(
    () => ({
      activeDrawer,
      quickViewProduct,
      authState,
      enabledDrawers: featureFlags.enabledDrawers,
      isDrawerSystemEnabled: featureFlags.isSystemEnabled,
      openDrawer,
      closeDrawer,
      setAuthMode,
      openAccountAfterAuthClose,
    }),
    [
      activeDrawer,
      authState,
      featureFlags.enabledDrawers,
      featureFlags.isSystemEnabled,
      quickViewProduct,
      openDrawer,
      closeDrawer,
      setAuthMode,
      openAccountAfterAuthClose,
    ]
  )

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
}

export function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider")
  }
  return context
}
