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
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import {
  Ultimate1_Standard,
  Ultimate2_SoftPill,
  Ultimate3_OutlinedSquircle,
  Ultimate4_StoryRing,
  Ultimate5_MinimalChip,
  Ultimate6_StackedCard,
  Ultimate7_FloatingIcon,
  Ultimate8_TintedCircle,
  Ultimate9_UnderlineFocus,
  Ultimate10_Hybrid,
} from "@/components/demo/gemini-ultimate"
import {
  Refined1_UltraThinHalo,
  Refined2_AirPill,
  Refined3_GlassCircle,
  Refined4_Iconic,
  Refined5_Vogue,
} from "@/components/demo/gemini-refined"
import {
  Perfected1_GlassUltra,
  Perfected2_MeshPillClean,
  Perfected3_Tile,
  Perfected4_MinimalRow,
} from "@/components/demo/gemini-perfected"
import {
  GeminiVariant1_Glass,
  GeminiVariant2_MeshGradient,
} from "@/components/demo/gemini-variants"

const categories = [
  { id: "1", name: "Electronics", name_bg: "Електроника", slug: "electronics", icon: Laptop },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", icon: Dress },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", icon: Armchair },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", icon: Sparkle },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", icon: GameController },
  { id: "6", name: "Sports", name_bg: "Спорт", slug: "sports", icon: Barbell },
  { id: "7", name: "Kids", name_bg: "Деца", slug: "baby", icon: Baby },
  { id: "8", name: "Auto", name_bg: "Авто", slug: "automotive", icon: Car },
  { id: "9", name: "Books", name_bg: "Книги", slug: "books", icon: BookOpen },
  { id: "10", name: "More", name_bg: "Още", slug: "more", icon: ShoppingBag },
]

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/40 pb-10 last:border-b-0">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

export default function GeminiDemoPage() {
  const [locale, setLocale] = useState<"en" | "bg">("en")

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Gemini Ultimate</h1>
              <p className="text-xs text-muted-foreground font-medium">Clean, Modern E-commerce Categories</p>
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

      <div className="container py-8 space-y-8">
        
        <div className="px-4 py-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 mx-4">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Goal: "Clean UI and UX modern similar to eBay etc... ultrathin... perfect category circles."
          </p>
        </div>

        <Section
          title="REFINED 1. Ultra-Thin Halo"
          subtitle="Extremely clean, 1px border, very light background. The 'Halo' effect comes from a very subtle shadow."
        >
          <Refined1_UltraThinHalo categories={categories} locale={locale} />
        </Section>

        <Section
          title="REFINED 2. The 'Air' Pill"
          subtitle="A pill shape that feels like it's floating on air. Very subtle gradient border and background."
        >
          <Refined2_AirPill categories={categories} locale={locale} />
        </Section>

        <Section
          title="REFINED 3. Glass Circle (Improved)"
          subtitle="A more refined version of the glassmorphism circle. Uses a double-border effect for that 'premium glass' look."
        >
          <Refined3_GlassCircle categories={categories} locale={locale} />
        </Section>

        <Section
          title="REFINED 4. The 'Iconic' (Large Icon)"
          subtitle="Focuses purely on the iconography. The icon is the hero. Text is secondary."
        >
          <Refined4_Iconic categories={categories} locale={locale} />
        </Section>

        <Section
          title="REFINED 5. The 'Vogue' (Editorial)"
          subtitle="Very high-fashion, editorial look. Square aspect ratio, thin borders, elegant typography."
        >
          <Refined5_Vogue categories={categories} locale={locale} />
        </Section>

        <div className="pt-8 border-t border-border/40">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight">PERFECTED FAVORITES</h2>
            <p className="text-sm text-muted-foreground mt-1">Refined versions of your previous favorites (Glass & Mesh) + Mobile favorites.</p>
          </div>
          
          <div className="space-y-10">
            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perfected 1 — Glassmorphism Ultra</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Thinner borders, softer shadows, "ultrathin" aesthetic.</p>
              </div>
              <Perfected1_GlassUltra categories={categories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perfected 2 — Mesh Pill Clean</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Cleaner layout, less noise, perfect alignment.</p>
              </div>
              <Perfected2_MeshPillClean categories={categories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perfected 3 — The Tile</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Refined "Bold tiles rail". Square, balanced, perfect for grid.</p>
              </div>
              <Perfected3_Tile categories={categories} locale={locale} />
            </div>

            <div>
              <div className="px-4 mb-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perfected 4 — Minimal Row</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Refined "Modern mini-cards rail". Extremely space-efficient.</p>
              </div>
              <Perfected4_MinimalRow categories={categories} locale={locale} />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Previous Attempts (Ultimate)</h2>
          </div>
        </div>

        <Section
          title="1. The Standard (eBay Style)"
          subtitle="The gold standard. Clean circle, light background, clear text. Optimized for scanability."
        >
          <Ultimate1_Standard categories={categories} locale={locale} />
        </Section>

        <Section
          title="2. Soft Pill"
          subtitle="Friendly and touch-optimized. Great for filters or top-level navigation."
        >
          <Ultimate2_SoftPill categories={categories} locale={locale} />
        </Section>

        <Section
          title="3. Outlined Squircle"
          subtitle="Modern, tech-forward shape. Common in modern mobile OS design."
        >
          <Ultimate3_OutlinedSquircle categories={categories} locale={locale} />
        </Section>

        <Section
          title="4. Story Ring"
          subtitle="Perfect for 'Featured' or 'New' items. Mimics social media story patterns."
        >
          <Ultimate4_StoryRing categories={categories} locale={locale} />
        </Section>

        <Section
          title="5. Minimal Chip"
          subtitle="Text-first approach. Best for high-density category lists."
        >
          <Ultimate5_MinimalChip categories={categories} locale={locale} />
        </Section>

        <Section
          title="6. Stacked Card"
          subtitle="Small vertical card for slightly more emphasis."
        >
          <Ultimate6_StackedCard categories={categories} locale={locale} />
        </Section>

        <Section
          title="7. Floating Icon"
          subtitle="Clean white circle with subtle shadow. App Store feel."
        >
          <Ultimate7_FloatingIcon categories={categories} locale={locale} />
        </Section>

        <Section
          title="8. Tinted Circle"
          subtitle="Playful but clean. Background matches category brand color."
        >
          <Ultimate8_TintedCircle categories={categories} locale={locale} />
        </Section>

        <Section
          title="9. Underline Focus"
          subtitle="Minimalist. Icon + Text with a hover interaction."
        >
          <Ultimate9_UnderlineFocus categories={categories} locale={locale} />
        </Section>

        <Section
          title="10. Hybrid Pill"
          subtitle="Horizontal scroll, large icon left, text right."
        >
          <Ultimate10_Hybrid categories={categories} locale={locale} />
        </Section>

        <div className="pt-8 border-t border-border/40">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Previous Favorites</h2>
            <p className="text-sm text-muted-foreground mt-1">The experimental styles you liked.</p>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="px-4 mb-2 text-xs font-medium text-muted-foreground">Gemini 1 — Glassmorphism</div>
              <GeminiVariant1_Glass categories={categories} locale={locale} />
            </div>
            <div>
              <div className="px-4 mb-2 text-xs font-medium text-muted-foreground">Gemini 2 — Mesh Gradient</div>
              <GeminiVariant2_MeshGradient categories={categories} locale={locale} />
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
