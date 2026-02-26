"use client"

import dynamic from "next/dynamic"
import { type ReactNode } from "react"
import { useIdleReady } from "@/hooks/use-idle-ready"

import { CartProvider } from "@/components/providers/cart-context"
import { WishlistProvider } from "@/components/providers/wishlist-context"
import { MessageProvider } from "@/components/providers/message-context"
import { DrawerProvider, useDrawer } from "@/components/providers/drawer-context"

const GlobalDrawers = dynamic(
  () => import("../_components/global-drawers").then((mod) => mod.GlobalDrawers),
  { ssr: false }
)

export function CommerceProviders({ children }: { children: ReactNode }) {
  const shouldMountGlobalDrawers = useIdleReady(1200)

  return (
    <CartProvider>
      <WishlistProvider>
        <DrawerProvider>
          <DeferredMessageProvider>
            {children}
            {shouldMountGlobalDrawers ? <GlobalDrawers /> : null}
          </DeferredMessageProvider>
        </DrawerProvider>
      </WishlistProvider>
    </CartProvider>
  )
}

function DeferredMessageProvider({ children }: { children: ReactNode }) {
  const { activeDrawer } = useDrawer()
  const shouldEnableMessages = activeDrawer === "messages" || activeDrawer === "account"

  return <MessageProvider enabled={shouldEnableMessages}>{children}</MessageProvider>
}
