"use client"

import { ArrowLeft, Search, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { useCart } from "@/components/providers/cart-context"

export function MobileCartHeader() {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("CartPage")
  const { totalItems } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const labels = {
    back: locale === "bg" ? "Назад" : "Go back",
    search: locale === "bg" ? "Търсене" : "Search",
    cart: locale === "bg" ? "Количка" : "Cart",
    wishlist: locale === "bg" ? "Любими" : "Wishlist",
  }

  const handleBack = () => {
    // Try to go back, or go home if no history
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-60 h-12 bg-brand flex items-center justify-between px-2 lg:hidden">
        {/* Left side: Back + Title */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center size-10 rounded-full text-header-text hover:bg-header-hover active:bg-header-active transition-colors" 
            aria-label={labels.back} 
            title={labels.back}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          
          {/* Cart title */}
          <div className="flex items-center gap-1.5 pl-1">
            <ShoppingCart className="size-4 text-header-text" aria-hidden="true" />
            <span className="text-sm font-medium text-header-text">
              {t("title")}
            </span>
            {totalItems > 0 && (
              <Badge 
                className="bg-white/20 text-header-text text-2xs font-medium px-1.5 h-5 rounded-full border-0"
              >
                {totalItems}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full text-header-text hover:bg-header-hover"
            aria-label={labels.search}
            title={labels.search}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="size-5" aria-hidden="true" />
          </Button>
          <Link
            href="/wishlist"
            className="flex items-center justify-center size-10 rounded-full text-header-text hover:bg-header-hover active:bg-header-active transition-colors"
            aria-label={labels.wishlist}
            title={labels.wishlist}
          >
            <Heart className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </header>
      
      {/* Search Overlay */}
      <MobileSearchOverlay 
        hideDefaultTrigger 
        externalOpen={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
      />
    </>
  )
}
