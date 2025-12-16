"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryIconForSlug } from "@/lib/category-icons"
import { CaretRight } from "@phosphor-icons/react"

export type ApiCategory = {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
}

function getName(cat: ApiCategory, locale: "en" | "bg") {
  return locale === "bg" && cat.name_bg ? cat.name_bg : cat.name
}

function CardShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card",
        "ring-1 ring-inset ring-border/20",
        className
      )}
    >
      {children}
    </div>
  )
}

// Shared layouts
function MobileRail({
  children,
  rows = 1,
}: {
  children: React.ReactNode
  rows?: 1 | 2
}) {
  return (
    <div className="md:hidden px-4">
      {rows === 1 ? (
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 scroll-pl-4 overscroll-x-contain snap-x snap-mandatory">
          {children}
        </div>
      ) : (
        <div className="grid grid-flow-col auto-cols-max grid-rows-2 gap-x-3 gap-y-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-pl-4 overscroll-x-contain">
          {children}
        </div>
      )}
    </div>
  )
}

function DesktopGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:block px-4">
      <div className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">{children}</div>
    </div>
  )
}

/**
 * 1) Marketplace Classic Circles
 * - Minimal border, clean icon, short label.
 */
export function GPT1_ClassicCircles({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Item = ({ cat }: { cat: ApiCategory }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group snap-start shrink-0",
          "w-24 py-1 touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
        )}
      >
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "size-16 rounded-full",
              "bg-card border border-border",
              "ring-1 ring-inset ring-border/20",
              "flex items-center justify-center",
              "transition-colors",
              "group-hover:bg-accent/20 group-active:bg-accent/30"
            )}
            aria-hidden="true"
          >
            <div
              className={cn(
                "size-[52px] rounded-full",
                "bg-background border border-border/60",
                "flex items-center justify-center"
              )}
            >
              <Icon className="size-6 text-link" weight="regular" />
            </div>
          </div>
          <div className="mt-2 min-h-8 px-1 text-xs font-semibold text-foreground/90 group-hover:text-foreground text-center leading-tight line-clamp-2 transition-colors">
            {getName(cat, locale)}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <MobileRail>
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} />
        ))}
      </MobileRail>
      <DesktopGrid>
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} />
        ))}
      </DesktopGrid>
    </>
  )
}

/**
 * 2) Halo Circles (ultra-thin)
 * - Slightly more premium ring, still neutral.
 */
export function GPT2_HaloCircles({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Item = ({ cat }: { cat: ApiCategory }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group snap-start shrink-0",
          "w-24 py-1 touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
        )}
      >
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "size-16 rounded-full",
              "bg-background border border-border",
              "ring-1 ring-inset ring-border/30",
              "flex items-center justify-center",
              "transition-[background-color,border-color]",
              "group-hover:bg-accent/20"
            )}
            aria-hidden="true"
          >
            <div
              className={cn(
                "size-[52px] rounded-full",
                "bg-card border border-border/60",
                "ring-1 ring-inset ring-border/15",
                "flex items-center justify-center"
              )}
            >
              <Icon className="size-6 text-link" weight="duotone" />
            </div>
          </div>
          <div className="mt-2 min-h-8 px-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground text-center leading-tight line-clamp-2 transition-colors">
            {getName(cat, locale)}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <MobileRail>
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} />
        ))}
      </MobileRail>
      <DesktopGrid>
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} />
        ))}
      </DesktopGrid>
    </>
  )
}

/**
 * 3) Squircle Icon Tiles
 * - Dense, marketplace-friendly, great for landing sections.
 */
