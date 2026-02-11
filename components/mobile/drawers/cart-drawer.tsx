"use client"

import { useMemo, useCallback, useEffect, useState } from "react"
import { ShoppingCart, Package, Minus, Plus, Trash, X } from "@phosphor-icons/react"
import {
  Drawer,
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
import { useTranslations, useLocale } from "next-intl"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CartDrawerItemImage({
  src,
  alt,
  priority,
}: {
  src?: string | null
  alt: string
  priority: boolean
}) {
  const [resolvedSrc, setResolvedSrc] = useState(() => normalizeImageUrl(src))

  useEffect(() => {
    setResolvedSrc(normalizeImageUrl(src))
  }, [src])

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={56}
      height={56}
      className="size-full object-cover"
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      onError={() => {
        if (resolvedSrc !== PLACEHOLDER_IMAGE_PATH) {
          setResolvedSrc(PLACEHOLDER_IMAGE_PATH)
        }
      }}
    />
  )
}

/**
 * CartDrawer - Controlled cart drawer for mobile
 * 
 * Can be triggered from:
 * - Drawer context (e.g., after "Add to Cart" action)
 * - Direct usage with open/onOpenChange props
 * 
 * For self-contained trigger usage, see MobileCartDropdown instead.
 */
export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, totalItems, subtotal, removeFromCart, updateQuantity } = useCart()
  const t = useTranslations("CartDropdown")
  const locale = useLocale()

  const formatPrice = useCallback(
    (price: number) =>
      new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
        style: "currency",
        currency: "EUR",
      }).format(price),
    [locale]
  )

  const contentMaxHeight = useMemo(
    () => (items.length <= 2 ? "max-h-dialog-sm" : "max-h-dialog"),
    [items.length]
  )

  const buildProductUrl = useCallback((item: CartItem) => {
    if (!item.username) return "#"
    return `/${item.username}/${item.slug || item.id}`
  }, [])

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="pb-1.5 pt-0 border-b border-border text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShoppingCart size={16} weight="regular" className="text-muted-foreground" />
              <DrawerTitle className="text-sm font-semibold">{t("title")}</DrawerTitle>
              <span className="text-xs text-muted-foreground">({totalItems})</span>
            </div>
            <DrawerClose asChild>
              <IconButton
                aria-label={t("close")}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted"
              >
                <X size={20} weight="light" />
              </IconButton>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>
        </DrawerHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-inset py-5">
            <div className="size-11 bg-muted rounded-xl flex items-center justify-center mb-2">
              <ShoppingCart size={22} weight="regular" className="text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">{t("empty")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("emptyDescription")}
            </p>
          </div>
        ) : (
          <DrawerBody className={cn("px-inset", contentMaxHeight)}>
            {items.map((item, index) => (
              <div
                key={`${item.id}:${item.variantId ?? ""}`}
                className={cn("flex gap-2 py-2", index !== items.length - 1 && "border-b border-border")}
              >
                <Link href={buildProductUrl(item)} onClick={handleClose} className="shrink-0">
                  <div className="size-14 bg-muted rounded-xl overflow-hidden border border-border">
                    {item.image ? (
                      <CartDrawerItemImage src={item.image} alt={item.title} priority={index === 0} />
                    ) : (
                      <div className="size-full flex items-center justify-center text-muted-foreground">
                        <Package size={20} weight="regular" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <Link
                    href={buildProductUrl(item)}
                    onClick={handleClose}
                    className="text-sm text-foreground hover:text-primary line-clamp-2 leading-snug"
                  >
                    {item.title}
                  </Link>
                  {item.variantName && (
                    <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.variantName}</span>
                  )}
                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold tabular-nums text-foreground">{formatPrice(item.price)}</span>
                      <IconButton
                        data-vaul-no-drag
                        aria-label={t("removeItem")}
                        variant="ghost"
                        className="hover:bg-destructive-subtle text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id, item.variantId)}
                      >
                        <Trash weight="regular" />
                      </IconButton>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        data-vaul-no-drag
                        aria-label={t("decreaseQuantity")}
                        variant="ghost"
                        className="hover:bg-muted text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.id, item.quantity - 1, item.variantId)
                            : removeFromCart(item.id, item.variantId)
                        }
                      >
                        <Minus weight="bold" />
                      </IconButton>
                      <span className="min-w-touch text-sm font-medium tabular-nums text-foreground text-center">{item.quantity}</span>
                      <IconButton
                        data-vaul-no-drag
                        aria-label={t("increaseQuantity")}
                        variant="ghost"
                        className="hover:bg-muted text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                      >
                        <Plus weight="bold" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </DrawerBody>
        )}

        <DrawerFooter className="border-t border-border gap-1.5">
          {items.length === 0 ? (
            <Button variant="cta" size="default" className="w-full" asChild>
              <Link href="/search" onClick={handleClose}>
                {t("startShopping")}
              </Link>
            </Button>
          ) : (
            <>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-muted-foreground">{t("subtotal")}</span>
                <span className="text-base font-bold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <Button variant="cta" size="default" className="w-full" asChild>
                <Link href="/checkout" onClick={handleClose}>
                  {t("checkout")}
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/cart" onClick={handleClose}>
                  {t("viewCart")}
                </Link>
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
