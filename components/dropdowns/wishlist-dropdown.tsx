"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Heart } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"

import { useWishlist, type WishlistItem } from "@/components/providers/wishlist-context"
import { CountBadge } from "@/components/shared/count-badge"
import { DropdownProductItem } from "@/components/shared/dropdown-product-item"

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
      currency: "EUR",
    }).format(price)
  }

  const topItems = useMemo(() => items.slice(0, 4), [items])

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href="/account/wishlist"
          className="block rounded-md outline-none focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`${tNav("wishlist")}${mounted && displayItems > 0 ? ` (${displayItems})` : ""}`}
        >
          <div
            className="inline-flex items-center justify-center border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:bg-header-hover relative size-11 [&_svg]:size-6 cursor-pointer"
          >
            <span className="relative" aria-hidden="true">
              <Heart weight="regular" />
              {mounted && displayItems > 0 && (
                <CountBadge
                  count={displayItems}
                  className="absolute -top-1 -right-1.5 bg-destructive text-destructive-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs"
                  aria-hidden="true"
                />
              )}
            </span>
          </div>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-72 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden shadow-dropdown"
        align="end"
        sideOffset={8}
        collisionPadding={10}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
          <div className="flex items-center gap-1.5">
            <Heart size={16} weight="regular" className="text-muted-foreground" />
            <h3 className="font-semibold text-sm text-foreground">{t("title")}</h3>
            <span className="text-xs text-muted-foreground">({totalItems})</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">{t("loading")}</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center">
            <Heart size={36} weight="light" className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm mb-3">{t("empty")}</p>
            <Link href="/search">
              <Button variant="cta" size="default" className="w-full">
                {t("startBrowsing")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-(--spacing-scroll-md) overflow-y-auto">
              {topItems.map((item) => (
                <DropdownProductItem
                  key={item.id}
                  item={{
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    href: buildProductUrl(item),
                  }}
                  formatPrice={formatPrice}
                  onRemove={() => removeFromWishlist(item.product_id)}
                  removeLabel={t("remove")}
                />
              ))}
              {items.length > 4 && (
                <div className="px-2 py-1.5 text-center text-xs text-muted-foreground bg-muted">
                  +{items.length - 4} {t("moreItems")}
                </div>
              )}
            </div>

            <div className="px-3 py-2 bg-muted border-t border-border">
              <Link href="/account/wishlist" className="w-full">
                <Button variant="cta" size="default" className="w-full">
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
