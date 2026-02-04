"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import { ShoppingCart, Package, Minus, Plus, Trash } from "@phosphor-icons/react"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { CountBadge } from "@/components/shared/count-badge"

export function CartDropdown() {
  const { items, totalItems, isReady, subtotal, removeFromCart, updateQuantity } = useCart()
  const t = useTranslations("CartDropdown")
  const tNav = useTranslations("Navigation")
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const displayItems = mounted && isReady ? totalItems : 0

  const buildProductUrl = useCallback((item: CartItem) => {
    const sellerSlug = item.username ?? item.storeSlug
    if (!sellerSlug) return "#"
    return `/${sellerSlug}/${item.slug || item.id}`
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href="/cart"
          className="block rounded-md outline-none focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`${tNav("cart")}${mounted && displayItems > 0 ? ` (${displayItems} ${displayItems === 1 ? t("item") : t("items")})` : ""}`}
        >
          <div className="inline-flex items-center justify-center border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:bg-header-hover relative size-10 [&_svg]:size-6 cursor-pointer">
            <span className="relative" aria-hidden="true">
              <ShoppingCart weight="regular" />
              {mounted && displayItems > 0 && (
                <CountBadge
                  count={displayItems}
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
            <ShoppingCart size={16} weight="regular" className="text-muted-foreground" />
            <h3 className="font-semibold text-sm text-foreground">{t("title")}</h3>
            <span className="text-xs text-muted-foreground">({displayItems})</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-4 text-center">
            <ShoppingCart size={36} weight="light" className="text-muted-foreground/30 mx-auto mb-2" />
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
                <div key={`${item.id}:${item.variantId ?? ""}`} className="flex gap-2 p-2 border-b border-border hover:bg-hover active:bg-active">
                  <Link href={buildProductUrl(item)} className="shrink-0">
                    <div className="size-12 bg-muted rounded-md overflow-hidden border border-border">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-muted-foreground">
                          <Package size={18} weight="regular" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={buildProductUrl(item)}
                      className="text-sm text-foreground hover:text-primary line-clamp-2 leading-snug"
                    >
                      {item.title}
                    </Link>
                    {item.variantName && (
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {item.variantName}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
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
                          className="hover:bg-muted text-muted-foreground hover:text-foreground"
                          aria-label={t("decreaseQuantity")}
                        >
                          <Minus weight="bold" />
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
                          className="hover:bg-muted text-muted-foreground hover:text-foreground"
                          aria-label={t("increaseQuantity")}
                        >
                          <Plus weight="bold" />
                        </IconButton>
                      </div>
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromCart(item.id, item.variantId)
                        }}
                        size="icon-lg"
                        variant="ghost"
                        className="hover:bg-destructive-subtle text-muted-foreground hover:text-destructive"
                        aria-label={t("removeItem")}
                      >
                        <Trash weight="regular" />
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
              <div className="flex gap-2">
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
