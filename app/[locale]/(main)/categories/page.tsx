import { validateLocale, Link } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { ChevronRight as CaretRight, Sparkles as Sparkle, Store as Storefront } from "lucide-react";

import { CategoryCircleVisual } from "../_components/category/category-circle-visual"
import { PageShell } from "../../_components/page-shell"
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
const QUICK_ACTION_CARD_CLASS =
  "flex min-h-(--control-default) items-center gap-2 rounded-xl border border-border-subtle bg-background p-2 tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const QUICK_ACTION_ICON_CLASS =
  "flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary"
const CATEGORY_ROW_CLASS =
  "group flex min-h-(--control-default) items-center gap-2.5 px-inset py-1.5 tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"

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

  const getCategoryShortName = (category: {
    id: string
    slug: string
    name: string
    name_bg: string | null
  }): string => {
    return t("shortName", { slug: getCategorySlugKey(category.slug), name: getCategoryName(category, locale) })
  }

  return (
    <PageShell>
      {/* Sync contextual header for mobile */}
      <CategoriesHeaderSync title={headerTitle} />

      {/* Header */}
      <div className="border-b border-border-subtle bg-background">
        <div className="px-inset py-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="hidden lg:block text-sm font-bold tracking-tight text-foreground">{t("title")}</h1>
            <h2 className="lg:hidden text-sm font-bold tracking-tight text-foreground">{t("title")}</h2>
            <p className="text-2xs text-muted-foreground whitespace-nowrap">
              {t("categoryCount", { count: categoriesWithChildren.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="divide-y divide-border-subtle">
        {categoriesWithChildren.map((cat) => {
          const children = cat.children ?? []
          const hasChildren = children.length > 0

          return (
            <div key={cat.slug} className="group">
              <Link
                href={`/categories/${cat.slug}`}
                className={CATEGORY_ROW_CLASS}
              >
                <CategoryCircleVisual
                  category={cat}
                  active={false}
                  className="size-(--control-default) shrink-0"
                  fallbackIconSize={20}
                  fallbackIconWeight="duotone"
                  variant="muted"
                />

                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-foreground">
                    {getCategoryShortName(cat)}
                  </div>
                </div>

                <CaretRight
                  size={14}
                  className="shrink-0 text-muted-foreground transition-colors duration-fast ease-smooth group-hover:text-foreground group-active:text-foreground"
                />
              </Link>
              {hasChildren && (
                <div className="flex flex-wrap gap-1.5 px-inset pb-2 -mt-0.5" style={{ paddingLeft: "calc(var(--page-inset-mobile) + var(--control-default) + 10px)" }}>
                  {children.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categories/${c.slug}`}
                      className="inline-flex items-center rounded-full border border-border-subtle bg-surface-subtle px-2.5 py-1 text-2xs font-medium text-muted-foreground transition-colors duration-fast ease-smooth hover:bg-hover hover:text-foreground active:bg-active tap-transparent"
                    >
                      {getCategoryShortName(c)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="px-inset py-3 bg-surface-subtle border-t border-border-subtle">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/sell"
            className={QUICK_ACTION_CARD_CLASS}
          >
            <div className={QUICK_ACTION_ICON_CLASS}>
              <Storefront size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{t("quickActions.sell.title")}</div>
              <div className="text-2xs text-muted-foreground">{t("quickActions.sell.subtitle")}</div>
            </div>
          </Link>

          <Link
            href="/todays-deals"
            className={QUICK_ACTION_CARD_CLASS}
          >
            <div className={QUICK_ACTION_ICON_CLASS}>
              <Sparkle size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{t("quickActions.deals.title")}</div>
              <div className="text-2xs text-muted-foreground">{t("quickActions.deals.subtitle")}</div>
            </div>
          </Link>
        </div>
      </div>
    </PageShell>
  )
}