export function GPT3_SquircleTiles({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Item = ({ cat, compact }: { cat: ApiCategory; compact?: boolean }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group snap-start shrink-0",
          compact ? "w-40" : "w-full",
          "rounded-2xl border border-border bg-card",
          "ring-1 ring-inset ring-border/20",
          "px-3 py-3",
          "hover:bg-accent/20 active:bg-accent/30",
          "touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-10 rounded-xl",
              "bg-muted/30 border border-border/60",
              "flex items-center justify-center"
            )}
            aria-hidden="true"
          >
            <Icon className="size-5 text-link" weight="fill" />
          </div>
          <div className="min-w-0">
            <div className="min-h-9 text-sm font-semibold text-foreground leading-snug line-clamp-2">
              {getName(cat, locale)}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <MobileRail>
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} compact />
        ))}
      </MobileRail>
      <div className="hidden md:block px-4">
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Item key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * 4) Minimal Pill Chips
 * - Best for mobile top-of-home navigation.
 */
export function GPT4_MinimalChips({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Chip = ({ cat }: { cat: ApiCategory }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group snap-start shrink-0",
          "inline-flex items-center gap-2",
          "h-9 px-3 rounded-full",
          "border border-border bg-card",
          "ring-1 ring-inset ring-border/15",
          "hover:bg-accent/20 active:bg-accent/30",
          "touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <Icon className="size-4.5 text-link" weight="fill" />
        <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors line-clamp-1">
          {getName(cat, locale)}
        </span>
      </Link>
    )
  }

  return (
    <>
      <div className="px-4">
        <div className="flex flex-wrap gap-2 md:hidden">
          {categories.map(cat => (
            <Chip key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
      <div className="hidden md:block px-4">
        <CardShell className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Chip key={cat.slug} cat={cat} />
            ))}
          </div>
        </CardShell>
      </div>
    </>
  )
}

/**
 * 5) Compact Browse Cards
 * - Clean card grid (landing-page friendly).
 */
export function GPT5_CompactCards({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Item = ({ cat, compact }: { cat: ApiCategory; compact?: boolean }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group",
          "rounded-2xl border border-border bg-card",
          "ring-1 ring-inset ring-border/20",
          "px-3.5 py-3.5",
          "hover:bg-accent/20 active:bg-accent/30 transition-colors",
          "touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          compact ? "snap-start shrink-0 w-44" : "w-full"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "shrink-0",
              "size-10 rounded-xl",
              "bg-muted/30 border border-border/60",
              "flex items-center justify-center"
            )}
            aria-hidden="true"
          >
            <Icon className="size-5 text-link" weight="fill" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 text-sm font-semibold text-foreground tracking-tight leading-snug line-clamp-2">
                {getName(cat, locale)}
              </div>
              <CaretRight
                className="mt-0.5 size-4 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors"
                weight="bold"
              />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <MobileRail rows={1}>
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} compact />
        ))}
      </MobileRail>
      <div className="hidden md:block px-4">
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Item key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * 6) Minimal Row List
 * - Great for dense “All categories” sections.
 */
export function GPT6_MinimalRows({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Row = ({ cat }: { cat: ApiCategory }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group",
          "flex items-center justify-between gap-3",
          "rounded-xl border border-border bg-card",
          "ring-1 ring-inset ring-border/20",
          "px-3 py-3",
          "hover:bg-accent/20 active:bg-accent/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "size-9 rounded-lg",
              "bg-muted/30 border border-border/60",
              "flex items-center justify-center"
            )}
            aria-hidden="true"
          >
            <Icon className="size-5 text-link" weight="fill" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground line-clamp-1">
              {getName(cat, locale)}
            </div>
          </div>
        </div>
        <CaretRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" weight="bold" />
      </Link>
    )
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(cat => (
          <Row key={cat.slug} cat={cat} />
        ))}
      </div>
    </div>
  )
}

/**
 * 7) Circle + Caption (dense)
 * - Small noted circles; fits 24 categories without feeling heavy.
 */
export function GPT7_DenseCircles({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Item = ({ cat }: { cat: ApiCategory }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group",
          "flex flex-col items-center",
          "rounded-xl",
          "touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <div
          className={cn(
            "size-12 rounded-full",
            "bg-card border border-border",
            "ring-1 ring-inset ring-border/20",
            "flex items-center justify-center",
            "group-hover:bg-accent/20"
          )}
          aria-hidden="true"
        >
          <Icon className="size-5 text-link" weight="regular" />
        </div>
        <div className="mt-2 text-[11px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight line-clamp-2 max-w-[88px] transition-colors">
          {getName(cat, locale)}
        </div>
      </Link>
    )
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-4">
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} />
        ))}
      </div>
    </div>
  )
}

