"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import type { CartItem } from "@/components/providers/cart-context"

interface MobileOrderItemsProps {
  items: CartItem[]
  formatPrice: (price: number) => string
}

export function MobileOrderItems({ items, formatPrice }: MobileOrderItemsProps) {
  const t = useTranslations("CheckoutPage")
  // Compact stacked thumbnails for mobile
  return (
    <div className="flex items-center gap-3">
      {/* Stacked thumbnails */}
      <div className="flex -space-x-1.5">
        {items.slice(0, 4).map((item, i) => (
          <div 
            key={`${item.id}-${item.variantId || ""}`} 
            className="size-10 rounded-lg border-2 border-background bg-muted overflow-hidden shrink-0" 
            style={{ zIndex: 4 - i }}
          >
            <Image 
              src={item.image || "/placeholder.svg"} 
              alt={item.title} 
              width={40} 
              height={40} 
              className="size-full object-cover" 
            />
          </div>
        ))}
        {items.length > 4 && (
          <div className="size-10 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            +{items.length - 4}
          </div>
        )}
      </div>
      
      {/* Summary text */}
      <div className="flex-1 min-w-0">
        {items.length === 1 && items[0] ? (
          <p className="text-sm font-medium line-clamp-2">{items[0].title}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {items.length} {t("items") || "items"}
          </p>
        )}
        {items.length === 1 && items[0] && items[0].quantity > 1 && (
          <p className="text-xs text-muted-foreground">
            {t("qty")}: {items[0].quantity}
          </p>
        )}
      </div>
      
      {/* Total */}
      <p className="text-sm font-semibold shrink-0">
        {formatPrice(items.reduce((sum, i) => sum + i.price * i.quantity, 0))}
      </p>
    </div>
  )
}
