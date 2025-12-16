"use client"

import { useState } from "react"
import { Link } from "@/i18n/routing"
import { 
  Laptop,
  Dress,
  Armchair,
  Sparkle,
  GameController,
  Barbell,
  Baby,
  Car,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  TrendUp,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { DemoMobileCategoryCards } from "@/components/demo/mobile-category-cards"
import {
  MobileCategoryVariant1_SnapCircles,
  MobileCategoryVariant2_GridCircles,
  MobileCategoryVariant2_Final,
  MobileCategoryVariant3_CompactCards,
  MobileCategoryVariant3_Final,
  MobileCategoryVariant4_PillChips,
  MobileCategoryVariant5_ListRows,
  MobileCategoryVariant5_Final,
  type DemoCategory,
} from "@/components/demo/category-variants"
import {
  GeminiVariant1_Glass,
  GeminiVariant2_MeshGradient,
  GeminiVariant3_FloatingDepth,
  GeminiVariant4_MinimalBorder,
  GeminiVariant5_SuperAppTile,
} from "@/components/demo/gemini-variants"

const categories = [
  { id: "1", name: "Electronics", name_bg: "Електроника", slug: "electronics", icon: Laptop, 
    gradient: "from-blue-500/10 to-blue-600/10", 
    solid_gradient: "from-blue-500 to-blue-600",
    soft: "bg-blue-500/10", 
    accent: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800" },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", icon: Dress, 
    gradient: "from-pink-500/10 to-pink-600/10", 
    solid_gradient: "from-pink-500 to-pink-600",
    soft: "bg-pink-500/10", 
    accent: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800" },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", icon: Armchair, 
    gradient: "from-amber-500/10 to-amber-600/10", 
    solid_gradient: "from-amber-500 to-amber-600",
    soft: "bg-amber-500/10", 
    accent: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800" },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", icon: Sparkle, 
    gradient: "from-violet-500/10 to-violet-600/10", 
    solid_gradient: "from-violet-500 to-violet-600",
    soft: "bg-violet-500/10", 
    accent: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800" },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", icon: GameController, 
    gradient: "from-emerald-500/10 to-emerald-600/10", 
    solid_gradient: "from-emerald-500 to-emerald-600",
    soft: "bg-emerald-500/10", 
    accent: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800" },
  { id: "6", name: "Sports", name_bg: "Спорт", slug: "sports", icon: Barbell, 
    gradient: "from-red-500/10 to-red-600/10", 
    solid_gradient: "from-red-500 to-red-600",
    soft: "bg-red-500/10", 
    accent: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800" },
  { id: "7", name: "Kids", name_bg: "Деца", slug: "baby", icon: Baby, 
    gradient: "from-cyan-500/10 to-cyan-600/10", 
    solid_gradient: "from-cyan-500 to-cyan-600",
    soft: "bg-cyan-500/10", 
    accent: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800" },
  { id: "8", name: "Auto", name_bg: "Авто", slug: "automotive", icon: Car, 
    gradient: "from-slate-500/10 to-slate-600/10", 
    solid_gradient: "from-slate-500 to-slate-600",
    soft: "bg-slate-500/10", 
    accent: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800" },
  { id: "9", name: "Books", name_bg: "Книги", slug: "books", icon: BookOpen, 
    gradient: "from-orange-500/10 to-orange-600/10", 
    solid_gradient: "from-orange-500 to-orange-600",
    soft: "bg-orange-500/10", 
    accent: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800" },
  { id: "10", name: "More", name_bg: "Още", slug: "more", icon: ShoppingBag, 
    gradient: "from-indigo-500/10 to-indigo-600/10", 
    solid_gradient: "from-indigo-500 to-indigo-600",
    soft: "bg-indigo-500/10", 
    accent: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800" },
]

const mobileCategories = categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  name_bg: cat.name_bg,
  slug: cat.slug,
  icon: cat.icon,
}))

const demoCategories: DemoCategory[] = mobileCategories

function Section({ title, subtitle, tier, children }: { title: string; subtitle: string; tier?: "S" | "A" | "B"; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/40 pb-10 last:border-b-0">
      <div className="flex items-start gap-3 mb-6 px-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
            {tier && (
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide",
                tier === "S" && "bg-primary/10 text-primary border border-primary/20",
                tier === "A" && "bg-muted text-muted-foreground border border-border",
                tier === "B" && "bg-muted/50 text-muted-foreground/70"
              )}>
                {tier}-TIER
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function CategoryDemoPage() {
  const [locale, setLocale] = useState<"en" | "bg">("en")
  const getName = (cat: typeof categories[0]) => locale === "bg" ? cat.name_bg : cat.name

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Category Audit</h1>
              <p className="text-xs text-muted-foreground font-medium">Mobile-First Design System</p>
            </div>
            <button 
              onClick={() => setLocale(l => l === "en" ? "bg" : "en")} 
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-muted hover:bg-accent transition-colors border border-border/50"
            >
              {locale === "en" ? "🇧🇬 BG" : "🇬🇧 EN"}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-2">

        {/* GEMINI: EXPERIMENTAL VARIANTS */}
        <Section
          title="GEMINI. Experimental Category Styles"
          subtitle="5 new experimental styles focusing on depth, glassmorphism, and modern mobile aesthetics."
          tier="S"
        >
          <div className="space-y-10">
            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gemini 1 — Glassmorphism Premium</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Translucent cards with subtle gradients and blur effects.</p>
              </div>
              <GeminiVariant1_Glass categories={demoCategories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gemini 2 — Mesh Gradient Pill</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Vibrant, pill-shaped cards with mesh gradients.</p>
              </div>
              <GeminiVariant2_MeshGradient categories={demoCategories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gemini 3 — Floating Icon Depth</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Cards with floating icons and layered depth.</p>
              </div>
              <GeminiVariant3_FloatingDepth categories={demoCategories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gemini 4 — Minimal Border Focus</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">High-contrast, clean design with color accents.</p>
              </div>
              <GeminiVariant4_MinimalBorder categories={demoCategories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gemini 5 — Super App Tile</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Dense, informative tiles for high-density layouts.</p>
              </div>
              <GeminiVariant5_SuperAppTile categories={demoCategories} locale={locale} />
            </div>
          </div>
        </Section>

        {/* NEW: MOBILE + DESKTOP VARIANTS (TOKEN-ONLY) */}
        <Section
          title="NEW. Mobile Category Variants (Best-in-class)"
          subtitle="5 mobile-first, horizontal-scroll category styles with tasteful color using theme tokens (brand/link + semantic)."
          tier="S"
        >
          <div className="space-y-8">
            <div>
              <div className="px-4 mb-2">
                <div className="text-xs font-medium text-muted-foreground">Mobile 1 — Premium circles rail</div>
              </div>
              <MobileCategoryVariant1_SnapCircles categories={demoCategories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-2">
                <div className="text-xs font-medium text-muted-foreground">Mobile 2 — Modern mini-cards rail</div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="px-4 mb-2">
                    <div className="text-[10px] font-semibold text-muted-foreground">Original</div>
                  </div>
                  <MobileCategoryVariant2_GridCircles categories={demoCategories} locale={locale} columns={4} />
                </div>
                <div>
                  <div className="px-4 mb-2">
                    <div className="text-[10px] font-semibold text-muted-foreground">Final</div>
                  </div>
                  <MobileCategoryVariant2_Final categories={demoCategories} locale={locale} />
                </div>
              </div>
            </div>

            <div>
              <div className="px-4 mb-2">
                <div className="text-xs font-medium text-muted-foreground">Mobile 3 — Bold tiles rail</div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="px-4 mb-2">
                    <div className="text-[10px] font-semibold text-muted-foreground">Original</div>
                  </div>
                  <MobileCategoryVariant3_CompactCards categories={demoCategories} locale={locale} />
                </div>
                <div>
                  <div className="px-4 mb-2">
                    <div className="text-[10px] font-semibold text-muted-foreground">Final</div>
                  </div>
                  <MobileCategoryVariant3_Final categories={demoCategories} locale={locale} />
                </div>
              </div>
            </div>

            <div>
              <div className="px-4 mb-2">
                <div className="text-xs font-medium text-muted-foreground">Mobile 4 — Color pills rail</div>
              </div>
              <MobileCategoryVariant4_PillChips categories={demoCategories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-2">
                <div className="text-xs font-medium text-muted-foreground">Mobile 5 — 2-row carousel grid</div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="px-4 mb-2">
                    <div className="text-[10px] font-semibold text-muted-foreground">Original</div>
                  </div>
                  <MobileCategoryVariant5_ListRows categories={demoCategories} locale={locale} />
                </div>
                <div>
                  <div className="px-4 mb-2">
                    <div className="text-[10px] font-semibold text-muted-foreground">Final</div>
                  </div>
                  <MobileCategoryVariant5_Final categories={demoCategories} locale={locale} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 0. MOBILE CATEGORY CARDS (TOKEN-ONLY) */}
        <Section
          title="0. Mobile Category Cards (Token-only)"
          subtitle="Clean, professional mobile cards using only theme tokens (no hard-coded colors/shadows, no animations)."
          tier="S"
        >
          <DemoMobileCategoryCards categories={mobileCategories} locale={locale} />
        </Section>

        {/* 1. THE PERFECT CIRCLE */}
        <Section title="1. The Perfect Circle" subtitle="Optimized touch target (64px), perfect spacing, subtle active state. The gold standard for mobile navigation." tier="S">
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
                  "flex flex-col items-center shrink-0 snap-start group",
                  "w-[72px]", // Fixed width for alignment
                  i === categories.length - 1 && "mr-4"
                )}>
                  {/* Icon Container */}
                  <div className={cn(
                    "size-16 rounded-full flex items-center justify-center mb-2",
                    "bg-muted/30 border border-transparent",
                    "group-active:scale-95 transition-all duration-200 ease-out",
                    "group-hover:bg-muted/50 group-hover:border-border/50" // Desktop hover
                  )}>
                    <Icon className={cn("size-7 transition-colors duration-200", "text-foreground/80 group-hover:text-foreground")} weight="duotone" />
                  </div>
                  {/* Label */}
                  <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight group-hover:text-foreground transition-colors line-clamp-2 w-full px-1">
                    {getName(cat)}
                  </span>
                </Link>
              )
            })}
          </div>
        </Section>

        {/* 2. THE MODERN CARD */}
        <Section title="2. The Modern Card" subtitle="Clean, framed, subtle depth. Professional e-commerce standard. Excellent for showcasing category diversity." tier="S">
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
                  "flex flex-col items-center shrink-0 snap-start",
                  "w-[104px] h-[120px] p-3",
                  "bg-card rounded-2xl border border-border/60",
                  "shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]", // Very subtle shadow
                  "active:scale-[0.98] transition-all duration-200",
                  i === categories.length - 1 && "mr-4"
                )}>
                  <div className={cn(
                    "size-12 rounded-xl flex items-center justify-center mb-3",
                    cat.soft
                  )}>
                    <Icon className={cn("size-6", cat.accent)} weight="fill" />
                  </div>
                  <span className="text-xs font-semibold text-foreground text-center leading-tight line-clamp-2 w-full">
                    {getName(cat)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 mt-auto font-medium">
                    1.2k items
                  </span>
                </Link>
              )
            })}
          </div>
        </Section>

        {/* 3. MINIMAL CHIP */}
        <Section title="3. Minimal Chip" subtitle="Horizontal scrollable chips. Perfect for secondary navigation or filters. High density, low visual noise." tier="S">
          <div className="flex overflow-x-auto no-scrollbar gap-2.5 px-4 pb-2 -mx-4 snap-x snap-mandatory scroll-pl-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
                  "flex items-center gap-2 shrink-0 snap-start",
                  "h-10 pl-3 pr-4 rounded-full",
                  "bg-background border border-border/80",
                  "active:bg-foreground active:text-background active:border-transparent", // Inverted active state
                  "transition-all duration-200",
                  i === categories.length - 1 && "mr-4"
                )}>
                  <Icon className="size-4.5" weight="duotone" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {getName(cat)}
                  </span>
                </Link>
              )
            })}
          </div>
        </Section>

        {/* 4. BOLD TILES */}
        <Section title="4. Bold Tiles" subtitle="Immersive, colorful, engaging. Best for featured categories or landing pages." tier="A">
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-4 -mx-4 snap-x snap-mandatory scroll-pl-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
                  "relative flex flex-col justify-between shrink-0 snap-start overflow-hidden",
                  "w-[140px] h-40 p-4",
                  "rounded-2xl bg-linear-to-br",
                  cat.solid_gradient,
                  "shadow-sm",
                  "active:scale-[0.98] transition-all duration-200",
                  i === categories.length - 1 && "mr-4"
                )}>
                  {/* Background Pattern/Icon */}
                  <Icon className="absolute -bottom-4 -right-4 size-24 text-white/10 rotate-[-10deg]" weight="fill" />
                  
                  <div className="size-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="size-4 text-white" weight="bold" />
                  </div>

                  <div>
                    <span className="block text-sm font-bold text-white leading-tight mb-1">
                      {getName(cat)}
                    </span>
                    <div className="flex items-center gap-1 text-white/80">
                      <span className="text-[10px] font-medium">Shop Now</span>
                      <ArrowRight className="size-3" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Section>

        {/* 5. LIST VIEW */}
        <Section title="5. Structured List" subtitle="When density and readability matter most. Great for 'All Categories' drawer." tier="A">
          <div className="grid grid-cols-1 gap-2 px-4">
            {categories.slice(0, 5).map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className={cn(
                  "flex items-center gap-4 p-3",
                  "bg-card rounded-xl border border-border/50",
                  "active:bg-accent/50 transition-colors duration-200"
                )}>
                  <div className={cn(
                    "size-10 rounded-lg flex items-center justify-center shrink-0",
                    cat.soft
                  )}>
                    <Icon className={cn("size-5", cat.accent)} weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-foreground truncate">{getName(cat)}</span>
                      <TrendUp className="size-3.5 text-emerald-500" />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">New arrivals & bestsellers</p>
                  </div>
                  <CaretRight className="size-4 text-muted-foreground/40" />
                </Link>
              )
            })}
          </div>
        </Section>

        {/* 6. GRID ICONS */}
        <Section title="6. Grid Icons" subtitle="Compact grid for quick access. App-folder style." tier="B">
          <div className="px-4">
            <div className="grid grid-cols-4 gap-3">
              {categories.slice(0, 8).map((cat) => {
                const Icon = cat.icon
                return (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "size-14 rounded-2xl flex items-center justify-center",
                      "bg-card border border-border shadow-xs",
                      "active:scale-95 transition-all duration-200"
                    )}>
                      <Icon className={cn("size-6", cat.accent)} weight="duotone" />
                    </div>
                    <span className="text-[10px] font-medium text-center text-muted-foreground leading-tight line-clamp-1 w-full">
                      {getName(cat)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </Section>

      </div>
    </main>
  )
}

function CaretRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" {...props}>
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
    </svg>
  )
}
