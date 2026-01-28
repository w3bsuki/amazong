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

import { X } from "lucide-react"

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
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

  const showSkeleton = isLoading || (open && !resolvedProduct)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-label={t("quickView")}
        showHandle
        className="touch-action-pan-y max-h-[85dvh] shadow-2xl"
        overlayBlur="sm"
      >
        {/* Clean header with subtle styling */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-border/30">
          <DrawerTitle className="text-sm font-semibold text-foreground truncate pr-2">
            {title || t("quickView")}
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 -mr-2 size-8 rounded-full hover:bg-muted touch-action-manipulation"
            >
              <X className="size-4" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </DrawerClose>
        </div>
        <DrawerDescription className="sr-only">{description}</DrawerDescription>
        <DrawerBody className="px-0 py-0 touch-action-pan-y overflow-hidden">
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
