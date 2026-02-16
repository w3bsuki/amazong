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
import { useIsMobile } from "@/hooks/use-is-mobile"
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
  const tProduct = useTranslations("Product")
  const router = useRouter()
  const { addToCart } = useCart()
  const { product: resolvedProduct, isLoading: detailsLoading } = useProductQuickViewDetails(open, product)

  const addResolvedProductToCart = React.useCallback(() => {
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
  }, [addToCart, resolvedProduct])

  const handleAddToCart = React.useCallback(() => {
    if (!resolvedProduct) return
    addResolvedProductToCart()
    toast.success(tDrawers("addedToCart"))
  }, [addResolvedProductToCart, resolvedProduct, tDrawers])

  const handleBuyNow = React.useCallback(() => {
    if (!resolvedProduct) return
    addResolvedProductToCart()
    toast.success(tProduct("addedToCart"))
    onOpenChange(false)
    router.push("/checkout")
  }, [addResolvedProductToCart, onOpenChange, resolvedProduct, router, tProduct])

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

