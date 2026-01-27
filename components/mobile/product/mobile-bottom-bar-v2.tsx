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
import { useRouter } from "@/i18n/routing"
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
  /** Currently active tab - when 'seller', shows contact-focused UI */
  activeTab?: "info" | "seller"
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
  activeTab = "info",
  className,
}: MobileBottomBarV2Props) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const router = useRouter()
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
    router.push(`/chat?seller=${encodeURIComponent(seller.id)}`)
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
    router.push(`/chat?seller=${encodeURIComponent(seller.id)}`)
  }

  // Schedule visit (opens contact with inquiry type)
  const handleScheduleVisit = () => {
    if (!seller?.id) return
    router.push(`/chat?seller=${encodeURIComponent(seller.id)}&type=visit`)
  }

  // Render appropriate buttons based on category and active tab
  const renderButtons = () => {
    // When on seller tab, show contact-focused buttons regardless of category
    if (activeTab === "seller") {
      return (
        <>
          {seller?.phone && (
            <Button
              variant="outline"
              size="lg"
              className="h-12 gap-2 px-4"
              onClick={handleCall}
            >
              <Phone className="size-5" />
              <span>{t("callSeller")}</span>
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1 h-12 gap-2"
            onClick={handleContact}
            disabled={!seller}
          >
            <MessageCircle className="size-5" />
            <span>{t("contactSeller")}</span>
          </Button>
        </>
      )
    }

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
              className="flex-[1.5] h-12 gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="size-5" />
              <span>{t("add")} · {formatPrice(product.price)}</span>
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
      <div className="px-3 py-2.5">
        <div className="flex gap-2">
          {renderButtons()}
        </div>
      </div>
    </div>
  )
}
