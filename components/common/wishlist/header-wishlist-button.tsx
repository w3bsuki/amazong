"use client"

import { useEffect, useRef, useState } from "react"
import { Heart } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { useWishlist } from "@/components/providers/wishlist-context"
import { WishlistDrawer, type WishlistDrawerHandle } from "@/components/common/wishlist/wishlist-drawer"
import { CountBadge } from "@/components/ui/count-badge"
import { cn } from "@/lib/utils"

interface HeaderWishlistButtonProps {
  className?: string
}

export function HeaderWishlistButton({ className }: HeaderWishlistButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useWishlist()
  const tNav = useTranslations("Navigation")
  const drawerRef = useRef<WishlistDrawerHandle>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => drawerRef.current?.open()}
        className={cn(
          "flex items-center justify-center h-11 w-11 rounded-md relative",
          "border border-transparent hover:border-header-text/20",
          "text-header-text hover:text-header-text hover:bg-header-hover",
          "transition-colors",
          className
        )}
        aria-label={tNav("wishlist")}
      >
        <span className="relative" aria-hidden="true">
          <Heart size={24} weight="regular" className="text-current" />
          {mounted && totalItems > 0 && (
            <CountBadge
              count={totalItems}
              className="absolute -top-1 -right-1 bg-deal text-white ring-1 ring-header-bg h-3.5 min-w-3.5 px-0.5 text-[9px]"
              aria-hidden="true"
            />
          )}
        </span>
      </button>
      <WishlistDrawer ref={drawerRef} />
    </>
  )
}
