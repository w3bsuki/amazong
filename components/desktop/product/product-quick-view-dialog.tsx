"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { useCart } from "@/components/providers/cart-context"
import { ProductQuickViewContent } from "@/components/shared/product/quick-view/product-quick-view-content"
import { QuickViewSkeleton } from "@/components/shared/product/quick-view/quick-view-skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { useProductQuickViewDetails } from "@/hooks/use-product-quick-view-details"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

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
  const tDrawers = useTranslations("Drawers")
  const router = useRouter()
  const { addToCart } = useCart()
  const isMobile = useIsMobile()
  const { product: resolvedProduct } = useProductQuickViewDetails(open, product)

  const handleAddToCart = React.useCallback(() => {
    if (!resolvedProduct) return
    const imgs = resolvedProduct.images?.length
      ? resolvedProduct.images
      : resolvedProduct.image
        ? [resolvedProduct.image]
        : []
    addToCart({
      id: resolvedProduct.id,
      title: resolvedProduct.title,
      price: resolvedProduct.price,
      image: imgs[0] ?? PLACEHOLDER_IMAGE_PATH,
      quantity: 1,
      ...(resolvedProduct.slug ? { slug: resolvedProduct.slug } : {}),
      ...(resolvedProduct.username ? { username: resolvedProduct.username } : {}),
    })
    onOpenChange(false)
    toast.success(tDrawers("addedToCart"))
  }, [addToCart, resolvedProduct, onOpenChange, tDrawers])

  const handleBuyNow = React.useCallback(() => {
    handleAddToCart()
  }, [handleAddToCart])

  const productPath = React.useMemo(() => {
    if (!resolvedProduct) return "#"
    const { id, slug, username } = resolvedProduct
    const productSlug = slug ?? id
    return username ? `/${username}/${productSlug}` : "#"
  }, [resolvedProduct])

  const handleNavigateToProduct = React.useCallback(() => {
    onOpenChange(false)
    router.push(productPath)
  }, [onOpenChange, router, productPath])

  const title = resolvedProduct?.title ?? ""
  const description = resolvedProduct?.description ?? title

  if (isMobile) return null

  const showSkeleton = isLoading || (open && !resolvedProduct)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-(--width-dialog) max-w-(--width-modal-lg) sm:max-w-(--width-modal-lg) h-(--height-dialog) p-0 gap-0 flex flex-col overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title || tDrawers("quickView")}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <div className="flex-1 min-h-0 overflow-y-auto">
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
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

