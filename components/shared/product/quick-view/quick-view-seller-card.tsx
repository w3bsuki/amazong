"use client"

import { CaretRight } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SellerVerificationBadge } from "@/components/shared/product/seller-verification-badge"
import { cn } from "@/lib/utils"

interface QuickViewSellerCardProps {
  sellerName?: string | null | undefined
  sellerAvatarUrl?: string | null | undefined
  sellerVerified?: boolean | undefined
  /** New: granular verification levels */
  emailVerified?: boolean | undefined
  phoneVerified?: boolean | undefined
  idVerified?: boolean | undefined
  isVerifiedBusiness?: boolean | undefined
  onNavigateToProduct: () => void
}

export function QuickViewSellerCard({
  sellerName,
  sellerAvatarUrl,
  sellerVerified,
  emailVerified,
  phoneVerified,
  idVerified,
  isVerifiedBusiness,
  onNavigateToProduct,
}: QuickViewSellerCardProps) {
  const tProduct = useTranslations("Product")
  
  // Backwards compatibility: if only sellerVerified is passed, treat as email verified
  const hasVerification = emailVerified || phoneVerified || idVerified || isVerifiedBusiness || sellerVerified
  const safeSellerName = sellerName ?? tProduct("seller")

  return (
    <button
      type="button"
      onClick={onNavigateToProduct}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-md text-left",
        "bg-muted/50 border border-border",
        "hover:bg-muted/80 transition-colors duration-100",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={sellerAvatarUrl ?? undefined} alt={safeSellerName} />
        <AvatarFallback className="bg-muted text-sm font-medium">
          {safeSellerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold truncate">{safeSellerName}</p>
          {hasVerification && (
            <SellerVerificationBadge
              emailVerified={emailVerified ?? sellerVerified}
              phoneVerified={phoneVerified}
              idVerified={idVerified}
              isVerifiedBusiness={isVerifiedBusiness}
              size="sm"
            />
          )}
        </div>
        {hasVerification && (
          <span className="text-xs text-verified">
            {tProduct("verifiedSeller")}
          </span>
        )}
      </div>
      <CaretRight size={16} className="text-muted-foreground shrink-0" />
    </button>
  )
}
