"use client"

import { CaretRight } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { VerifiedAvatar } from "@/components/shared/verified-avatar"
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
        "w-full flex items-center gap-3 p-3 rounded-lg text-left",
        "bg-card border border-border",
        "hover:bg-accent/50 transition-colors duration-100",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <VerifiedAvatar
        name={safeSellerName}
        avatarUrl={sellerAvatarUrl ?? null}
        size="md"
        emailVerified={emailVerified ?? sellerVerified}
        phoneVerified={phoneVerified}
        idVerified={idVerified}
        isVerifiedBusiness={isVerifiedBusiness}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{safeSellerName}</p>
        {hasVerification && (
          <span className="text-xs text-muted-foreground">
            {tProduct("verifiedSeller")}
          </span>
        )}
      </div>
      <CaretRight size={16} className="text-muted-foreground shrink-0" />
    </button>
  )
}
