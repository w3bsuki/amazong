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
import { useIsMobile } from "@/hooks/use-is-mobile"

/**
 * Global drawer container - renders all drawer instances.
 * Mount once at the app root (inside DrawerProvider).
 */
export function GlobalDrawers() {
  const isMobile = useIsMobile()
  const {
    activeDrawer,
    quickViewProduct,
    authState,
    closeDrawer,
    setAuthMode,
  } = useDrawer()

  return (
    <>
      {isMobile ? (
        <ProductQuickViewDrawer
          open={activeDrawer === "productQuickView"}
          onOpenChange={(open) => {
            if (!open && activeDrawer === "productQuickView") closeDrawer()
          }}
          product={quickViewProduct}
        />
      ) : (
        <ProductQuickViewDialog
          open={activeDrawer === "productQuickView"}
          onOpenChange={(open) => {
            if (!open && activeDrawer === "productQuickView") closeDrawer()
          }}
          product={quickViewProduct}
        />
      )}
      <CartDrawer
        open={activeDrawer === "cart"}
        onOpenChange={(open) => {
          if (!open && activeDrawer === "cart") closeDrawer()
        }}
      />
      <MessagesDrawer
        open={activeDrawer === "messages"}
        onOpenChange={(open) => {
          if (!open && activeDrawer === "messages") closeDrawer()
        }}
      />
      <WishlistDrawer
        open={activeDrawer === "wishlist"}
        onOpenChange={(open) => {
          if (!open && activeDrawer === "wishlist") closeDrawer()
        }}
      />
      <AccountDrawer
        open={activeDrawer === "account"}
        onOpenChange={(open) => {
          if (!open && activeDrawer === "account") closeDrawer()
        }}
      />
      <AuthDrawer
        open={activeDrawer === "auth"}
        mode={authState.mode}
        onOpenChange={(open) => {
          if (!open && activeDrawer === "auth") closeDrawer()
        }}
        onModeChange={setAuthMode}
      />
    </>
  )
}
