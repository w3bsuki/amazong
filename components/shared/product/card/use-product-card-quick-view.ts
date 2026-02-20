import * as React from "react"
import { useDrawer } from "@/components/providers/drawer-context"

import { buildQuickViewProduct } from "./metadata"

type QuickViewInput = Parameters<typeof buildQuickViewProduct>[0]

type UseProductCardQuickViewOptions = {
  disableQuickView?: boolean
  product: QuickViewInput
}

export function useProductCardQuickView({
  disableQuickView,
  product,
}: UseProductCardQuickViewOptions) {
  const { openDrawer, enabledDrawers, isDrawerSystemEnabled } = useDrawer()

  const shouldUseDrawerQuickView =
    isDrawerSystemEnabled && enabledDrawers.productQuickView && !disableQuickView

  return React.useCallback(
    (e: React.MouseEvent) => {
      if (!shouldUseDrawerQuickView) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      e.preventDefault()
      const quickViewData = buildQuickViewProduct(product)
      openDrawer("productQuickView", { product: quickViewData })
    },
    [openDrawer, product, shouldUseDrawerQuickView]
  )
}

