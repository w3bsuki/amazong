"use client"

// =============================================================================
// MOBILE BOTTOM BAR - Category-Adaptive Sticky Action Bar
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

export interface MobileBottomBarProps {
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
 * Mobile Bottom Bar
 * 
 * Sticky action bar with category-adaptive CTAs:
 * - default: Chat + Add to Cart (e-commerce)
 * - automotive: Call Seller + Contact Seller (vehicle listings)
 * - real-estate: Schedule Visit + Contact Agent (property listings)
 */
export function MobileBottomBar({
  categoryType,
  product,
  seller,
  className,
}: MobileBottomBarProps) {
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
    const params = new URLSearchParams({ seller: seller.id })
    if (product.id) params.set("product", product.id)
    router.push(`/chat?${params.toString()}`)
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
    // Include product ID for context in the conversation
    const params = new URLSearchParams({ seller: seller.id })
    if (product.id) params.set("product", product.id)
    router.push(`/chat?${params.toString()}`)
  }

  // Schedule visit (opens contact with inquiry type)
  const handleScheduleVisit = () => {
    if (!seller?.id) return
    const params = new URLSearchParams({ seller: seller.id, type: "visit" })
    if (product.id) params.set("product", product.id)
    router.push(`/chat?${params.toString()}`)
  }

  // Render appropriate buttons based on category type
  const renderButtons = () => {
    switch (categoryType) {
      case "automotive":
        return (
          <>
            <Button
              variant="outline"
              size="primary"
              className="flex-1 gap-2"
              onClick={handleCall}
              disabled={!seller?.phone}
            >
              <Phone className="size-5" />
              <span>{t("callSeller")}</span>
            </Button>
            <Button
              size="primary"
              className="flex-1 gap-2"
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
              size="primary"
              className="flex-1 gap-2"
              onClick={handleScheduleVisit}
              disabled={!seller}
            >
              <Calendar className="size-5" />
              <span>{t("scheduleVisit")}</span>
            </Button>
            <Button
              size="primary"
              className="flex-1 gap-2"
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
              size="primary"
              className="flex-1 gap-2"
              onClick={handleChat}
              disabled={!seller}
            >
              <MessageCircle className="size-5" />
              <span>{t("chat")}</span>
            </Button>
            <Button
              size="primary"
              className="flex-[1.5] gap-2"
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
        "border-t border-border bg-background",
        "pb-safe",
        className
      )}
    >
      <div className="px-3 py-2.5 max-w-lg mx-auto">
        <div className="flex gap-2">
          {renderButtons()}
        </div>
      </div>
    </div>
  )
}
