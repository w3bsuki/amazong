"use client"

import { CaretRight, CheckCircle } from "@phosphor-icons/react"
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
        "group w-full flex items-center gap-4 p-4 rounded-xl text-left",
        "bg-card border border-border",
        "hover:border-foreground/20 hover:shadow-sm transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <VerifiedAvatar
        name={safeSellerName}
        avatarUrl={sellerAvatarUrl ?? null}
        size="lg"
        emailVerified={emailVerified ?? sellerVerified}
        phoneVerified={phoneVerified}
        idVerified={idVerified}
        isVerifiedBusiness={isVerifiedBusiness}
      />
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold truncate group-hover:text-foreground transition-colors">{safeSellerName}</p>
        {hasVerification && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle size={14} weight="fill" className="text-success shrink-0" />
            {tProduct("verifiedSeller")}
          </span>
        )}
      </div>
      <CaretRight size={20} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  )
}
