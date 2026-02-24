import { MapPin, ShieldCheck, Truck } from "lucide-react"

import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { getConditionBadgeVariant } from "@/components/shared/product/condition"

import { FreshnessIndicator } from "../freshness-indicator"
import { VerifiedSellerBadge } from "../verified-seller-badge"
import { ProductCardPrice } from "./price"
import type { ProductCardListBadge } from "./list.types"

interface ProductCardListContentSectionProps {
  title: string
  rootCategoryLabel: string | null
  description: string | null | undefined
  smartBadges: ProductCardListBadge[]
  conditionLabel: string | null
  condition: string | undefined
  location: string | undefined
  createdAt: string | null | undefined
  price: number
  originalPrice: number | null | undefined
  locale: string
  freeShipping: boolean
  showBuyerProtection: boolean
  sellerName: string | undefined
  sellerVerified: boolean | undefined
  freeShippingLabel: string
  buyerProtectionLabel: string
  verifiedLabel: string
  formatBadgeValue: (badge: ProductCardListBadge) => string
  getBadgeLabel: (badgeKey: string) => string
}

export function ProductCardListContentSection({
  title,
  rootCategoryLabel,
  description,
  smartBadges,
  conditionLabel,
  condition,
  location,
  createdAt,
  price,
  originalPrice,
  locale,
  freeShipping,
  showBuyerProtection,
  sellerName,
  sellerVerified,
  freeShippingLabel,
  buyerProtectionLabel,
  verifiedLabel,
  formatBadgeValue,
  getBadgeLabel,
}: ProductCardListContentSectionProps) {
  return (
    <div className="relative z-0 flex min-w-0 flex-1 flex-col">
      <h3 className="mb-1 min-w-0 truncate text-sm sm:text-base font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      {rootCategoryLabel && (
        <span
          data-slot="category"
          className="mb-1 block min-w-0 truncate text-2xs font-medium text-muted-foreground"
        >
          {rootCategoryLabel}
        </span>
      )}

      {description && (
        <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{description}</p>
      )}

      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {smartBadges.map((badge) => {
          const value = formatBadgeValue(badge)
          return (
            <MarketplaceBadge
              key={badge.key}
              size="compact"
              variant={badge.key === "condition" ? getConditionBadgeVariant(badge.value) : "condition"}
              className="text-2xs"
              title={`${getBadgeLabel(badge.key)}: ${value}`}
            >
              {value}
            </MarketplaceBadge>
          )
        })}
        {smartBadges.length === 0 && conditionLabel && (
          <MarketplaceBadge size="compact" variant={getConditionBadgeVariant(condition)} className="text-2xs">
            {conditionLabel}
          </MarketplaceBadge>
        )}
        {location && (
          <span className="inline-flex items-center gap-0.5">
            <MapPin size={12} />
            {location}
          </span>
        )}
        <FreshnessIndicator createdAt={createdAt} showIcon />
      </div>

      <div className="mt-auto">
        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          presentation="price-badge"
        />
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        {freeShipping && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <Truck size={14} />
            {freeShippingLabel}
          </span>
        )}
        {showBuyerProtection && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck size={14} />
            {buyerProtectionLabel}
          </span>
        )}
      </div>

      {sellerName && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{sellerName}</span>
          {sellerVerified && (
            <VerifiedSellerBadge
              label={verifiedLabel}
              className="shrink-0"
            />
          )}
        </div>
      )}
    </div>
  )
}
