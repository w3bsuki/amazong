"use client"

// =============================================================================
// MOBILE BOTTOM BAR V2 - Category-Adaptive Sticky Action Bar
// =============================================================================
// Based on V2 demo design. Key features:
// - Category-adaptive CTAs:
//   - Default: Chat + Add to Cart
//   - Automotive: Call + Contact Seller
//   - Real-estate: Schedule Visit + Contact Agent
// - Safe area padding for mobile devices
// - Subtle top border with shadow
// =============================================================================

import { MessageCircle, ShoppingCart, Phone, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/providers/cart-context"
import { useRouter, useParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import type { CategoryType } from "@/lib/utils/category-type"

interface MobileBottomBarV2Props {
  categoryType: CategoryType
  /** Product info for cart and navigation */
  product: {
    id: string
    title: string
    price: number
    originalPrice?: number | null
    currency?: string
    image: string
    slug?: string
    username?: string
  }
  /** Seller info for contact actions */
  seller?: {
    id: string
    displayName: string
    phone?: string
  }
  className?: string
}

/**
 * Mobile Bottom Bar V2
 * 
 * Sticky action bar with category-adaptive CTAs:
 * - default: Chat + Add to Cart (e-commerce)
 * - automotive: Call Seller + Contact Seller (vehicle listings)
 * - real-estate: Schedule Visit + Contact Agent (property listings)
 */
export function MobileBottomBarV2({
  categoryType,
  product,
  seller,
  className,
}: MobileBottomBarV2Props) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const router = useRouter()
  const params = useParams()
  const routeLocale = (params.locale as string) || "en"
  const { addToCart } = useCart()

  // Price formatting
  const currency = product.currency || "EUR"
  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "BGN" ? 0 : 2,
      maximumFractionDigits: currency === "BGN" ? 0 : 2,
    }).format(p)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Navigate to chat
  const handleChat = () => {
    if (!seller?.id) return
    router.push(`/${routeLocale}/chat?seller=${seller.id}`)
  }

  // Add to cart
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      ...(product.username ? { username: product.username } : {}),
    })
  }

  // Call seller
  const handleCall = () => {
    if (!seller?.phone) return
    window.location.href = `tel:${seller.phone}`
  }

  // Contact seller/agent (opens chat or contact form)
  const handleContact = () => {
    if (!seller?.id) return
    router.push(`/${routeLocale}/chat?seller=${seller.id}`)
  }

  // Schedule visit (opens contact with inquiry type)
  const handleScheduleVisit = () => {
    if (!seller?.id) return
    router.push(`/${routeLocale}/chat?seller=${seller.id}&type=visit`)
  }

  // Render appropriate buttons based on category
  const renderButtons = () => {
    switch (categoryType) {
      case "automotive":
        return (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 gap-2"
              onClick={handleCall}
              disabled={!seller?.phone}
            >
              <Phone className="size-5" />
              <span>{t("callSeller")}</span>
            </Button>
            <Button
              size="lg"
              className="flex-1 h-12 gap-2"
              onClick={handleContact}
              disabled={!seller}
            >
              <User className="size-5" />
              <span>{t("contactSeller")}</span>
            </Button>
          </>
        )

      case "real-estate":
        return (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 gap-2"
              onClick={handleScheduleVisit}
              disabled={!seller}
            >
              <Calendar className="size-5" />
              <span>{t("scheduleVisit")}</span>
            </Button>
            <Button
              size="lg"
              className="flex-1 h-12 gap-2"
              onClick={handleContact}
              disabled={!seller}
            >
              <User className="size-5" />
              <span>{t("contactAgent")}</span>
            </Button>
          </>
        )

      default:
        return (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 gap-2"
              onClick={handleChat}
              disabled={!seller}
            >
              <MessageCircle className="size-5" />
              <span>{t("chat")}</span>
            </Button>
            <Button
              size="lg"
              className="flex-1 h-12 gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="size-5" />
              <span>{t("addToCart")}</span>
            </Button>
          </>
        )
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-surface-elevated border-t border-border",
        "pb-safe",
        className
      )}
    >
      <div className="px-3 pt-2 pb-3">
        {/* Price Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-strong">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-text-muted-alt line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-price-sale/10 text-price-sale text-xs font-semibold">
                -{discount}%
              </span>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2">
          {renderButtons()}
        </div>
      </div>
    </div>
  )
}
