"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { type DemoCategory } from "@/components/demo/category-variants"

function getName(cat: DemoCategory, locale: "en" | "bg") {
  return locale === "bg" ? cat.name_bg : cat.name
}

const refinedTones = [
  { 
    bg: "bg-blue-50/50 dark:bg-blue-900/10", 
    text: "text-blue-600 dark:text-blue-400", 
    border: "border-blue-100 dark:border-blue-800/30",
    shadow: "shadow-blue-500/5",
    gradient: "from-blue-500/10 to-blue-600/10"
  },
  { 
    bg: "bg-emerald-50/50 dark:bg-emerald-900/10", 
    text: "text-emerald-600 dark:text-emerald-400", 
    border: "border-emerald-100 dark:border-emerald-800/30",
    shadow: "shadow-emerald-500/5",
    gradient: "from-emerald-500/10 to-emerald-600/10"
  },
  { 
    bg: "bg-orange-50/50 dark:bg-orange-900/10", 
    text: "text-orange-600 dark:text-orange-400", 
    border: "border-orange-100 dark:border-orange-800/30",
    shadow: "shadow-orange-500/5",
    gradient: "from-orange-500/10 to-orange-600/10"
  },
  { 
    bg: "bg-purple-50/50 dark:bg-purple-900/10", 
    text: "text-purple-600 dark:text-purple-400", 
    border: "border-purple-100 dark:border-purple-800/30",
    shadow: "shadow-purple-500/5",
    gradient: "from-purple-500/10 to-purple-600/10"
  },
  { 
    bg: "bg-rose-50/50 dark:bg-rose-900/10", 
    text: "text-rose-600 dark:text-rose-400", 
    border: "border-rose-100 dark:border-rose-800/30",
    shadow: "shadow-rose-500/5",
    gradient: "from-rose-500/10 to-rose-600/10"
  },
]

function getTone(index: number) {
  return refinedTones[index % refinedTones.length]
}

/**
 * REFINED 1: Ultra-Thin Halo
 * Extremely clean, 1px border (or less visually), very light background.
 * The "Halo" effect comes from a very subtle shadow and border interaction.
 */
export function Refined1_UltraThinHalo({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-5 px-4 pb-6 -mx-4 snap-x snap-mandatory scroll-pl-4 pt-2">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-3 snap-start shrink-0 w-[72px]">
            <div className={cn(
              "size-[72px] rounded-full flex items-center justify-center transition-all duration-300",
              "bg-background border border-border/40",
              "shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]",
              "group-hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5",
              "group-active:scale-95 group-active:shadow-none"
            )}>
              <div className={cn(
                "size-[60px] rounded-full flex items-center justify-center transition-colors",
                tone.bg
              )}>
                <Icon className={cn("size-7 transition-transform duration-300 group-hover:scale-110", tone.text)} weight="light" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center tracking-wide">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * REFINED 2: The "Air" Pill
 * A pill shape that feels like it's floating on air.
 * Very subtle gradient border and background.
 */
export function Refined2_AirPill({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
            "group relative snap-start shrink-0",
            "pl-1.5 pr-4 py-1.5 rounded-full",
            "bg-background/50 backdrop-blur-sm border border-border/40",
            "flex items-center gap-3",
            "transition-all duration-300 hover:bg-background hover:shadow-sm hover:border-border/60"
          )}>
            <div className={cn(
              "size-8 rounded-full flex items-center justify-center",
              tone.bg
            )}>
              <Icon className={cn("size-4", tone.text)} weight="regular" />
            </div>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * REFINED 3: Glass Circle (Improved)
 * A more refined version of the glassmorphism circle.
 * Uses a double-border effect for that "premium glass" look.
 */
export function Refined3_GlassCircle({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-2 snap-start shrink-0 w-[72px]">
            <div className={cn(
              "relative size-16 rounded-full flex items-center justify-center overflow-hidden",
              "bg-white/40 dark:bg-black/20 backdrop-blur-md",
              "border border-white/50 dark:border-white/10",
              "shadow-sm transition-all duration-300 group-hover:shadow-md"
            )}>
              {/* Subtle gradient blob behind icon */}
              <div className={cn("absolute inset-0 opacity-30 bg-linear-to-br", tone.gradient)} />
              
              <Icon className={cn("size-7 relative z-10", tone.text)} weight="duotone" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * REFINED 4: The "Iconic" (Large Icon)
 * Focuses purely on the iconography.
 * The icon is the hero. Text is secondary.
 */
export function Refined4_Iconic({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-5 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-3 snap-start shrink-0 w-[64px]">
            <div className="size-[64px] flex items-center justify-center rounded-2xl bg-transparent group-hover:bg-muted/30 transition-colors duration-300">
              <Icon className="size-9 text-foreground/70 group-hover:text-foreground transition-all duration-300 group-hover:scale-110" weight="thin" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 group-hover:text-foreground transition-colors text-center">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * REFINED 5: The "Vogue" (Editorial)
 * Very high-fashion, editorial look.
 * Square aspect ratio, thin borders, elegant typography.
 */
export function Refined5_Vogue({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
            "group snap-start shrink-0 w-[100px] h-[120px]",
            "flex flex-col items-center justify-center gap-4",
            "border border-border/30 bg-card/30",
            "hover:bg-card hover:border-border/60 transition-all duration-300"
          )}>
            <div className={cn(
              "size-10 rounded-full flex items-center justify-center",
              tone.bg
            )}>
              <Icon className={cn("size-5", tone.text)} weight="light" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs font-medium text-foreground tracking-wide">
                {getName(cat, locale)}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest">
                Shop
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
