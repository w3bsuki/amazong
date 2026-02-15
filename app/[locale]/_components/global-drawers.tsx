"use client"

import { useDrawer } from "@/components/providers/drawer-context"
import {
  ProductQuickViewDrawer,
  CartDrawer,
  MessagesDrawer,
  AccountDrawer,
  AuthDrawer,
} from "@/components/mobile/drawers"
import { WishlistDrawer } from "@/components/shared/wishlist/wishlist-drawer"
import { ProductQuickViewDialog } from "./drawers/product-quick-view-dialog"

/**
 * Global drawer container - renders all drawer instances.
 * Mount once at the app root (inside DrawerProvider).
 */
export function GlobalDrawers() {
  const {
    state,
    closeProductQuickView,
    closeCart,
    closeMessages,
    closeWishlist,
    closeAccount,
    closeAuth,
    setAuthMode,
  } = useDrawer()

  return (
    <>
      <ProductQuickViewDrawer
        open={state.productQuickView.open}
        onOpenChange={(open) => {
          if (!open) closeProductQuickView()
        }}
        product={state.productQuickView.product}
      />
      <ProductQuickViewDialog
        open={state.productQuickView.open}
        onOpenChange={(open) => {
          if (!open) closeProductQuickView()
        }}
        product={state.productQuickView.product}
      />
      <CartDrawer
        open={state.cart.open}
        onOpenChange={(open) => {
          if (!open) closeCart()
        }}
      />
      <MessagesDrawer
        open={state.messages.open}
        onOpenChange={(open) => {
          if (!open) closeMessages()
        }}
      />
      <WishlistDrawer
        open={state.wishlist.open}
        onOpenChange={(open) => {
          if (!open) closeWishlist()
        }}
      />
      <AccountDrawer
        open={state.account.open}
        onOpenChange={(open) => {
          if (!open) closeAccount()
        }}
      />
      <AuthDrawer
        open={state.auth.open}
        mode={state.auth.mode}
        onOpenChange={(open) => {
          if (!open) closeAuth()
        }}
        onModeChange={setAuthMode}
      />
    </>
  )
}
