"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  CaretLeft,
  CaretRight,
  ArrowRight,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react"
import { CategoryBrowseCard } from "@/components/category/category-browse-card"

export type DemoCategory = {
  id: string
  name: string
  name_bg: string
  slug: string
  icon: PhosphorIcon
}

function getName(cat: DemoCategory, locale: "en" | "bg") {
  return locale === "bg" ? cat.name_bg : cat.name
}

const tones = [
  {
    icon: "text-brand",
    dot: "bg-brand",
    shell: "bg-brand/10 border-brand/20",
    surface: "bg-linear-to-br from-brand/20 to-brand/5",
    ring: "ring-brand/15",
    solid: "bg-linear-to-br from-brand to-brand-dark",
  },
  {
    icon: "text-info",
    dot: "bg-info",
    shell: "bg-info/10 border-info/20",
    surface: "bg-linear-to-br from-info/20 to-info/5",
    ring: "ring-info/15",
    solid: "bg-linear-to-br from-info to-brand",
  },
  {
    icon: "text-success",
    dot: "bg-success",
    shell: "bg-success/10 border-success/20",
    surface: "bg-linear-to-br from-success/20 to-success/5",
    ring: "ring-success/15",
    solid: "bg-linear-to-br from-success to-info",
  },
  {
    icon: "text-warning",
    dot: "bg-warning",
    shell: "bg-warning/12 border-warning/20",
    surface: "bg-linear-to-br from-warning/22 to-warning/6",
    ring: "ring-warning/15",
    solid: "bg-linear-to-br from-warning to-error",
  },
  {
    icon: "text-error",
    dot: "bg-error",
    shell: "bg-error/10 border-error/20",
    surface: "bg-linear-to-br from-error/20 to-error/5",
    ring: "ring-error/15",
    solid: "bg-linear-to-br from-error to-brand-dark",
  },
] as const

function toneAt(index: number) {
  return tones[index % tones.length]
}

/**
 * MOBILE VARIANTS (touch-first)
 */

export function MobileCategoryVariant1_SnapCircles({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group shrink-0 snap-start",
                "w-[78px]",
                "touch-action-manipulation"
              )}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className={cn(
                      "size-16 rounded-full p-0.5",
                      "bg-linear-to-br from-foreground/10 to-foreground/0",
                      "group-active:scale-95 transition-transform"
                    )}
                  >
                    <div
                      className={cn(
                        "size-full rounded-full border",
                        tone.shell,
                        "ring-1 ring-inset",
                        tone.ring,
                        "flex items-center justify-center"
                      )}
                    >
                      <div
                        className={cn(
                          "size-[52px] rounded-full",
                          "border border-border/40",
                          "flex items-center justify-center",
                          tone.surface
                        )}
                        aria-hidden="true"
                      >
                        <Icon className={cn("size-6", tone.icon)} weight="duotone" />
                      </div>
                    </div>
                  </div>

                  {/* tiny highlight dot */}
                  <div
                    className={cn(
                      "absolute -right-0.5 -top-0.5",
                      "size-4 rounded-full",
                      "bg-background border border-border",
                      "flex items-center justify-center"
                    )}
                    aria-hidden="true"
                  >
                    <div className={cn("size-2 rounded-full", tone.dot)} />
                  </div>
                </div>

                <div className={cn("mt-2 px-1", "text-xs font-medium text-foreground text-center leading-tight line-clamp-2")}>
                  {getName(cat, locale)}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function MobileCategoryVariant2_GridCircles({
  categories,
  locale,
  className,
  columns: _columns = 4,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
  columns?: 3 | 4
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group snap-start shrink-0",
                "w-[156px]",
                "rounded-2xl border border-border bg-card overflow-hidden",
                "touch-action-manipulation",
                "active:bg-accent/40"
              )}
            >
              <div className={cn("h-12 px-3 flex items-center justify-between", tone.surface)}>
                <div
                  className={cn(
                    "size-8 rounded-xl",
                    "bg-background/70 border border-border/50",
                    "flex items-center justify-center"
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("size-4.5", tone.icon)} weight="fill" />
                </div>
                <span className={cn("text-2xs font-semibold", tone.icon)}>Featured</span>
              </div>

              <div className="px-3 py-3">
                <div className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                  {getName(cat, locale)}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-2xs text-muted-foreground">Shop now</span>
                  <ArrowRight className={cn("size-3.5", tone.icon)} weight="bold" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function MobileCategoryVariant2_Final({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <CategoryBrowseCard
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              title={getName(cat, locale)}
              icon={Icon}
              badge="Featured"
              meta="Shop"
              tone={{ icon: tone.icon, shell: tone.shell }}
              className={cn("snap-start shrink-0", "w-44")}
            />
          )
        })}
      </div>
    </div>
  )
}

