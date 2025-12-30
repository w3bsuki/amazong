"use client"

import { Star, Store, CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileProductInfoProps {
  product: {
    title: string
    price: {
      sale: number
      regular?: number
      currency: string
    }
    condition?: string | null
    shipping?: {
      free: boolean
    }
  }
  store: {
    name: string
    rating: string
    verified: boolean
    username?: string
    avatarUrl?: string
  }
  locale: string
}

export function MobileProductInfo({ product, store, locale }: MobileProductInfoProps) {
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: product.price.currency,
    minimumFractionDigits: 2,
  }).format(product.price.sale)

  const formattedRegularPrice = product.price.regular
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: product.price.currency,
        minimumFractionDigits: 2,
      }).format(product.price.regular)
    : null

  return (
    <div className="flex flex-col gap-2 lg:hidden px-1">
      {/* Price & Badges (High Signal First) */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-price font-bold text-price-regular tracking-tight text-2xl">
            {formattedPrice}
          </span>
          {formattedRegularPrice && (
            <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
              {formattedRegularPrice}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {product.condition && (
            <Badge variant="secondary" className="font-medium text-2xs px-1.5 py-0 h-5 bg-muted text-muted-foreground hover:bg-muted rounded-sm">
              {product.condition}
            </Badge>
          )}
          {product.shipping?.free && (
            <Badge variant="secondary" className="font-bold text-2xs px-1.5 py-0 h-5 bg-shipping-free/10 text-shipping-free hover:bg-shipping-free/20 border-transparent rounded-sm">
              Free Shipping
            </Badge>
          )}
        </div>
      </div>

      {/* Title (Dense) */}
      <h1 className="text-body font-normal leading-snug text-foreground line-clamp-3">
        {product.title}
      </h1>

      {/* Trust Line (Seller & Rating) */}
      <div className="flex items-center justify-between pt-1">
        <Link 
          href={`/${store.username || "#"}`}
          className="flex items-center gap-2 group"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-rating text-rating" />
              <span className="text-sm font-bold text-foreground">{store.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm text-link group-hover:underline truncate max-w-[150px]">
              {store.name}
            </span>
            {store.verified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-verified" />
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
