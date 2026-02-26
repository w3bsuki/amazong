import type { ReactNode } from "react"

import { CartProvider } from "@/components/providers/cart-context"

export function CartProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
