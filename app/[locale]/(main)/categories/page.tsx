import { routing, validateLocale, Link } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { getCategoryShortName } from "@/lib/category-display"
import { CaretRight, Storefront, Sparkle } from "@phosphor-icons/react/dist/ssr"
import { CategoryCircleVisual } from "@/components/shared/category/category-circle-visual"
import { PageShell } from "@/components/shared/page-shell"
import { CategoriesHeaderSync } from "./_components/categories-header-sync"
import type { Metadata } from "next"

// =============================================================================
// CATEGORIES INDEX PAGE — Browse All Categories (Directory Style)
// 
// Both mobile and desktop show a clean category directory list.
// Mobile tab bar drawer + homepage tabs already handle "discovery" browsing.
// This page is for users who explicitly want to see ALL categories in a list.
// 
// Per CATEGORY-BROWSING-AUDIT: Don't duplicate homepage tabs on /categories.
// =============================================================================

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Categories" })

  return {
    title: t("title"),
    description: t("metaDescription"),
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "Categories" })

  // L0 + L1 + L2 for directory display
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  // Header title for mobile contextual header
  const headerTitle = t("headerTitleAll")

  return (
    <PageShell>
      {/* Sync contextual header for mobile */}
      <CategoriesHeaderSync title={headerTitle} />

      {/* Header */}
      <div className="border-b border-border/30 bg-background">
        <div className="px-inset py-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="text-sm font-bold text-foreground">{t("title")}</h1>
            <p className="text-2xs text-muted-foreground whitespace-nowrap">
              {t("categoryCount", { count: categoriesWithChildren.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="divide-y divide-border/60">
        {categoriesWithChildren.map((cat) => {
          const children = cat.children ?? []
          const hasChildren = children.length > 0

          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex items-center gap-2 px-inset min-h-touch-lg active:bg-active"
            >
              <CategoryCircleVisual
                category={cat}
                active={false}
                className="size-14 shrink-0" // Treido: 56px (size-14) standard
                fallbackIconSize={24}
                fallbackIconWeight="bold"
                variant="muted"
              />

              <div className="flex-1 min-w-0 py-3">
                <div className="font-medium text-sm text-foreground">
                  {getCategoryShortName(cat, locale)}
                </div>
                {hasChildren && (
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {children
                      .map((c) => getCategoryShortName(c, locale))
                      .join(' • ')}
                  </div>
                )}
              </div>

              <CaretRight size={14} weight="bold" className="text-muted-foreground/50 shrink-0" />
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="px-inset py-3 bg-surface-subtle border-t border-border/30">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/sell"
            className="flex items-center gap-2 p-2 bg-background rounded-md border border-border/40"
          >
            <div className="size-8 rounded-md bg-selected flex items-center justify-center">
              <Storefront size={16} weight="fill" className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">{t("quickActions.sell.title")}</div>
              <div className="text-2xs text-muted-foreground">{t("quickActions.sell.subtitle")}</div>
            </div>
          </Link>

          <Link
            href="/todays-deals"
            className="flex items-center gap-2 p-2 bg-background rounded-md border border-border/40"
          >
            <div className="size-8 rounded-md bg-deal/10 flex items-center justify-center">
              <Sparkle size={16} weight="fill" className="text-deal" />
            </div>
            <div>
              <div className="text-sm font-medium">{t("quickActions.deals.title")}</div>
              <div className="text-2xs text-muted-foreground">{t("quickActions.deals.subtitle")}</div>
            </div>
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