/**
 * 8) Minimal Icon-Only Strip
 * - Very compact; ideal for “above the fold” rails.
 */
export function GPT8_IconStrip({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Item = ({ cat }: { cat: ApiCategory }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group snap-start shrink-0",
          "w-24",
          "rounded-2xl border border-border bg-card",
          "ring-1 ring-inset ring-border/20",
          "px-3 py-2.5",
          "hover:bg-accent/20 active:bg-accent/30 transition-colors",
          "touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-8 rounded-xl",
              "bg-muted/30 border border-border/60",
              "flex items-center justify-center"
            )}
            aria-hidden="true"
          >
            <Icon className="size-4.5 text-link" weight="fill" />
          </div>
          <div className="min-w-0 min-h-8 text-xs font-semibold text-foreground leading-tight line-clamp-2">
            {getName(cat, locale)}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <MobileRail rows={1}>
        {categories.map(cat => (
          <Item key={cat.slug} cat={cat} />
        ))}
      </MobileRail>
      <div className="hidden md:block px-4">
        <CardShell className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat.slug} className="w-40">
                <Item cat={cat} />
              </div>
            ))}
          </div>
        </CardShell>
      </div>
    </>
  )
}

/**
 * 9) Minimal Tiles Grid
 * - Balanced, very “marketplace” without any color noise.
 */
export function GPT9_TilesGrid({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Tile = ({ cat }: { cat: ApiCategory }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group",
          "rounded-2xl border border-border bg-card",
          "ring-1 ring-inset ring-border/20",
          "p-3",
          "hover:bg-accent/20 active:bg-accent/30",
          "touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "size-9 rounded-xl",
              "bg-muted/30 border border-border/60",
              "flex items-center justify-center"
            )}
            aria-hidden="true"
          >
            <Icon className="size-5 text-link" weight="fill" />
          </div>
          <CaretRight className="size-4 text-muted-foreground" weight="bold" />
        </div>
        <div className="mt-2 text-sm font-semibold text-foreground leading-snug line-clamp-2">
          {getName(cat, locale)}
        </div>
      </Link>
    )
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {categories.map(cat => (
          <Tile key={cat.slug} cat={cat} />
        ))}
      </div>
    </div>
  )
}

/**
 * 10) Featured Category Cards
 * - Slightly larger “hero” cards for desktop sections.
 */
export function GPT10_FeaturedCards({
  categories,
  locale,
}: {
  categories: ApiCategory[]
  locale: "en" | "bg"
}) {
  const Card = ({ cat, compact }: { cat: ApiCategory; compact?: boolean }) => {
    const Icon = getCategoryIconForSlug(cat.slug)
    return (
      <Link
        href={`/categories/${cat.slug}`}
        className={cn(
          "group",
          "rounded-2xl border border-border bg-card",
          "ring-1 ring-inset ring-border/20",
          "p-4",
          "hover:bg-accent/20 active:bg-accent/30",
          "touch-action-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          compact ? "snap-start shrink-0 w-56" : "w-full"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
              {getName(cat, locale)}
            </div>
            <div className="mt-1 text-2xs text-muted-foreground">Browse listings</div>
          </div>
          <div
            className={cn(
              "shrink-0",
              "size-10 rounded-xl",
              "bg-muted/30 border border-border/60",
              "flex items-center justify-center"
            )}
            aria-hidden="true"
          >
            <Icon className="size-5 text-link" weight="fill" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <MobileRail rows={1}>
        {categories.map(cat => (
          <Card key={cat.slug} cat={cat} compact />
        ))}
      </MobileRail>
      <div className="hidden md:block px-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Card key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </>
  )
}
