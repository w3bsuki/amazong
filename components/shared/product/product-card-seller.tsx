"use client"

import { UserAvatar } from "@/components/shared/user-avatar"
import { SellerVerificationBadge, type VerificationLevel } from "./seller-verification-badge"

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardSellerProps extends Partial<VerificationLevel> {
  name: string
  avatarUrl?: string | null | undefined
  /** @deprecated Use emailVerified, phoneVerified, idVerified instead */
  verified?: boolean | undefined
}

// =============================================================================
// COMPONENT
// =============================================================================

function ProductCardSeller({ 
  name, 
  avatarUrl, 
  verified,
  emailVerified,
  phoneVerified,
  idVerified,
  isVerifiedBusiness,
}: ProductCardSellerProps) {
  // Backwards compatibility: if only `verified` is passed, treat as email verified
  const hasAnyVerification = emailVerified || phoneVerified || idVerified || isVerifiedBusiness || verified

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <UserAvatar
        name={name}
        avatarUrl={avatarUrl ?? null}
        className="size-5 shrink-0 ring-1 ring-border/50 bg-muted"
        fallbackClassName="bg-muted text-2xs font-medium"
      />
      <span className="truncate text-xs text-muted-foreground">{name}</span>
      {hasAnyVerification && (
        <SellerVerificationBadge
          emailVerified={emailVerified ?? verified}
          phoneVerified={phoneVerified}
          idVerified={idVerified}
          isVerifiedBusiness={isVerifiedBusiness}
          size="sm"
        />
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardSeller, type ProductCardSellerProps }
