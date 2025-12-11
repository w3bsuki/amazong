"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Heart, ShoppingCart, Trash, ArrowRight } from "@phosphor-icons/react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface WishlistDrawerHandle {
  open: () => void
  close: () => void
}

interface WishlistDrawerProps {
  className?: string
}

export const WishlistDrawer = forwardRef<WishlistDrawerHandle, WishlistDrawerProps>(
  function WishlistDrawer(_props, ref) {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { items, isLoading, removeFromWishlist, totalItems } = useWishlist()
    const { addToCart } = useCart()
    const t = useTranslations("Wishlist")
    const locale = useLocale()

    useEffect(() => {
      setMounted(true)
    }, [])

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }))

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
        style: 'currency',
        currency: locale === 'bg' ? 'BGN' : 'EUR',
      }).format(price)
    }

    const handleMoveToCart = (item: typeof items[0]) => {
      addToCart({
        id: item.product_id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
      removeFromWishlist(item.product_id)
      toast.success(locale === 'bg' ? 'Преместено в количката' : 'Moved to cart')
    }

    // Calculate dynamic height based on items
    const contentMaxHeight = items.length === 0 
      ? 'max-h-[35dvh]' 
      : items.length <= 2 
        ? 'max-h-[45dvh]' 
        : items.length <= 4 
          ? 'max-h-[55dvh]' 
          : 'max-h-[65dvh]'

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="rounded-t-3xl">
          {/* Header */}
          <DrawerHeader className="pb-2 pt-0 border-b border-border text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={20} weight="fill" className="text-deal" />
                <DrawerTitle className="text-lg">{t("title")}</DrawerTitle>
                <span className="text-sm text-muted-foreground font-normal" suppressHydrationWarning>
                  ({mounted ? totalItems : 0})
                </span>
              </div>
              <DrawerClose asChild>
                <button 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-11 px-3 rounded-lg hover:bg-muted touch-action-manipulation tap-transparent"
                  aria-label="Close"
                >
                  {locale === 'bg' ? 'Затвори' : 'Close'}
                </button>
              </DrawerClose>
            </div>
            <DrawerDescription className="sr-only">
              Your saved wishlist items
            </DrawerDescription>
          </DrawerHeader>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 border-2 border-muted border-t-brand rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Heart size={32} weight="duotone" className="text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {t("empty")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("emptyDescription")}
              </p>
              <Button asChild size="sm" className="gap-2" onClick={() => setOpen(false)}>
                <Link href="/search">
                  {t("startShopping")}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Scrollable Items */}
              <div className={cn("overflow-y-auto overscroll-contain px-4 py-3", contentMaxHeight)}>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex gap-3 p-2 bg-secondary/50 rounded-xl"
                    >
                      {/* Image */}
                      <Link 
                        href={`/product/${item.product_id}`} 
                        onClick={() => setOpen(false)}
                        className="shrink-0"
                      >
                        <div className="relative size-20 bg-background rounded-lg overflow-hidden border border-border">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain p-1"
                            sizes="80px"
                          />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <Link 
                          href={`/product/${item.product_id}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium text-foreground line-clamp-2 hover:text-brand transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-base font-bold text-foreground mt-1">
                          {formatPrice(item.price)}
                        </p>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-auto pt-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors"
                          >
                            <ShoppingCart size={14} />
                            {locale === 'bg' ? 'В количката' : 'Add to Cart'}
                          </button>
                          <span className="text-muted-foreground">•</span>
                          <button
                            onClick={() => {
                              removeFromWishlist(item.product_id)
                              toast.success(locale === 'bg' ? 'Премахнато' : 'Removed')
                            }}
                            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash size={14} />
                            {t("remove")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <DrawerFooter className="border-t border-border pt-3 pb-4">
                <Button 
                  asChild 
                  className="w-full bg-brand hover:bg-brand-dark"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/wishlist" className="gap-2">
                    {locale === 'bg' ? 'Виж всички любими' : 'View All Wishlist'}
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    )
  }
)
