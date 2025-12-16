"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { ApiCategory } from "@/components/demo/gpt-category-variants"
import {
  GPT1_ClassicCircles,
  GPT2_HaloCircles,
  GPT3_SquircleTiles,
  GPT4_MinimalChips,
  GPT5_CompactCards,
  GPT6_MinimalRows,
  GPT7_DenseCircles,
  GPT8_IconStrip,
  GPT9_TilesGrid,
  GPT10_FeaturedCards,
} from "@/components/demo/gpt-category-variants"

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-border/40 pb-10 last:border-b-0">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function isValidCategoryName(name: string) {
  const lower = name.toLowerCase()
  return !lower.includes("[deprecated]") && !lower.includes("[moved]") && !lower.includes("[duplicate]")
}

export default function GPTDemoPage() {
  const [locale, setLocale] = React.useState<"en" | "bg">("en")
  const [categories, setCategories] = React.useState<ApiCategory[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const res = await fetch("/api/categories")
        const data = (await res.json()) as { categories?: ApiCategory[] }
        const raw = Array.isArray(data.categories) ? data.categories : []
        const valid = raw.filter(c => isValidCategoryName(c.name))
        if (!cancelled) setCategories(valid)
      } catch {
        if (!cancelled) setCategories([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">GPT Category Cards</h1>
              <p className="text-xs text-muted-foreground font-medium">
                10 marketplace-perfect category circles/cards (mobile + desktop, minimal styling)
              </p>
            </div>

            <button
              onClick={() => setLocale(l => (l === "en" ? "bg" : "en"))}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-full",
                "bg-muted hover:bg-accent transition-colors",
                "border border-border/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              {locale === "en" ? "BG" : "EN"}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        <div className="mx-4 rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Data</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {loading
              ? "Loading categories from /api/categories…"
              : `Loaded ${categories.length} categories (filtered: deprecated/moved/duplicate).`}
          </div>
        </div>

        <Section
          title="GPT 1 — Marketplace Classic Circles"
          subtitle="Safest default: neutral circles with inner ring, clear icon + label. Great above-the-fold on mobile and as a desktop grid."
        >
          <GPT1_ClassicCircles categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 2 — Halo Circles (Ultra-thin)"
          subtitle="A slightly more premium circle ring without gradients or glow. Looks clean in light + dark."
        >
          <GPT2_HaloCircles categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 3 — Squircle Icon Tiles"
          subtitle="Landing-page friendly: compact tile cards with strong scanability and no color noise."
        >
          <GPT3_SquircleTiles categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 4 — Minimal Pill Chips"
          subtitle="Best for touch navigation. Works as a mobile chip set, and as a desktop “category chips” block."
        >
          <GPT4_MinimalChips categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 5 — Compact Browse Cards"
          subtitle="Marketplace cards with icon tile + title. Mobile uses a rail; desktop uses a clean grid."
        >
          <GPT5_CompactCards categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 6 — Minimal Row List"
          subtitle="Ideal for a full “All categories” page: fast scanning, clear affordance, minimal UI noise."
        >
          <GPT6_MinimalRows categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 7 — Dense Circles Grid"
          subtitle="Fits all categories without feeling heavy. Good for “Browse all categories” sections."
        >
          <GPT7_DenseCircles categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 8 — Icon Strip"
          subtitle="Very compact rail: tiny card + icon + label. Great for dense mobile rails."
        >
          <GPT8_IconStrip categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 9 — Minimal Tiles Grid"
          subtitle="Balanced tiles grid with a subtle affordance (chevron). No gradients or heavy shadows."
        >
          <GPT9_TilesGrid categories={categories} locale={locale} />
        </Section>

        <Section
          title="GPT 10 — Featured Category Cards"
          subtitle="Slightly larger cards for desktop sections (still minimal). Mobile uses a rail."
        >
          <GPT10_FeaturedCards categories={categories} locale={locale} />
        </Section>
      </div>
    </main>
  )
}
