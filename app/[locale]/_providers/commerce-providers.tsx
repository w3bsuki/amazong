"use client"

import dynamic from "next/dynamic"
import { Suspense, type ReactNode, useEffect, useState } from "react"

import { AuthStateManager } from "@/components/providers/auth-state-manager"
import { CartProvider } from "@/components/providers/cart-context"
import { WishlistProvider } from "@/components/providers/wishlist-context"
import { MessageProvider } from "@/components/providers/message-context"
import { CurrencyProvider } from "@/components/providers/currency-context"
import { DrawerProvider, useDrawer } from "@/components/providers/drawer-context"

const GlobalDrawers = dynamic(
  () => import("../_components/global-drawers").then((mod) => mod.GlobalDrawers),
  { ssr: false }
)

function useIdleReady(timeoutMs: number) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const markReady = () => {
      if (!cancelled) setReady(true)
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(markReady, { timeout: timeoutMs })
      return () => {
        cancelled = true
        idleWindow.cancelIdleCallback?.(id)
      }
    }

    const timer = window.setTimeout(markReady, timeoutMs)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [timeoutMs])

  return ready
}

export function CommerceProviders({ children }: { children: ReactNode }) {
  const shouldMountGlobalDrawers = useIdleReady(1200)

  return (
    <AuthStateManager>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <DrawerProvider>
              <DeferredMessageProvider>
                {children}
                {shouldMountGlobalDrawers ? (
                  <Suspense fallback={null}>
                    <GlobalDrawers />
                  </Suspense>
                ) : null}
              </DeferredMessageProvider>
            </DrawerProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthStateManager>
  )
}

function DeferredMessageProvider({ children }: { children: ReactNode }) {
  const { state } = useDrawer()
  const shouldEnableMessages = state.messages.open || state.account.open

  return <MessageProvider enabled={shouldEnableMessages}>{children}</MessageProvider>
}
