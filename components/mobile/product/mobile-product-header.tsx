"use client"

import { ArrowLeft, Search, Share2, ShoppingCart, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"

export function MobileProductHeader() {
  const locale = useLocale()
  const labels = {
    back: locale === "bg" ? "Назад" : "Go back",
    search: locale === "bg" ? "Търсене" : "Search",
    share: locale === "bg" ? "Сподели" : "Share",
    cart: locale === "bg" ? "Количка" : "Cart",
    more: locale === "bg" ? "Още" : "More options",
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] h-14 bg-[var(--color-header-bg)] flex items-center justify-between px-2 border-b border-[var(--color-header-border)] lg:hidden text-[var(--color-header-text)]">
      <div className="flex items-center">
        <Link href="/" className="p-2 -ml-1 text-[var(--color-header-text)] shrink-0" aria-label={labels.back} title={labels.back}>
          <ArrowLeft className="h-6 w-6" aria-hidden="true" />
        </Link>
      </div>
      
      <div className="flex items-center gap-0.5">
         <Button
           variant="ghost"
           size="icon"
           className="text-[var(--color-header-text)] hover:bg-[var(--color-header-hover)] hover:text-[var(--color-header-text)]"
           aria-label={labels.search}
           title={labels.search}
         >
           <Search className="h-6 w-6" aria-hidden="true" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className="text-[var(--color-header-text)] hover:bg-[var(--color-header-hover)] hover:text-[var(--color-header-text)]"
           aria-label={labels.share}
           title={labels.share}
         >
           <Share2 className="h-6 w-6" aria-hidden="true" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className="relative text-[var(--color-header-text)] hover:bg-[var(--color-header-hover)] hover:text-[var(--color-header-text)]"
           aria-label={labels.cart}
           title={labels.cart}
         >
           <ShoppingCart className="h-6 w-6" aria-hidden="true" />
           <Badge aria-hidden="true" className="absolute top-1 right-0 bg-[var(--color-cart-badge)] text-white text-[10px] font-bold px-1 min-w-[1.25rem] h-4 flex items-center justify-center rounded-full border-none">
             2
           </Badge>
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className="text-[var(--color-header-text)] hover:bg-[var(--color-header-hover)] hover:text-[var(--color-header-text)]"
           aria-label={labels.more}
           title={labels.more}
         >
           <MoreHorizontal className="h-6 w-6" aria-hidden="true" />
         </Button>
      </div>
    </header>
  )
}
