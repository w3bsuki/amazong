"use client"

import { useState, useEffect, useRef } from "react"
import { Heart } from "@phosphor-icons/react"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useTranslations } from "next-intl"
import { WishlistDrawer, type WishlistDrawerHandle } from "@/components/common/wishlist/wishlist-drawer"

export function MobileWishlistButton() {
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
        onClick={() => drawerRef.current?.open()}
        className="flex items-center justify-center size-11 p-0 rounded-lg relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
        aria-label={tNav("wishlist")}
      >
        <Heart size={24} weight="regular" className="text-header-text" aria-hidden="true" />
        {mounted && totalItems > 0 && (
          <span 
            className="absolute top-0.5 right-0 bg-deal text-white text-xs font-bold min-w-4 h-4 flex items-center justify-center rounded-full px-0.5" 
            aria-hidden="true"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>
      <WishlistDrawer ref={drawerRef} />
    </>
  )
}
