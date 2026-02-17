import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { getConditionKey } from "@/components/shared/product/_lib/condition"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { formatPrice, getDiscountPercentage, hasDiscount as checkHasDiscount } from "@/lib/format-price"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

import { ProductQuickViewDesktopContent } from "./product-quick-view-desktop-content"
import { ProductQuickViewMobileContent } from "./product-quick-view-mobile-content"

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const el = document.createElement("textarea")
  el.value = text
  el.setAttribute("readonly", "")
  el.style.position = "fixed"
  el.style.left = "-9999px"
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

export interface ProductQuickViewContentProps {
  product: QuickViewProduct
  productPath: string
  onRequestClose?: () => void
  onAddToCart: () => void
  onBuyNow: () => void
  onNavigateToProduct: () => void
  detailsLoading?: boolean
  layout?: "mobile" | "desktop"
}

export interface ProductQuickViewViewProps {
  product: QuickViewProduct
  productPath: string
  onRequestClose?: () => void
  onAddToCart: () => void
  onBuyNow: () => void
  onNavigateToProduct: () => void
  detailsLoading: boolean
  titleText: string
  descriptionPreview: string | null
  allImages: string[]
  primaryImage: string
  showDiscount: boolean
  discountPercent: number
  formattedPrice: string
  formattedOriginalPrice: string | null
  conditionLabel: string | null
  inWishlist: boolean
  wishlistPending: boolean
  shareEnabled: boolean
  showSellerSkeleton: boolean
  showLocationSkeleton: boolean
  showConditionSkeleton: boolean
  onCopyLink: () => void
  onToggleWishlist: () => void
}

export function ProductQuickViewContent({
  product,
  productPath,
  onRequestClose,
  onAddToCart,
  onBuyNow,
  onNavigateToProduct,
  detailsLoading = false,
  layout = "desktop",
}: ProductQuickViewContentProps) {
  const tDrawers = useTranslations("Drawers")
  const tProduct = useTranslations("Product")
  const tModal = useTranslations("ProductModal")
  const locale = useLocale()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const {
    id,
    title = "",
    price = 0,
    image,
    images,
    originalPrice,
    condition,
    sellerName,
    sellerAvatarUrl,
    location,
  } = product

  const allImages = images?.length ? images : image ? [image] : []
  const primaryImage = allImages[0] ?? PLACEHOLDER_IMAGE_PATH

  const showDiscount = checkHasDiscount(originalPrice, price)
  const discountPercent =
    showDiscount && typeof originalPrice === "number"
      ? getDiscountPercentage(originalPrice, price)
      : 0

  const inWishlist = isInWishlist(id)
  const [wishlistPending, setWishlistPending] = React.useState(false)

  const shareUrl = React.useMemo(() => {
    if (!productPath || productPath === "#") return null
    if (typeof window === "undefined") return null

    const safePath = productPath.startsWith("/") ? productPath : `/${productPath}`
    return `${window.location.origin}/${locale}${safePath}`
  }, [productPath, locale])

  const handleCopyLink = React.useCallback(async () => {
    if (!shareUrl) return
    try {
      await copyToClipboard(shareUrl)
      toast.success(tModal("linkCopied"))
    } catch {
      toast.error(tModal("copyFailed"))
    }
  }, [shareUrl, tModal])

  const handleToggleWishlist = React.useCallback(async () => {
    if (wishlistPending) return
    setWishlistPending(true)
    try {
      await toggleWishlist({ id, title, price, image: primaryImage })
    } finally {
      setWishlistPending(false)
    }
  }, [wishlistPending, toggleWishlist, id, title, price, primaryImage])

  const formattedPrice = formatPrice(price, { locale })
  const formattedOriginalPrice =
    showDiscount && typeof originalPrice === "number"
      ? formatPrice(originalPrice, { locale })
      : null

  const conditionLabel = React.useMemo(() => {
    if (!condition) return null

    const key = getConditionKey(condition)
    if (!key) return condition

    return tProduct(key as never)
  }, [condition, tProduct])

  const titleText = title || tDrawers("quickView")
  const descriptionPreview = React.useMemo(() => {
    const raw = product.description?.replace(/\s+/g, " ").trim()
    if (!raw) return null
    if (raw.toLowerCase() === titleText.toLowerCase()) return null
    return raw
  }, [product.description, titleText])

  const hasSellerData = Boolean(sellerName || sellerAvatarUrl)
  const showSellerSkeleton = detailsLoading && !hasSellerData
  const showLocationSkeleton = detailsLoading && !location
  const showConditionSkeleton = detailsLoading && !conditionLabel

  const sharedProps: ProductQuickViewViewProps = {
    product,
    productPath,
    ...(onRequestClose ? { onRequestClose } : {}),
    onAddToCart,
    onBuyNow,
    onNavigateToProduct,
    detailsLoading,
    titleText,
    descriptionPreview,
    allImages,
    primaryImage,
    showDiscount,
    discountPercent,
    formattedPrice,
    formattedOriginalPrice,
    conditionLabel,
    inWishlist,
    wishlistPending,
    shareEnabled: Boolean(shareUrl),
    showSellerSkeleton,
    showLocationSkeleton,
    showConditionSkeleton,
    onCopyLink: handleCopyLink,
    onToggleWishlist: handleToggleWishlist,
  }

  if (layout === "mobile") {
    return <ProductQuickViewMobileContent {...sharedProps} />
  }

  return <ProductQuickViewDesktopContent {...sharedProps} />
}

