"use client"

import { useEffect, useState } from "react"
import { Heart, ShoppingCart, Trash, ArrowRight } from "@phosphor-icons/react"
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

  const contentMaxHeight =
    items.length === 0
      ? "max-h-(--wishlist-drawer-max-h-empty)"
      : items.length <= 2
        ? "max-h-(--wishlist-drawer-max-h-few)"
        : "max-h-(--wishlist-drawer-max-h)"

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={cn("rounded-t-xl", className)}>
        <DrawerHeader className="pb-1.5 pt-0 border-b border-border text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
              <Heart size={16} weight="fill" className="text-wishlist" />
              <DrawerTitle className="text-sm font-semibold">{t("title")}</DrawerTitle>
              <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                ({mounted ? totalItems : 0})
              </span>
            </div>
            <DrawerClose asChild>
              <button
                className="text-xs text-muted-foreground hover:text-foreground h-touch-xs px-2 rounded-md hover:bg-muted touch-action-manipulation tap-transparent"
                aria-label={t("close")}
              >
                {t("close")}
              </button>
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
            <div className="size-11 bg-muted rounded-lg flex items-center justify-center mb-2">
              <Heart size={22} weight="duotone" className="text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">{t("empty")}</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t("emptyDescription")}</p>
            <Button asChild variant="cta" size="default" onClick={() => setOpen(false)}>
              <Link href="/search" className="gap-1.5">
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
                  className={cn("flex gap-2 py-2", index !== items.length - 1 && "border-b border-border")}
                >
                  <Link
                    href={item.username ? `/${item.username}/${item.slug || item.product_id}` : "#"}
                    onClick={() => setOpen(false)}
                    className="shrink-0"
                  >
                    <div className="size-14 bg-muted rounded-md overflow-hidden border border-border">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="size-full object-contain p-0.5"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link
                      href={item.username ? `/${item.username}/${item.slug || item.product_id}` : "#"}
                      onClick={() => setOpen(false)}
                      className="text-sm text-foreground line-clamp-2 leading-snug hover:text-brand"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{formatPrice(item.price)}</p>

                    <div className="flex items-center gap-1.5 mt-auto pt-1">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-1 h-touch-xs px-2 text-xs font-medium text-brand hover:text-brand-dark bg-brand/10 hover:bg-brand/15 rounded-md touch-action-manipulation tap-transparent"
                      >
                        <ShoppingCart size={12} />
                        {t("add")}
                      </button>
                      <button
                        onClick={() => {
                          removeFromWishlist(item.product_id)
                          toast.success(t("removed"))
                        }}
                        className="flex items-center justify-center size-touch-xs rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 touch-action-manipulation tap-transparent"
                        aria-label={t("remove")}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </DrawerBody>

            <DrawerFooter className="border-t border-border gap-1.5">
              <Button asChild variant="cta" size="default" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/account/wishlist" className="gap-1.5">
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
