"use client"

/**
 * Mobile Product Quick View Drawer
 *
 * MOBILE ONLY - Uses Vaul drawer for a native-feeling slide-up experience.
 * Desktop uses a client-side Dialog (no URL change).
 */

import * as React from "react"
import { useTranslations } from "next-intl"

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawer"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { ProductQuickViewContent } from "@/components/shared/product/quick-view/product-quick-view-content"
import { QuickViewSkeleton } from "@/components/shared/product/quick-view/quick-view-skeleton"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useProductQuickViewDetails } from "@/hooks/use-product-quick-view-details"
import { useQuickViewActions } from "@/hooks/use-quick-view-actions"

interface ProductQuickViewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: QuickViewProduct | null
  isLoading?: boolean
}

export function ProductQuickViewDrawer({
  open,
  onOpenChange,
  product,
  isLoading = false,
}: ProductQuickViewDrawerProps) {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return (
    <ProductQuickViewDrawerMobile
      open={open}
      onOpenChange={onOpenChange}
      product={product}
      isLoading={isLoading}
    />
  )
}

function ProductQuickViewDrawerMobile({
  open,
  onOpenChange,
  product,
  isLoading = false,
}: ProductQuickViewDrawerProps) {
  const t = useTranslations("Drawers")
  const scrollBeforeOpenRef = React.useRef<number | null>(null)
  const pendingRestoreScrollRef = React.useRef<number | null>(null)
  const openRef = React.useRef(open)
  const [displayProduct, setDisplayProduct] = React.useState<QuickViewProduct | null>(product)
  const { product: resolvedProduct, isLoading: detailsLoading } = useProductQuickViewDetails(open, product)

  React.useEffect(() => {
    openRef.current = open
  }, [open])

  React.useEffect(() => {
    if (resolvedProduct) {
      setDisplayProduct(resolvedProduct)
    }
  }, [resolvedProduct])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    if (open) {
      if (scrollBeforeOpenRef.current == null) {
        scrollBeforeOpenRef.current = product?.sourceScrollY ?? window.scrollY
      }
      if (product) {
        setDisplayProduct(product)
      }
      pendingRestoreScrollRef.current = null
      return
    }

    pendingRestoreScrollRef.current = scrollBeforeOpenRef.current
  }, [open, product])

  const handleDrawerAnimationEnd = React.useCallback((isDrawerOpen: boolean) => {
    // Ignore stale "close finished" callbacks if the drawer was reopened quickly.
    if (isDrawerOpen || typeof window === "undefined" || openRef.current) return

    const restoreY = pendingRestoreScrollRef.current
    if (restoreY != null) {
      window.scrollTo({ top: restoreY, behavior: "auto" })
    }

    pendingRestoreScrollRef.current = null
    scrollBeforeOpenRef.current = null
    setDisplayProduct(null)
  }, [])

  const activeProduct = resolvedProduct ?? displayProduct
  const { handleAddToCart, handleBuyNow, productPath, handleNavigateToProduct } =
    useQuickViewActions(activeProduct, onOpenChange)

  const description = activeProduct?.description || activeProduct?.title || ""

  const showOnlyBlockingSkeleton = isLoading || (open && !activeProduct && !product)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} onAnimationEnd={handleDrawerAnimationEnd}>
      <DrawerContent
        aria-label={t("quickView")}
        showHandle
        className="touch-pan-y max-h-dialog rounded-t-2xl"
        overlayBlur="none"
      >
        <DrawerDescription className="sr-only">{description}</DrawerDescription>
        <DrawerBody className="px-0 py-0">
          {showOnlyBlockingSkeleton ? (
            <QuickViewSkeleton />
          ) : activeProduct ? (
            <ProductQuickViewContent
              product={activeProduct}
              productPath={productPath}
              onRequestClose={() => onOpenChange(false)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onNavigateToProduct={handleNavigateToProduct}
              detailsLoading={detailsLoading}
              layout="mobile"
            />
          ) : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
