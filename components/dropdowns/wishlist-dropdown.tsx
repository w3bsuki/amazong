"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Heart, Package, Trash } from "@phosphor-icons/react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

import { useWishlist, type WishlistItem } from "@/components/providers/wishlist-context"
import { CountBadge } from "@/components/ui/count-badge"

function buildProductUrl(item: WishlistItem) {
  if (!item.username) return "#"
  return `/${item.username}/${item.slug || item.product_id}`
}

export function WishlistDropdown() {
  const { items, totalItems, removeFromWishlist, isLoading } = useWishlist()
  const t = useTranslations("WishlistDropdown")
  const tNav = useTranslations("Navigation")
  const locale = useLocale()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const displayItems = mounted ? totalItems : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "EUR",
    }).format(price)
  }

  const topItems = useMemo(() => items.slice(0, 4), [items])

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href="/account/wishlist" aria-label={`${tNav("wishlist")}${mounted && displayItems > 0 ? ` (${displayItems})` : ""}`}>
          <Button
            variant="ghost"
            size="icon-xl"
            className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative [&_svg]:size-6"
          >
            <span className="relative" aria-hidden="true">
              <Heart weight="regular" />
              {mounted && displayItems > 0 && (
                <CountBadge
                  count={displayItems}
                  className="absolute -top-1 -right-1 bg-destructive text-white ring-2 ring-header-bg h-4.5 min-w-4.5 px-1 text-[10px] shadow-sm"
                  aria-hidden="true"
                />
              )}
            </span>
          </Button>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-[380px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <Heart size={20} weight="regular" className="text-muted-foreground" />
            <h3 className="font-semibold text-base text-foreground">{t("title")}</h3>
            <span className="text-sm text-muted-foreground">
              ({totalItems} {totalItems === 1 ? t("item") : t("items")})
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">{t("loading")}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <Heart size={48} weight="light" className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm mb-4">{t("empty")}</p>
            <Link href="/search">
              <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                {t("startBrowsing")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              {topItems.map((item) => (
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
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeFromWishlist(item.product_id)
                    }}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    aria-label={t("remove")}
                  >
                    <Trash size={16} weight="regular" />
                  </button>
                </div>
              ))}
              {items.length > 4 && (
                <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
                  +{items.length - 4} {t("moreItems")}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted border-t border-border">
              <Link href="/account/wishlist" className="w-full">
                <Button className="w-full h-10 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                  {t("viewAll")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
