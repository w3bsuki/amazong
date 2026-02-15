"use client"

import { useTranslations } from "next-intl"
import { Megaphone, ArrowRight } from "@phosphor-icons/react"

import type { UIProduct } from "@/lib/types/products"
import { cn } from "@/lib/utils"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { Link } from "@/i18n/routing"

import { HomeSectionHeader } from "./home-section-header"

interface PromotedListingsStripProps {
  products: UIProduct[]
  maxItems?: number
  showHeader?: boolean
  includePromoTile?: boolean
  promotedCta?: {
    href?: string
    title: string
    subtitle?: string
    actionLabel: string
    eyebrow?: string
  }
  className?: string
}

export function PromotedListingsStrip({
  products,
  maxItems = 10,
  showHeader = true,
  includePromoTile = false,
  promotedCta,
  className,
}: PromotedListingsStripProps) {
  const tMobile = useTranslations("Home.mobile")
  const visibleProducts = products.slice(0, maxItems)

  if (visibleProducts.length === 0) return null

  const cardWidthClass = "w-(--spacing-home-card-column-w)"
  const promotedHref = "/search?promoted=true&sort=newest"
  const title = promotedCta?.title || tMobile("promoBannerTitle")
  const subtitle = promotedCta?.subtitle ?? tMobile("promoBannerSubtitle")
  const actionLabel = promotedCta?.actionLabel || tMobile("seeAll")
  const eyebrow = promotedCta?.eyebrow || tMobile("promoBannerEyebrow")
  const ctaHref = promotedCta?.href || promotedHref

  /* When the promo tile is present it IS the section intro — skip the redundant header */
  const showSectionHeader = showHeader && !includePromoTile

  return (
    <section data-testid="home-section-promoted" className={cn("pt-(--spacing-home-section-gap)", className)}>
      {showSectionHeader ? (
        <>
          <HomeSectionHeader
            variant="promoted"
            title={title}
            href={ctaHref}
            actionLabel={actionLabel}
            badgeLabel={eyebrow}
          />
          <p className="px-(--spacing-home-inset) text-xs text-muted-foreground line-clamp-2">
            {subtitle}
          </p>
        </>
      ) : null}

      <div
        data-testid="home-section-promoted-strip"
        className={cn("overflow-x-auto scroll-smooth no-scrollbar", showSectionHeader ? "pt-2 pb-1" : "pb-1")}
      >
        <div className="flex snap-x snap-mandatory gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-1">
          {includePromoTile ? (
            <div className={cn("shrink-0 snap-start", cardWidthClass)}>
              <Link
                href={ctaHref}
                data-testid="home-promoted-cta-tile"
                aria-label={`${title}. ${actionLabel}`}
                className={cn(
                  "group block h-full min-h-(--spacing-home-cta-tile-min-h) min-w-0 rounded-3xl focus-visible:ring-2 focus-visible:ring-focus-ring",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <div className="flex h-full flex-col rounded-3xl border border-home-promoted-cta-border bg-home-promoted-cta-surface p-3">
                  <div className="inline-flex min-h-(--control-compact) items-center gap-1 rounded-full text-2xs font-semibold uppercase tracking-wide text-home-promoted-cta-eyebrow">
                    <Megaphone size={11} weight="fill" aria-hidden="true" />
                    <span className="truncate">{eyebrow}</span>
                  </div>

                  <div className="flex flex-1 flex-col justify-center pt-2.5">
                    <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight text-home-promoted-cta-text">
                      {title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-normal text-home-promoted-cta-subtitle">
                      {subtitle}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "inline-flex min-h-(--control-default) items-center justify-center gap-1 rounded-2xl border border-home-promoted-cta-button-border bg-home-promoted-cta-button-surface px-3 text-xs font-semibold text-home-promoted-cta-button-text",
                      "transition-transform duration-normal ease-smooth group-active:scale-98"
                    )}
                  >
                    {actionLabel}
                    <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>
          ) : null}

          {visibleProducts.map((product, index) => (
            <div key={product.id} className={cn("shrink-0 snap-start", cardWidthClass)}>
              <MobileProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                createdAt={product.createdAt ?? null}
                originalPrice={product.listPrice ?? null}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                {...(product.freeShipping === true ? { freeShipping: true } : {})}
                {...(product.isBoosted ? { isBoosted: true } : {})}
                {...(product.boostExpiresAt ? { boostExpiresAt: product.boostExpiresAt } : {})}
                index={index}
                slug={product.slug ?? null}
                username={product.storeSlug ?? null}
                sellerId={product.sellerId ?? null}
                {...((product.sellerName || product.storeSlug)
                  ? { sellerName: product.sellerName || product.storeSlug || "" }
                  : {})}
                sellerAvatarUrl={product.sellerAvatarUrl || null}
                sellerTier={product.sellerTier ?? "basic"}
                sellerVerified={Boolean(product.sellerVerified)}
                {...(product.condition ? { condition: product.condition } : {})}
                {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                {...(product.location ? { location: product.location } : {})}
                titleLines={1}
                layout="rail"
                showWishlistAction={false}
                showPromotedBadge={false}
                className="rounded-2xl border-home-promoted-border bg-home-promoted"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export type { PromotedListingsStripProps }
