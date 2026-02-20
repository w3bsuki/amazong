"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { ProductQuickViewContent } from "@/components/shared/product/quick-view/product-quick-view-content"
import { QuickViewSkeleton } from "@/components/shared/product/quick-view/quick-view-skeleton"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useProductQuickViewDetails } from "@/hooks/use-product-quick-view-details"
import { useQuickViewActions } from "@/hooks/use-quick-view-actions"

interface ProductQuickViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: QuickViewProduct | null
  isLoading?: boolean
}

export function ProductQuickViewDialog({
  open,
  onOpenChange,
  product,
  isLoading = false,
}: ProductQuickViewDialogProps) {
  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <ProductQuickViewDialogDesktop
      open={open}
      onOpenChange={onOpenChange}
      product={product}
      isLoading={isLoading}
    />
  )
}

function ProductQuickViewDialogDesktop({
  open,
  onOpenChange,
  product,
  isLoading = false,
}: ProductQuickViewDialogProps) {
  const tDrawers = useTranslations("Drawers")
  const { product: resolvedProduct, isLoading: detailsLoading } = useProductQuickViewDetails(open, product)
  const { handleAddToCart, handleBuyNow, productPath, handleNavigateToProduct } =
    useQuickViewActions(resolvedProduct, onOpenChange)

  const title = resolvedProduct?.title ?? ""
  const description = resolvedProduct?.description || title

  const showSkeleton = isLoading || (open && !resolvedProduct && !product)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="fullWidth"
        className="gap-0 flex flex-col overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title || tDrawers("quickView")}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {showSkeleton ? (
            <QuickViewSkeleton />
          ) : resolvedProduct ? (
            <ProductQuickViewContent
              product={resolvedProduct}
              productPath={productPath}
              onRequestClose={() => onOpenChange(false)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onNavigateToProduct={handleNavigateToProduct}
              detailsLoading={detailsLoading}
              layout="desktop"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

