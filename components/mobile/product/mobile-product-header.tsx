"use client"

import { ArrowLeft, Search, Share2, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { useCart } from "@/components/providers/cart-context"

export function MobileProductHeader() {
  const locale = useLocale()
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
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
    <header className="fixed top-0 left-0 right-0 z-[60] h-14 bg-background/95 backdrop-blur-md flex items-center justify-between px-1 border-b border-border/50 shadow-sm lg:hidden">
      {/* Back button */}
      <Link 
        href="/" 
        className="flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-muted active:bg-muted/80 transition-colors -ml-1" 
        aria-label={labels.back} 
        title={labels.back}
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Link>
      
      {/* Action buttons */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="w-11 h-11 rounded-full text-foreground hover:bg-muted active:bg-muted/80"
          aria-label={labels.search}
          title={labels.search}
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-11 h-11 rounded-full text-foreground hover:bg-muted active:bg-muted/80"
          aria-label={labels.share}
          title={labels.share}
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-11 h-11 rounded-full text-foreground hover:bg-muted active:bg-muted/80"
          aria-label={labels.wishlist}
          title={labels.wishlist}
        >
          <Heart className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Link
          href="/cart"
          className="relative flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-muted active:bg-muted/80 transition-colors"
          aria-label={labels.cart}
          title={labels.cart}
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {cartCount > 0 && (
            <Badge 
              aria-hidden="true" 
              className="absolute -top-0.5 -right-0.5 bg-[var(--color-cart-badge)] text-white text-[10px] font-bold px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full border-2 border-background shadow-sm"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          )}
        </Link>
      </div>
    </header>
  )
}
