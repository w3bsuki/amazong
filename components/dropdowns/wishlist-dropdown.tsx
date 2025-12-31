"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Heart } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"

import { useWishlist, type WishlistItem } from "@/components/providers/wishlist-context"
import { CountBadge } from "@/components/ui/count-badge"
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
      currency: locale === "bg" ? "BGN" : "EUR",
    }).format(price)
  }

  const topItems = useMemo(() => items.slice(0, 4), [items])

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href="/account/wishlist" className="block" aria-label={`${tNav("wishlist")}${mounted && displayItems > 0 ? ` (${displayItems})` : ""}`}>
          <div
            className="inline-flex items-center justify-center border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative size-10 [&_svg]:size-6 cursor-pointer"
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
