"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import { ShoppingCart, Package, Minus, Plus, Trash } from "@phosphor-icons/react"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { CountBadge } from "@/components/ui/count-badge"

export function CartDropdown() {
  const { items, totalItems, subtotal, removeFromCart, updateQuantity } = useCart()
  const t = useTranslations("CartDropdown")
  const tNav = useTranslations("Navigation")
  const locale = useLocale()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const displayItems = mounted ? totalItems : 0

  // Build SEO-friendly product URL
  const buildProductUrl = useCallback((item: CartItem) => {
    if (!item.storeSlug) return "#"
    return `/${item.storeSlug}/${item.slug || item.id}`
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "EUR",
    }).format(price)
  }

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href="/cart" className="block" aria-label={`${tNav("cart")}${mounted && displayItems > 0 ? ` (${displayItems} items)` : ""}`}>
          <div
            className="inline-flex items-center justify-center border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative size-10 [&_svg]:size-6 cursor-pointer"
          >
            <span className="relative" aria-hidden="true">
              <ShoppingCart weight="regular" />
              {mounted && displayItems > 0 && (
                <CountBadge
                  count={displayItems}
                  className="absolute -top-1 -right-1 bg-destructive text-white ring-2 ring-header-bg h-4.5 min-w-4.5 px-1 text-2xs shadow-sm"
                  aria-hidden="true"
                />
              )}
            </span>
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[380px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden shadow-md"
        align="end"
        sideOffset={8}
        collisionPadding={10}
      >
        <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} weight="regular" className="text-muted-foreground" />
            <h3 className="font-semibold text-base text-foreground">{t("title")}</h3>
            <span className="text-sm text-muted-foreground">
              ({totalItems} {totalItems === 1 ? t("item") : t("items")})
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart size={48} weight="light" className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm mb-4">{t("empty")}</p>
            <Link href="/search">
              <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                {t("startShopping")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              {items.slice(0, 4).map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border-b border-border hover:bg-muted">
                  <Link href={buildProductUrl(item)} className="shrink-0">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package size={24} weight="regular" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={buildProductUrl(item)}
                      className="text-sm font-normal text-foreground hover:text-brand line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
                      <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1)
                          } else {
                            removeFromCart(item.id)
                          }
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Minus size={12} weight="bold" />
                      </button>
                      <span className="text-xs font-medium text-foreground min-w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          updateQuantity(item.id, item.quantity + 1)
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Plus size={12} weight="bold" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromCart(item.id)
                        }}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive ml-auto"
                      >
                        <Trash size={14} weight="regular" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length > 4 && (
                <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
                  +{items.length - 4} {t("moreItems")}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{t("subtotal")}</span>
                <span className="text-lg font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex gap-2">
                <Link href="/cart" className="flex-1">
                  <Button variant="outline" className="w-full h-10 text-sm">
                    {t("viewCart")}
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1">
                  <Button className="w-full h-10 text-sm bg-cta-buy-now hover:bg-cta-buy-now/90 text-foreground">
                    {t("checkout")}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
