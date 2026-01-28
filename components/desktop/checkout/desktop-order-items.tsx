"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { CartItem } from "@/components/providers/cart-context"

interface DesktopOrderItemsProps {
  items: CartItem[]
  formatPrice: (price: number) => string
}

export function DesktopOrderItems({ items, formatPrice }: DesktopOrderItemsProps) {
  const t = useTranslations("CheckoutPage")
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const productPath = item.username && item.slug 
          ? `/${item.username}/${item.slug}` 
          : item.slug 
            ? `/products/${item.slug}`
            : "#"
        
        return (
          <div key={`${item.id}-${item.variantId || ""}`} className="flex gap-4">
            {/* Product image - larger for desktop */}
            <Link href={productPath} className="shrink-0">
              <div className="size-20 rounded-lg border border-border bg-muted overflow-hidden hover:border-hover-border transition-colors">
                <Image 
                  src={item.image || "/placeholder.svg"} 
                  alt={item.title} 
                  width={80} 
                  height={80} 
                  className="size-full object-cover" 
                />
              </div>
            </Link>
            
            {/* Product details */}
            <div className="flex-1 min-w-0">
              <Link 
                href={productPath}
                className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
              
              {item.variantName && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.variantName}
                </p>
              )}
              
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  {t("qty")}: {item.quantity}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} {t("each") || "each"}
                </span>
              </div>
            </div>
            
            {/* Item total */}
            <div className="text-right shrink-0">
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
