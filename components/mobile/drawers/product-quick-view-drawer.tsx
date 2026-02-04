"use client"

/**
 * Mobile Product Quick View Drawer
 *
 * MOBILE ONLY - Uses Vaul drawer for a native-feeling slide-up experience.
 * Desktop uses a client-side Dialog (no URL change).
 */

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawer"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { useCart } from "@/components/providers/cart-context"
import { ProductQuickViewContent } from "@/components/shared/product/quick-view/product-quick-view-content"
import { QuickViewSkeleton } from "@/components/shared/product/quick-view/quick-view-skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { useProductQuickViewDetails } from "@/hooks/use-product-quick-view-details"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

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
  const t = useTranslations("Drawers")
  const router = useRouter()
  const { addToCart } = useCart()
  const isMobile = useIsMobile()
  const { product: resolvedProduct, isLoading: detailsLoading } = useProductQuickViewDetails(open, product)

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
    toast.success(t("addedToCart"))
  }, [addToCart, resolvedProduct, onOpenChange, t])

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

  // This drawer is MOBILE ONLY (desktop uses Dialog)
  if (!isMobile) {
    return null
  }

  const showSkeleton = isLoading || detailsLoading || (open && !resolvedProduct)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-label={t("quickView")}
        showHandle
        className="touch-pan-y"
        overlayBlur="sm"
      >
        <DrawerDescription className="sr-only">{description}</DrawerDescription>
        <DrawerBody className="px-0 py-0">
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
