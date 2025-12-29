import { Link, routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { CaretRight, GridFour } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'

import { getRootCategories } from "./_lib/categories-data"
import { SubcategoryCircles } from "@/components/category/subcategory-circles"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"

// =============================================================================
// CATEGORIES INDEX PAGE - FULLY CACHED
// 
// This page displays all root categories.
// All data comes from cached functions - NO connection() needed.
// =============================================================================

// SEO Metadata
export const metadata: Metadata = {
  title: 'All Categories - Shop',
  description: 'Browse all product categories. Find electronics, fashion, home goods and more.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function CategoriesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // NO connection() - uses cached getRootCategories function
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const categories = await getRootCategories()

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner */}
      <div className="bg-primary text-primary-foreground py-6 sm:py-10">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              {locale === "bg" ? "Начало" : "Home"}
            </Link>
            <CaretRight className="size-3.5" />
            <span className="text-primary-foreground">
              {locale === "bg" ? "Категории" : "Categories"}
            </span>
          </nav>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-primary-foreground/10 rounded-full flex items-center justify-center">
              <GridFour className="size-6 sm:size-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">
                {locale === "bg" ? "Всички категории" : "Shop All Categories"}
              </h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
                {locale === "bg" 
                  ? "Открийте хиляди продукти в над 16 категории" 
                  : "Discover thousands of products across 16+ categories"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-4 sm:-mt-6 space-y-2">
        {/* Category Circles (Standardized) */}
        <section className="bg-background rounded-xl border border-border p-2 shadow-sm">
          <h2 className="text-lg font-bold mb-2 px-2">
            {locale === "bg" ? "Преглед по категории" : "Browse by Department"}
          </h2>
          {/* Use SubcategoryCircles but we need to adapt it to show ALL categories without "All" button */}
          <SubcategoryCircles 
            subcategories={categories} 
            currentCategory={null}
            basePath="/categories"
            className="w-full"
          />
        </section>

        {/* CTA Banner (Standardized) */}
        <StartSellingBanner locale={locale} />
      </div>
    </div>
  )
}
