"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { useCart } from "@/components/providers/cart-context"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

/**
 * Shared quick-view actions for both mobile drawer and desktop dialog.
 * Handles add-to-cart, buy-now, navigation — so each shell doesn't duplicate this.
 */
export function useQuickViewActions(
  product: QuickViewProduct | null,
  onOpenChange: (open: boolean) => void,
) {
  const router = useRouter()
  const { addToCart } = useCart()
  const tDrawers = useTranslations("Drawers")
  const tProduct = useTranslations("Product")

  const addProductToCart = React.useCallback(() => {
    if (!product) return
    const imgs = product.images?.length
      ? product.images
      : product.image
        ? [product.image]
        : []
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imgs[0] ?? PLACEHOLDER_IMAGE_PATH,
      quantity: 1,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(product.username ? { username: product.username } : {}),
    })
  }, [product, addToCart])

  const handleAddToCart = React.useCallback(() => {
    if (!product) return
    addProductToCart()
    toast.success(tDrawers("addedToCart"))
  }, [product, addProductToCart, tDrawers])

  const handleBuyNow = React.useCallback(() => {
    if (!product) return
    addProductToCart()
    toast.success(tProduct("addedToCart"))
    onOpenChange(false)
    router.push("/checkout")
  }, [product, addProductToCart, onOpenChange, router, tProduct])

  const productPath = React.useMemo(() => {
    if (!product) return "#"
    const { id, slug, username } = product
    const productSlug = slug ?? id
    return username ? `/${username}/${productSlug}` : "#"
  }, [product])

  const handleNavigateToProduct = React.useCallback(() => {
    onOpenChange(false)
    router.push(productPath)
  }, [onOpenChange, router, productPath])

  return { handleAddToCart, handleBuyNow, productPath, handleNavigateToProduct }
}
