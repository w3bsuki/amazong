"use client"

import { ArrowLeft, Search, Share2, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { useCart } from "@/components/providers/cart-context"

export function MobileProductHeader() {
  const locale = useLocale()
  const { totalItems } = useCart()
  
  const labels = {
    back: locale === "bg" ? "Назад" : "Go back",
    search: locale === "bg" ? "Търсене" : "Search",
    share: locale === "bg" ? "Сподели" : "Share",
    cart: locale === "bg" ? "Количка" : "Cart",
    wishlist: locale === "bg" ? "Любими" : "Wishlist",
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-60 h-14 bg-background/95 backdrop-blur-md flex items-center justify-between px-1 border-b border-border/50 shadow-sm lg:hidden">
      {/* Back button */}
      <Link 
        href="/" 
        className="flex items-center justify-center size-10 rounded-full text-foreground hover:bg-accent active:bg-accent/80 transition-colors" 
        aria-label={labels.back} 
        title={labels.back}
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </Link>
      
      {/* Action buttons */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full"
          aria-label={labels.search}
          title={labels.search}
        >
          <Search className="size-5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full"
          aria-label={labels.share}
          title={labels.share}
          onClick={handleShare}
        >
          <Share2 className="size-5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full"
          aria-label={labels.wishlist}
          title={labels.wishlist}
        >
          <Heart className="size-5" aria-hidden="true" />
        </Button>
        <Link
          href="/cart"
          className="relative flex items-center justify-center size-10 rounded-full text-foreground hover:bg-accent active:bg-accent/80 transition-colors"
          aria-label={labels.cart}
          title={labels.cart}
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
          {totalItems > 0 && (
            <Badge 
              aria-hidden="true" 
              className="absolute -top-0.5 -right-0.5 bg-cart-badge text-white text-2xs font-bold px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full border-2 border-background"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </Link>
      </div>
    </header>
  )
}
