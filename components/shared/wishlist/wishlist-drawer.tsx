"use client"

import { useEffect, useState } from "react"
import { Heart, ShoppingCart, Trash, ArrowRight, X } from "@phosphor-icons/react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
  DrawerBody,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useCart } from "@/components/providers/cart-context"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface WishlistDrawerProps {
  className?: string
  children: React.ReactNode
}

export function WishlistDrawer({ className, children }: WishlistDrawerProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { items, isLoading, removeFromWishlist, totalItems } = useWishlist()
  const { addToCart } = useCart()
  const t = useTranslations("Wishlist")

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.product_id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    removeFromWishlist(item.product_id)
    toast.success(t("movedToCart"))
  }

  const contentMaxHeight = items.length <= 2 ? "max-h-dialog-sm" : "max-h-dialog"

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={className}>
        <DrawerHeader className="pb-1.5 pt-0 border-b border-border text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
              <Heart size={16} weight="fill" className="text-wishlist" />
              <DrawerTitle className="text-sm font-semibold">{t("title")}</DrawerTitle>
              <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                ({mounted ? totalItems : 0})
              </span>
            </div>
            <DrawerClose asChild>
              <IconButton
                aria-label={t("close")}
                variant="ghost"
                size="icon-compact"
                className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted"
              >
                <X size={20} weight="light" />
              </IconButton>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>
        </DrawerHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 border-2 border-muted border-t-wishlist rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 px-inset text-center">
            <div className="size-11 bg-muted rounded-xl flex items-center justify-center mb-2">
              <Heart size={22} weight="duotone" className="text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">{t("empty")}</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t("emptyDescription")}</p>
            <Button asChild variant="cta" size="default" onClick={() => setOpen(false)}>
              <Link href="/search" className="gap-1">
                {t("startShopping")}
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <DrawerBody className={cn("px-inset", contentMaxHeight)}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "grid grid-cols-wishlist-item gap-1.5 py-2",
                    index !== items.length - 1 && "border-b border-border"
                  )}
                >
                  <Link
                    href={item.username ? `/${item.username}/${item.slug || item.product_id}` : "#"}
                    onClick={() => setOpen(false)}
                    className="shrink-0"
                  >
                    <div className="size-14 bg-muted rounded-xl overflow-hidden border border-border">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="size-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="min-w-0 flex flex-col">
                    <Link
                      href={item.username ? `/${item.username}/${item.slug || item.product_id}` : "#"}
                      onClick={() => setOpen(false)}
                      className="text-sm text-foreground line-clamp-2 leading-snug hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-semibold tabular-nums text-foreground mt-auto pt-1">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <IconButton
                      data-vaul-no-drag
                      onClick={() => handleMoveToCart(item)}
                      variant="ghost"
                      size="icon-compact"
                      className="text-foreground hover:bg-muted active:bg-muted"
                      aria-label={t("add")}
                    >
                      <ShoppingCart size={18} weight="regular" />
                    </IconButton>
                    <IconButton
                      data-vaul-no-drag
                      onClick={() => {
                        removeFromWishlist(item.product_id)
                        toast.success(t("removed"))
                      }}
                      variant="ghost"
                      size="icon-compact"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive-subtle active:bg-destructive-subtle"
                      aria-label={t("remove")}
                    >
                      <Trash size={16} weight="regular" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </DrawerBody>

            <DrawerFooter className="border-t border-border gap-1">
              <Button asChild variant="cta" size="default" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/account/wishlist" className="gap-1">
                  {t("viewAll")}
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