export function MobileCategoryVariant3_CompactCards({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group",
                "snap-start shrink-0",
                "w-[170px] h-40",
                "rounded-2xl overflow-hidden",
                "text-white",
                tone.solid,
                "relative",
                "touch-action-manipulation",
                "active:opacity-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <Icon
                className="absolute -bottom-6 -right-6 size-24 text-white/15"
                weight="fill"
                aria-hidden="true"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" aria-hidden="true" />

              <div className="relative p-4 h-full flex flex-col">
                <div className={cn("size-9 rounded-full bg-white/15 border border-white/20", "flex items-center justify-center")}
                >
                  <Icon className="size-5 text-white" weight="bold" />
                </div>

                <div className="mt-auto">
                  <div className="text-sm font-bold leading-tight line-clamp-2">{getName(cat, locale)}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/90">
                    Shop <ArrowRight className="size-3.5" weight="bold" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function MobileCategoryVariant3_Final({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group",
                "snap-start shrink-0",
                "w-44 h-40",
                "rounded-2xl overflow-hidden",
                "bg-card border border-border",
                "ring-1 ring-inset ring-border/25",
                "touch-action-manipulation",
                "active:bg-accent/40 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "size-10 rounded-xl",
                        "border",
                        tone.shell,
                        "flex items-center justify-center",
                        "group-active:scale-95 transition-transform"
                      )}
                      aria-hidden="true"
                    >
                      <Icon className={cn("size-5", tone.icon)} weight="duotone" />
                    </div>
                    <span className="text-2xs font-semibold text-muted-foreground bg-muted/20 border border-border/60 px-2 py-0.5 rounded-full">
                      Top picks
                    </span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground opacity-70" weight="bold" aria-hidden="true" />
                </div>

                <div className="mt-auto">
                  <div className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                    {getName(cat, locale)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Shop</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function MobileCategoryVariant4_PillChips({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-2 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group shrink-0 snap-start",
                "h-10 pl-3 pr-4 rounded-full",
                "border",
                tone.shell,
                "flex items-center gap-2",
                "touch-action-manipulation",
                "active:bg-accent transition-colors"
              )}
            >
              <span className={cn("size-6 rounded-full", tone.surface, "border border-border/40", "flex items-center justify-center")} aria-hidden="true">
                <Icon className={cn("size-3.5", tone.icon)} weight="fill" />
              </span>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {getName(cat, locale)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function MobileCategoryVariant5_ListRows({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div
        className={cn(
          "grid grid-flow-col auto-cols-[160px]",
          "grid-rows-2 gap-3",
          "overflow-x-auto no-scrollbar",
          "pb-4 -mx-4 px-4",
          "snap-x snap-mandatory scroll-pl-4"
        )}
      >
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group snap-start",
                "rounded-2xl border border-border bg-card",
                "p-3",
                "touch-action-manipulation",
                "hover:bg-accent/20",
                "active:bg-accent/40 transition-colors"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-10 rounded-xl",
                    "border",
                    tone.shell,
                    "flex items-center justify-center shrink-0"
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("size-5", tone.icon)} weight="duotone" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                    {getName(cat, locale)}
                  </div>
                  <div className="mt-0.5 text-2xs text-muted-foreground">Top picks</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={cn("text-2xs font-semibold", tone.icon)}>Explore</span>
                <ArrowRight className={cn("size-3.5", tone.icon)} weight="bold" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function MobileCategoryVariant5_Final({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div
        className={cn(
          "grid grid-flow-col auto-cols-[168px]",
          "grid-rows-2 gap-3",
          "overflow-x-auto no-scrollbar",
          "pb-4 -mx-4 px-4",
          "snap-x snap-mandatory scroll-pl-4"
        )}
      >
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group snap-start",
                "rounded-2xl border border-border bg-card",
                "ring-1 ring-inset ring-border/25",
                "p-3",
                "touch-action-manipulation",
                "hover:bg-accent/20",
                "active:bg-accent/40 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-10 rounded-xl",
                    "border",
                    tone.shell,
                    "ring-1 ring-inset ring-border/25",
                    "flex items-center justify-center shrink-0"
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("size-5", tone.icon)} weight="duotone" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                    {getName(cat, locale)}
                  </div>
                  <div className="mt-0.5 text-2xs text-muted-foreground">Top picks</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xs font-semibold text-foreground">Explore</span>
                <ArrowRight className="size-4 text-muted-foreground" weight="bold" aria-hidden="true" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/**
 * DESKTOP VARIANTS (hover + density)
 */

export function DesktopCategoryVariant1_TileGrid({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group",
                "rounded-xl border border-border bg-card",
                "px-4 py-3",
                "flex items-center gap-3",
                "hover:bg-accent/30 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div
                className={cn(
                  "size-10 rounded-lg",
                  "border",
                  tone.shell,
                  "ring-1 ring-inset",
                  tone.ring,
                  "flex items-center justify-center"
                )}
              >
                <Icon className={cn("size-5", tone.icon)} weight="duotone" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground truncate">
                  {getName(cat, locale)}
                </div>
                <div className="text-xs text-muted-foreground truncate">Browse now</div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" weight="bold" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function DesktopCategoryVariant2_SidebarList({
  categories,
  locale,
  activeSlug,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  activeSlug?: string
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="text-sm font-semibold text-foreground">Categories</div>
        </div>
        <div className="p-2">
          {categories.map((cat, index) => {
            const Icon = cat.icon
            const isActive = activeSlug ? activeSlug === cat.slug : false
            const tone = toneAt(index)
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "group flex items-center gap-3",
                  "px-3 py-2 rounded-lg",
                  "hover:bg-accent/40 transition-colors",
                  isActive && "bg-accent/50"
                )}
              >
                <div
                  className={cn(
                    "size-9 rounded-lg",
                    "border",
                    tone.shell,
                    "ring-1 ring-inset",
                    tone.ring,
                    "flex items-center justify-center"
                  )}
                >
                  <Icon className={cn("size-4.5", tone.icon)} weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium truncate", isActive ? "text-foreground" : "text-foreground/90")}>
                    {getName(cat, locale)}
                  </div>
                </div>
                <CaretRight className={cn("size-4", isActive ? "text-foreground" : "text-muted-foreground")}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function DesktopCategoryVariant3_MegaCards({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = toneAt(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group",
                "rounded-2xl border border-border bg-card",
                "p-5",
                "hover:bg-accent/20 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "size-12 rounded-xl",
                    "border",
                    tone.shell,
                    "ring-1 ring-inset",
                    tone.ring,
                    "flex items-center justify-center shrink-0"
                  )}
                >
                  <Icon className={cn("size-6", tone.icon)} weight="duotone" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-foreground truncate">
                    {getName(cat, locale)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    Explore top picks, new arrivals, and best sellers.
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    Browse <ArrowRight className="size-4" weight="bold" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function DesktopCategoryVariant4_CompactTable({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  return (
    <div className={cn("px-4", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border text-xs font-medium text-muted-foreground">
          <div className="col-span-7">Category</div>
          <div className="col-span-3 text-right">Items</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        <div className="divide-y divide-border">
          {categories.map((cat, index) => {
            const Icon = cat.icon
            const count = 1200 + index * 85
            const tone = toneAt(index)
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "grid grid-cols-12 gap-2",
                  "px-4 py-3",
                  "hover:bg-accent/30 transition-colors"
                )}
              >
                <div className="col-span-7 flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-9 rounded-lg",
                      "border",
                      tone.shell,
                      "ring-1 ring-inset",
                      tone.ring,
                      "flex items-center justify-center shrink-0"
                    )}
                  >
                    <Icon className={cn("size-4.5", tone.icon)} weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {getName(cat, locale)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">Top categories</div>
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end text-sm font-medium text-foreground">
                  {count.toLocaleString()}
                </div>
                <div className="col-span-2 flex items-center justify-end text-sm font-medium text-muted-foreground">
                  View
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function DesktopCategoryVariant5_ScrollRail({
  categories,
  locale,
  className,
}: {
  categories: DemoCategory[]
  locale: "en" | "bg"
  className?: string
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = React.useState(false)
  const [canRight, setCanRight] = React.useState(true)

  const check = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  React.useEffect(() => {
    check()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", check)
    window.addEventListener("resize", check)
    return () => {
      el.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [check])

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" })
  }

  return (
    <div className={cn("px-4", className)}>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar gap-3 pb-2 snap-x snap-mandatory scroll-smooth"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon
            const tone = toneAt(index)
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "group shrink-0 snap-start",
                  "w-[220px]",
                  "rounded-xl border border-border bg-card",
                  "px-4 py-3",
                  "hover:bg-accent/25 transition-colors"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-11 rounded-lg",
                      "border",
                      tone.shell,
                      "ring-1 ring-inset",
                      tone.ring,
                      "flex items-center justify-center"
                    )}
                  >
                    <Icon className={cn("size-5", tone.icon)} weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {getName(cat, locale)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">Recommended</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollBy("left")}
          className={cn(
            "hidden md:flex",
            "absolute left-0 top-1/2 -translate-y-1/2",
            "size-10 rounded-full",
            "bg-background border border-border",
            "items-center justify-center",
            "hover:bg-accent/30 transition-colors",
            !canLeft && "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <CaretLeft className="size-5 text-muted-foreground" weight="bold" />
        </button>

        <button
          type="button"
          onClick={() => scrollBy("right")}
          className={cn(
            "hidden md:flex",
            "absolute right-0 top-1/2 -translate-y-1/2",
            "size-10 rounded-full",
            "bg-background border border-border",
            "items-center justify-center",
            "hover:bg-accent/30 transition-colors",
            !canRight && "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <CaretRight className="size-5 text-muted-foreground" weight="bold" />
        </button>
      </div>
    </div>
  )
}
