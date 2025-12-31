import { routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import type { Metadata } from 'next'
import { Suspense } from "react"

import { getCategoryHierarchy } from "@/lib/data/categories"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"
import { Skeleton } from "@/components/ui/skeleton"

// =============================================================================
// CATEGORIES INDEX PAGE - Full Interactive UX
// 
// This page provides the same category browsing experience as the homepage.
// Uses MobileHomeTabs for consistent tabs + circles + pills + infinite scroll.
// URL params (?tab=electronics&sub=smartphones) enable deep linking.
// =============================================================================

// SEO Metadata
export const metadata: Metadata = {
  title: 'All Categories - Shop',
  description: 'Browse all product categories. Find electronics, fashion, home goods and more.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// Loading skeleton for the tabs
function CategoriesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Tab skeleton */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 py-3 px-4">
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16 rounded" />
          ))}
        </div>
      </div>
      {/* Circle skeleton */}
      <div className="py-4 px-4">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-2.5 w-12 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-1.5 px-4 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <Skeleton className="aspect-square w-full rounded-md mb-1" />
            <Skeleton className="h-2.5 w-full rounded-sm mb-1" />
            <Skeleton className="h-2.5 w-2/3 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function CategoriesPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tab?: string; sub?: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  
  const searchParams = await searchParamsPromise
  const defaultTab = searchParams.tab || null
  const defaultSubTab = searchParams.sub || null

  // Fetch categories WITH children for tabs + circles (L0 + L1 + L2)
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  // Page title based on locale
  const pageTitle = locale === "bg" ? "Всички категории" : "All Categories"

  return (
    <main className="flex min-h-screen flex-col bg-background pb-20">
      {/* Mobile: Full interactive tabs UX (same as homepage) */}
      <div className="w-full md:hidden">
        <Suspense fallback={<CategoriesPageSkeleton />}>
          <MobileHomeTabs 
            initialProducts={[]} 
            initialCategories={categoriesWithChildren}
            defaultTab={defaultTab}
            defaultSubTab={defaultSubTab}
            showBanner={false}
            pageTitle={pageTitle}
          />
        </Suspense>
      </div>

      {/* Desktop: Same pattern but with desktop layout considerations */}
      <div className="hidden md:block w-full">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>
          <Suspense fallback={<CategoriesPageSkeleton />}>
            <MobileHomeTabs 
              initialProducts={[]} 
              initialCategories={categoriesWithChildren}
              defaultTab={defaultTab}
              defaultSubTab={defaultSubTab}
              showBanner={false}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
