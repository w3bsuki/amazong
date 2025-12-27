import { Link, routing, validateLocale } from "@/i18n/routing"
import Image from "next/image"
import { setRequestLocale } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { CaretRight, GridFour } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'

import {
  getCategoryImageUrl,
  getCategoryName,
  getRootCategories,
} from "./_lib/categories-data"

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

      <div className="container -mt-4 sm:-mt-6">
        {/* Category List */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {locale === "bg" ? "Преглед по категории" : "Browse by Department"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryName = getCategoryName(locale, category)
              const imageUrl = getCategoryImageUrl(category)
              
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="border-border hover:border-primary transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="size-14 sm:size-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        <Image 
                          src={imageUrl} 
                          alt={categoryName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {categoryName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {locale === "bg" ? "Разгледай продукти" : "Browse products"}
                        </p>
                      </div>
                      <CaretRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
