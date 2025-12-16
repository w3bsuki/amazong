"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { type DemoCategory } from "@/components/demo/category-variants"
import { ArrowRight } from "@phosphor-icons/react"

function getName(cat: DemoCategory, locale: "en" | "bg") {
  return locale === "bg" ? cat.name_bg : cat.name
}

const perfectTones = [
  {
    // Blue
    bg: "bg-blue-50/80 dark:bg-blue-950/20",
    border: "border-blue-100 dark:border-blue-800/40",
    icon: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500/10 to-blue-600/10",
    solid: "bg-blue-500",
    shadow: "shadow-blue-500/5",
  },
  {
    // Emerald
    bg: "bg-emerald-50/80 dark:bg-emerald-950/20",
    border: "border-emerald-100 dark:border-emerald-800/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500/10 to-emerald-600/10",
    solid: "bg-emerald-500",
    shadow: "shadow-emerald-500/5",
  },
  {
    // Orange
    bg: "bg-orange-50/80 dark:bg-orange-950/20",
    border: "border-orange-100 dark:border-orange-800/40",
    icon: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-500/10 to-orange-600/10",
    solid: "bg-orange-500",
    shadow: "shadow-orange-500/5",
  },
  {
    // Purple
    bg: "bg-purple-50/80 dark:bg-purple-950/20",
    border: "border-purple-100 dark:border-purple-800/40",
    icon: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500/10 to-purple-600/10",
    solid: "bg-purple-500",
    shadow: "shadow-purple-500/5",
  },
  {
    // Rose
    bg: "bg-rose-50/80 dark:bg-rose-950/20",
    border: "border-rose-100 dark:border-rose-800/40",
    icon: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500/10 to-rose-600/10",
    solid: "bg-rose-500",
    shadow: "shadow-rose-500/5",
  },
]

function getTone(index: number) {
  return perfectTones[index % perfectTones.length]
}

/**
 * PERFECTED 1: Glassmorphism Ultra
 * Refined version of Gemini 1.
 * Thinner borders, softer shadows, more subtle gradients.
 * "Ultrathin" aesthetic.
 */
export function Perfected1_GlassUltra({
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
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-6 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4 pt-2">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = getTone(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group relative snap-start shrink-0",
                "w-[130px] h-[150px]",
                "rounded-3xl overflow-hidden",
                "border border-white/40 dark:border-white/5",
                "bg-white/60 dark:bg-black/20 backdrop-blur-xl",
                "shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]", // Very soft shadow
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1 hover:shadow-[0_8px_25px_-8px_rgba(0,0,0,0.1)]",
                "touch-action-manipulation"
              )}
            >
              {/* Subtle Top Gradient */}
              <div className={cn(
                "absolute top-0 inset-x-0 h-24 opacity-20 bg-linear-to-b from-current to-transparent",
                tone.icon
              )} />
              
              <div className="relative h-full flex flex-col p-4">
                <div className={cn(
                  "size-11 rounded-2xl flex items-center justify-center mb-auto",
                  "bg-white/90 dark:bg-white/10 backdrop-blur-md",
                  "shadow-sm border border-white/60 dark:border-white/10",
                  tone.icon
                )}>
                  <Icon className="size-5" weight="duotone" />
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground/80 mb-1 uppercase tracking-widest">
                    Shop
                  </div>
                  <div className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                    {getName(cat, locale)}
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

/**
 * PERFECTED 2: Mesh Pill Clean
 * Refined version of Gemini 2.
 * Cleaner layout, less noise, perfect alignment.
 * "Modern mini-cards rail" perfected.
 */
export function Perfected2_MeshPillClean({
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
          const tone = getTone(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group relative snap-start shrink-0",
                "w-[150px] h-[72px]",
                "rounded-full overflow-hidden",
                "flex items-center p-1.5",
                "bg-card border border-border/40",
                "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]",
                "hover:shadow-md hover:border-border/60 transition-all duration-300",
                "touch-action-manipulation"
              )}
            >
              {/* Icon Circle with Mesh Gradient */}
              <div className={cn(
                "size-[60px] rounded-full shrink-0",
                "bg-linear-to-br", tone.gradient,
                "flex items-center justify-center",
                "border border-white/50 dark:border-white/5",
                "relative overflow-hidden"
              )}>
                {/* Inner glow */}
                <div className={cn("absolute inset-0 opacity-20 bg-linear-to-tr from-white to-transparent")} />
                <Icon className={cn("size-6 relative z-10", tone.icon)} weight="duotone" />
              </div>

              {/* Text */}
              <div className="flex-1 px-3 min-w-0 flex flex-col justify-center">
                <div className="text-[13px] font-bold text-foreground truncate leading-tight">
                  {getName(cat, locale)}
                </div>
                <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-0.5 mt-0.5 group-hover:text-primary transition-colors">
                  View <ArrowRight className="size-2" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/**
 * PERFECTED 3: The "Tile" (Refined Mobile 3)
 * Refined version of "Bold tiles rail".
 * Square, balanced, perfect for grid-like browsing on mobile.
 */
export function Perfected3_Tile({
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
          const tone = getTone(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group relative snap-start shrink-0",
                "size-[110px]",
                "rounded-2xl overflow-hidden",
                "bg-card border border-border/40",
                "flex flex-col items-center justify-center gap-3",
                "shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]",
                "hover:border-border/80 transition-all duration-300",
                "touch-action-manipulation"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-linear-to-b from-transparent via-transparent to-primary/5"
              )} />

              <div className={cn(
                "size-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                tone.bg
              )}>
                <Icon className={cn("size-5", tone.icon)} weight="fill" />
              </div>
              
              <span className="text-xs font-semibold text-foreground text-center px-2 leading-tight line-clamp-2">
                {getName(cat, locale)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/**
 * PERFECTED 4: Minimal Row (Refined Mobile 2)
 * A very dense, list-like horizontal scroll.
 * Extremely space-efficient.
 */
export function Perfected4_MinimalRow({
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
      <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = getTone(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group snap-start shrink-0",
                "flex items-center gap-2.5",
                "pl-1.5 pr-3 py-1.5",
                "rounded-xl",
                "bg-background border border-border/40",
                "hover:bg-accent/50 hover:border-border/60 transition-all",
                "touch-action-manipulation"
              )}
            >
              <div className={cn(
                "size-8 rounded-lg flex items-center justify-center",
                tone.bg
              )}>
                <Icon className={cn("size-4", tone.icon)} weight="duotone" />
              </div>
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {getName(cat, locale)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
