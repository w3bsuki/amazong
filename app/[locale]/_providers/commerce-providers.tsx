"use client"

import { Suspense, type ReactNode } from "react"

import { AuthStateManager } from "@/components/providers/auth-state-manager"
import { CartProvider } from "@/components/providers/cart-context"
import { WishlistProvider } from "@/components/providers/wishlist-context"
import { MessageProvider } from "@/components/providers/message-context"
import { CurrencyProvider } from "@/components/providers/currency-context"
import { DrawerProvider } from "@/components/providers/drawer-context"
import { GlobalDrawers } from "../_components/global-drawers"

export function CommerceProviders({ children }: { children: ReactNode }) {
  return (
    <AuthStateManager>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <DrawerProvider>
              <MessageProvider>
                {children}
                <Suspense fallback={null}>
                  <GlobalDrawers />
                </Suspense>
              </MessageProvider>
            </DrawerProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthStateManager>
  )
}
