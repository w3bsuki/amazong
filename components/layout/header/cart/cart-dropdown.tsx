"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import { Minus, Package, Plus, ShoppingCart, LoaderCircle as SpinnerGap, Trash } from "lucide-react";
import { getProductUrl } from "@/lib/url-utils"

import Image from "next/image"
import { useCallback } from "react"
import { CountBadge } from "@/components/shared/count-badge"

const CART_BADGE_MAX = Number.MAX_SAFE_INTEGER

export function CartDropdown() {
  const { items, totalItems, subtotal, removeFromCart, updateQuantity, isReady } = useCart()
  const t = useTranslations("CartDropdown")
  const tNav = useTranslations("Navigation")
  const locale = useLocale()

  const buildProductUrl = useCallback((item: CartItem) => {
    return getProductUrl({
      id: item.id,
      slug: item.slug ?? null,
      username: item.username ?? null,
      storeSlug: item.storeSlug ?? null,
    })
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }
  const cartItemsSuffix =
    isReady && totalItems > 0
      ? ` (${totalItems} ${totalItems === 1 ? t("item") : t("items")})`
      : ""
  const cartAriaLabel = `${tNav("cart")}${cartItemsSuffix}`

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href="/cart"
          className="block rounded-md tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          aria-label={cartAriaLabel}
        >
          <div className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-transparent text-header-text motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:border-header-text/20 hover:bg-header-hover [&_svg]:size-6">
            <span className="relative" aria-hidden="true">
              <ShoppingCart />
              {isReady && totalItems > 0 && (
                <CountBadge
                  count={totalItems}
                  max={CART_BADGE_MAX}
                  className="absolute -top-1 -right-1.5 bg-cart-badge text-primary-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs"
                  aria-hidden="true"
                />
              )}
            </span>
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden shadow-dropdown"
        align="end"
        sideOffset={8}
        collisionPadding={10}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
          <div className="flex items-center gap-1.5">
            <ShoppingCart size={16} className="text-foreground" />
            <h3 className="font-semibold text-sm text-foreground">{t("title")}</h3>
            <span className="text-xs text-muted-foreground">({isReady ? totalItems : "..."})</span>
          </div>
        </div>

        {!isReady ? (
          <div className="p-4 text-center" aria-live="polite">
            <SpinnerGap size={20} className="mx-auto animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-3 text-center">
            <ShoppingCart size={36} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm mb-3">{t("empty")}</p>
            <Button variant="cta" size="default" className="w-full" asChild>
              <Link href="/search">
                {t("startShopping")}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-(--spacing-scroll-md) overflow-y-auto">
              {items.slice(0, 4).map((item) => (
                <div key={`${item.id}:${item.variantId ?? ""}`} className="flex gap-1.5 p-1.5 border-b border-border hover:bg-hover active:bg-active">
                  <Link href={buildProductUrl(item)} className="shrink-0 rounded-md tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
                    <div className="size-12 bg-muted rounded-md overflow-hidden border border-border">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={48}
                          height={48}
                          sizes="48px"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-muted-foreground">
                          <Package size={18} />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={buildProductUrl(item)}
                      className="line-clamp-2 rounded-sm text-sm leading-snug text-foreground tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    >
                      {item.title}
                    </Link>
                    {item.variantName && (
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {item.variantName}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault()
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1, item.variantId)
                            } else {
                              removeFromCart(item.id, item.variantId)
                            }
                          }}
                          size="icon-lg"
                          variant="ghost"
                          className="text-muted-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-muted hover:text-foreground"
                          aria-label={t("decreaseQuantity")}
                        >
                          <Minus />
                        </IconButton>
                        <span className="text-xs font-medium text-foreground min-w-touch text-center">
                          {item.quantity}
                        </span>
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault()
                            updateQuantity(item.id, item.quantity + 1, item.variantId)
                          }}
                          size="icon-lg"
                          variant="ghost"
                          className="text-muted-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-muted hover:text-foreground"
                          aria-label={t("increaseQuantity")}
                        >
                          <Plus />
                        </IconButton>
                      </div>
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromCart(item.id, item.variantId)
                        }}
                        size="icon-lg"
                        variant="ghost"
                        className="text-muted-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-destructive-subtle hover:text-destructive"
                        aria-label={t("removeItem")}
                      >
                        <Trash />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
              {items.length > 4 && (
                <div className="px-2 py-1.5 text-center text-xs text-muted-foreground bg-muted">
                  +{items.length - 4} {t("moreItems")}
                </div>
              )}
            </div>

            <div className="px-3 py-2 bg-muted border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{t("subtotal")}</span>
                <span className="text-base font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex gap-1.5">
                <Button variant="outline" size="default" className="w-full flex-1" asChild>
                  <Link href="/cart">
                    {t("viewCart")}
                  </Link>
                </Button>
                <Button variant="cta" size="default" className="w-full flex-1" asChild>
                  <Link href="/checkout">
                    {t("checkout")}
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
