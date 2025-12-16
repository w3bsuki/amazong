"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { type DemoCategory } from "@/components/demo/category-variants"
import { ArrowRight } from "@phosphor-icons/react"

function getName(cat: DemoCategory, locale: "en" | "bg") {
  return locale === "bg" ? cat.name_bg : cat.name
}

const cleanTones = [
  { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800", ring: "ring-blue-500" },
  { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", ring: "ring-emerald-500" },
  { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800", ring: "ring-orange-500" },
  { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800", ring: "ring-purple-500" },
  { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-700 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800", ring: "ring-pink-500" },
]

function getTone(index: number) {
  return cleanTones[index % cleanTones.length]
}

/**
 * ULTIMATE 1: The "Standard" (eBay/Amazon style)
 * The absolute gold standard for e-commerce. 
 * 64px circle, light gray background, dark icon, text below.
 * Optimized for scanability.
 */
export function Ultimate1_Standard({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat) => {
        const Icon = cat.icon
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-2 snap-start shrink-0 w-[72px]">
            <div className="size-16 rounded-full bg-muted/50 border border-border/40 flex items-center justify-center group-hover:bg-muted group-hover:border-border transition-colors duration-200">
              <Icon className="size-7 text-foreground/80 group-hover:text-foreground transition-colors" weight="duotone" />
            </div>
            <span className="text-[11px] font-medium text-center leading-tight text-muted-foreground group-hover:text-foreground line-clamp-2 w-full px-1">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 2: The "Soft Pill"
 * Friendly, approachable, and very touch-friendly.
 * Icon + Text inside a pill shape. Great for filters or top-level nav.
 */
export function Ultimate2_SoftPill({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-2.5 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
            "group flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full snap-start shrink-0",
            "bg-muted/30 border border-transparent hover:bg-muted/60 hover:border-border/50 transition-all",
            "active:scale-95"
          )}>
            <div className={cn("size-7 rounded-full flex items-center justify-center", tone.bg)}>
              <Icon className={cn("size-4", tone.text)} weight="fill" />
            </div>
            <span className="text-xs font-semibold text-foreground/90 whitespace-nowrap">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 3: The "Outlined Squircle"
 * Modern, tech-forward. Slightly rounded square (squircle).
 * Very common in modern iOS/Android design languages.
 */
export function Ultimate3_OutlinedSquircle({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat) => {
        const Icon = cat.icon
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-2 snap-start shrink-0 w-[68px]">
            <div className="size-[68px] rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
              <Icon className="size-7 text-foreground group-hover:scale-110 transition-transform duration-300" weight="light" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground text-center truncate w-full">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 4: The "Story Ring"
 * Mimics the "Story" UI pattern. Excellent for "Featured" or "New" categories.
 * Gradient ring indicates activity/importance.
 */
export function Ultimate4_StoryRing({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-1.5 snap-start shrink-0 w-[72px]">
            <div className={cn(
              "p-[2px] rounded-full bg-linear-to-tr from-transparent to-transparent group-hover:from-primary group-hover:to-primary/50 transition-all duration-300",
              i < 3 ? "from-primary to-primary/50" : "" // Highlight first 3
            )}>
              <div className="size-[64px] rounded-full border-[3px] border-background bg-muted/20 flex items-center justify-center overflow-hidden relative">
                 <div className={cn("absolute inset-0 opacity-10", tone.bg)} />
                 <Icon className="size-7 text-foreground relative z-10" weight="regular" />
              </div>
            </div>
            <span className="text-xs font-medium text-center text-foreground truncate w-full">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 5: The "Minimal Chip"
 * Text-first, very clean. Just a border and text.
 * Best for when you have MANY categories and icons add too much noise.
 */
export function Ultimate5_MinimalChip({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex flex-wrap gap-2 px-4">
      {categories.map((cat) => (
        <Link key={cat.slug} href={`/categories/${cat.slug}`} className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium text-muted-foreground">
          {getName(cat, locale)}
        </Link>
      ))}
    </div>
  )
}

/**
 * ULTIMATE 6: The "Stacked Card"
 * A small vertical card. Good for displaying a bit more context or color.
 */
export function Ultimate6_StackedCard({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
            "group snap-start shrink-0 w-[100px] h-[110px]",
            "flex flex-col items-center justify-center gap-3",
            "rounded-xl border border-border/50 bg-card",
            "hover:border-border hover:shadow-sm transition-all"
          )}>
            <div className={cn("size-10 rounded-full flex items-center justify-center", tone.bg)}>
              <Icon className={cn("size-5", tone.text)} weight="fill" />
            </div>
            <span className="text-xs font-semibold text-center px-2 leading-tight line-clamp-2">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 7: The "Floating Icon"
 * Clean white circle with a subtle shadow. Very "App Store" feel.
 */
export function Ultimate7_FloatingIcon({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-6 -mx-4 snap-x snap-mandatory scroll-pl-4 pt-2">
      {categories.map((cat) => {
        const Icon = cat.icon
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-3 snap-start shrink-0 w-[72px]">
            <div className="size-14 rounded-2xl bg-card shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-none dark:bg-muted border border-transparent dark:border-border flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
              <Icon className="size-7 text-primary" weight="duotone" />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors text-center">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 8: The "Tinted Circle"
 * Background color matches the category brand/tone.
 * Playful but still clean.
 */
export function Ultimate8_TintedCircle({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-2 snap-start shrink-0 w-[72px]">
            <div className={cn(
              "size-16 rounded-full flex items-center justify-center transition-transform active:scale-95",
              tone.bg
            )}>
              <Icon className={cn("size-7", tone.text)} weight="fill" />
            </div>
            <span className="text-xs font-medium text-center text-foreground/80">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 9: The "Underline Focus"
 * Very minimalist. Just the icon and text, with a bar that appears on hover.
 */
export function Ultimate9_UnderlineFocus({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-6 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat) => {
        const Icon = cat.icon
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-3 snap-start shrink-0 min-w-[60px]">
            <div className="relative">
              <Icon className="size-8 text-muted-foreground group-hover:text-foreground transition-colors" weight="light" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/**
 * ULTIMATE 10: The "Hybrid"
 * Horizontal scroll, large icon on left, text on right.
 * Good for when you want to show a bit more detail or have a list-like feel horizontally.
 */
export function Ultimate10_Hybrid({ categories, locale }: { categories: DemoCategory[], locale: "en" | "bg" }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon
        const tone = getTone(i)
        return (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group snap-start shrink-0 flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border border-border bg-card hover:bg-accent/50 transition-colors">
            <div className={cn("size-8 rounded-full flex items-center justify-center", tone.bg)}>
              <Icon className={cn("size-4", tone.text)} weight="fill" />
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {getName(cat, locale)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
