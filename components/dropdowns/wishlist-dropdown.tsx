import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Heart } from "lucide-react";

import { useEffect, useMemo, useState } from "react"

import { useWishlist, type WishlistItem } from "@/components/providers/wishlist-context"
import { DropdownProductItem } from "@/components/shared/dropdown-product-item"
import { HeaderDropdown } from "@/components/shared/header-dropdown"
import { HeaderDropdownFooter } from "@/components/shared/header-dropdown-shell"
import { HeaderIconTrigger } from "@/components/shared/header-icon-trigger"

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
  const itemCountSuffix = mounted && displayItems > 0 ? ` (${displayItems})` : ""

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const topItems = useMemo(() => items.slice(0, 4), [items])

  return (
    <HeaderDropdown
      triggerHref="/account/wishlist"
      ariaLabel={`${tNav("wishlist")}${itemCountSuffix}`}
      widthClassName="w-72"
      trigger={
        <HeaderIconTrigger
          icon={<Heart />}
          badgeCount={mounted ? displayItems : 0}
          badgeClassName="absolute -top-1 -right-1.5 bg-wishlist-active text-primary-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs"
        />
      }
    >
        <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
          <div className="flex items-center gap-1.5">
            <Heart size={16} className="text-muted-foreground" />
            <h3 className="font-semibold text-sm text-foreground">{t("title")}</h3>
            <span className="text-xs text-muted-foreground" aria-hidden="true">({totalItems})</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">{t("loading")}</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center">
            <Heart size={36} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm mb-3">{t("empty")}</p>
            <Button asChild variant="cta" size="default" className="w-full">
              <Link href="/search">
                {t("startBrowsing")}
              </Link>
            </Button>
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

            <HeaderDropdownFooter className="px-3 py-2">
              <Button asChild variant="cta" size="default" className="w-full">
                <Link href="/account/wishlist">
                  {t("viewAll")}
                </Link>
              </Button>
            </HeaderDropdownFooter>
          </>
        )}
    </HeaderDropdown>
  )
}
