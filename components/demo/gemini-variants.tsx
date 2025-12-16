"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { ArrowRight } from "@phosphor-icons/react"
import { type DemoCategory } from "@/components/demo/category-variants"

function getName(cat: DemoCategory, locale: "en" | "bg") {
  return locale === "bg" ? cat.name_bg : cat.name
}

const geminiTones = [
  {
    gradient: "from-blue-500/20 to-purple-500/20",
    border: "border-blue-200/50 dark:border-blue-800/50",
    icon: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    shadow: "shadow-blue-500/10",
    accent: "bg-blue-500",
  },
  {
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-200/50 dark:border-emerald-800/50",
    icon: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    shadow: "shadow-emerald-500/10",
    accent: "bg-emerald-500",
  },
  {
    gradient: "from-orange-500/20 to-red-500/20",
    border: "border-orange-200/50 dark:border-orange-800/50",
    icon: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    shadow: "shadow-orange-500/10",
    accent: "bg-orange-500",
  },
  {
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-200/50 dark:border-pink-800/50",
    icon: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    shadow: "shadow-pink-500/10",
    accent: "bg-pink-500",
  },
  {
    gradient: "from-violet-500/20 to-indigo-500/20",
    border: "border-violet-200/50 dark:border-violet-800/50",
    icon: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    shadow: "shadow-violet-500/10",
    accent: "bg-violet-500",
  },
] as const

function getTone(index: number) {
  return geminiTones[index % geminiTones.length]
}

/**
 * GEMINI 1: Glassmorphism Premium
 * A sophisticated, translucent card with a subtle gradient and blur.
 */
export function GeminiVariant1_Glass({
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
          const tone = getTone(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group relative snap-start shrink-0",
                "w-[140px] h-[160px]",
                "rounded-3xl overflow-hidden",
                "border border-white/20 dark:border-white/10",
                "bg-white/40 dark:bg-black/40 backdrop-blur-md",
                "shadow-lg",
                tone.shadow,
                "touch-action-manipulation",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1 hover:shadow-xl"
              )}
            >
              {/* Gradient Blob Background */}
              <div className={cn(
                "absolute -top-10 -right-10 size-32 rounded-full opacity-30 blur-2xl",
                tone.accent
              )} />
              
              <div className="relative h-full flex flex-col p-5">
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center mb-auto",
                  "bg-white/80 dark:bg-white/10 backdrop-blur-sm",
                  "shadow-sm border border-white/50 dark:border-white/10",
                  tone.icon
                )}>
                  <Icon className="size-6" weight="duotone" />
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    Explore
                  </div>
                  <div className="text-base font-bold text-foreground leading-tight line-clamp-2">
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
 * GEMINI 2: Mesh Gradient Pill
 * A vibrant, colorful pill-shaped card that stands out.
 */
export function GeminiVariant2_MeshGradient({
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
                "w-[160px] h-[80px]",
                "rounded-full overflow-hidden",
                "flex items-center p-2",
                "bg-card border border-border/50",
                "shadow-sm hover:shadow-md transition-all",
                "touch-action-manipulation"
              )}
            >
              {/* Icon Circle */}
              <div className={cn(
                "size-[64px] rounded-full shrink-0",
                "bg-linear-to-br", tone.gradient,
                "flex items-center justify-center",
                "border border-white/20 dark:border-white/10"
              )}>
                <Icon className={cn("size-7 text-white drop-shadow-sm")} weight="fill" />
              </div>

              {/* Text */}
              <div className="flex-1 px-3 min-w-0">
                <div className="text-sm font-bold text-foreground truncate">
                  {getName(cat, locale)}
                </div>
                <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                  Shop <ArrowRight className="size-2.5" />
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
 * GEMINI 3: Floating Icon Depth
 * Uses shadows and layering to create a sense of depth.
 */
export function GeminiVariant3_FloatingDepth({
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
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-6 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4 pt-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = getTone(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group relative snap-start shrink-0",
                "w-[130px] pt-8",
                "touch-action-manipulation"
              )}
            >
              <div className={cn(
                "relative bg-card rounded-2xl p-4 pt-10 pb-4 text-center",
                "border border-border/60",
                "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
                "transition-transform duration-300 group-hover:-translate-y-1"
              )}>
                {/* Floating Icon */}
                <div className={cn(
                  "absolute -top-8 left-1/2 -translate-x-1/2",
                  "size-16 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300",
                  "bg-background border border-border",
                  "shadow-lg",
                  "flex items-center justify-center",
                  tone.icon
                )}>
                  <div className={cn("absolute inset-0 opacity-20 rounded-2xl", tone.bg)} />
                  <Icon className="size-8 relative z-10" weight="duotone" />
                </div>

                <div className="font-bold text-sm text-foreground mb-1 line-clamp-1">
                  {getName(cat, locale)}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium bg-muted/50 rounded-full px-2 py-0.5 inline-block">
                  View Items
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
 * GEMINI 4: Minimalist Border Focus
 * Clean, high-contrast, with a focus on typography and a colored border accent.
 */
export function GeminiVariant4_MinimalBorder({
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
                "group snap-start shrink-0",
                "w-[110px] h-[140px]",
                "bg-card rounded-xl overflow-hidden",
                "border-2 border-transparent hover:border-border transition-colors",
                "flex flex-col",
                "touch-action-manipulation"
              )}
            >
              <div className={cn(
                "flex-1 flex items-center justify-center",
                tone.bg
              )}>
                <Icon className={cn("size-10", tone.icon)} weight="fill" />
              </div>
              <div className="h-[50px] flex items-center justify-center px-2 bg-card border-t border-border/50">
                <span className="text-xs font-bold text-center leading-tight line-clamp-2">
                  {getName(cat, locale)}
                </span>
              </div>
              {/* Bottom Color Line */}
              <div className={cn("h-1 w-full", tone.accent)} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/**
 * GEMINI 5: The "Super App" Tile
 * Inspired by modern super apps - dense, informative, and very clickable.
 */
export function GeminiVariant5_SuperAppTile({
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
      <div className="grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = getTone(index)
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group snap-start shrink-0",
                "w-[260px] h-[72px]",
                "bg-card rounded-xl border border-border/60",
                "flex items-center p-3 gap-4",
                "hover:bg-accent/50 transition-colors",
                "touch-action-manipulation"
              )}
            >
              <div className={cn(
                "size-12 rounded-lg shrink-0",
                "flex items-center justify-center",
                tone.bg,
                tone.icon
              )}>
                <Icon className="size-6" weight="duotone" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-sm text-foreground truncate">
                    {getName(cat, locale)}
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground/50 -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Best deals & new arrivals
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
