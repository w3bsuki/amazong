"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { safeAvatarSrc } from "@/lib/utils"
import { SealCheck } from "@phosphor-icons/react"

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardSellerProps {
  name: string
  avatarUrl?: string | null | undefined
  verified?: boolean | undefined
}

// =============================================================================
// COMPONENT
// =============================================================================

function ProductCardSeller({ name, avatarUrl, verified }: ProductCardSellerProps) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Avatar className="size-5 shrink-0 ring-1 ring-border/50">
        <AvatarImage src={safeAvatarSrc(avatarUrl)} />
        <AvatarFallback className="bg-muted text-2xs font-medium">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-xs text-muted-foreground">{name}</span>
      {verified && (
        <SealCheck size={10} weight="fill" className="shrink-0 text-verified" />
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardSeller, type ProductCardSellerProps }
