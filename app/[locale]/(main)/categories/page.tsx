import { validateLocale } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { CategoryIconGrid } from "@/components/mobile/category-nav/category-icon-grid"
import { PageShell } from "../../_components/page-shell"
import { CategoriesHeaderSync } from "./_components/categories-header-sync"
import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Categories" })

  return createPageMetadata({
    locale,
    path: "/categories",
    title: t("title"),
    description: t("metaDescription"),
  })
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

  // Header title for mobile contextual header
  const headerTitle = t("headerTitleAll")

  const rootCategories = await getCategoryHierarchy(null, 0)

  return (
    <PageShell variant="muted">
      {/* Sync contextual header for mobile */}
      <CategoriesHeaderSync title={headerTitle} />

      <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
        <h1 className="sr-only">{t("title")}</h1>
        <CategoryIconGrid locale={locale} categories={rootCategories} testId="categories-icon-grid" />
      </div>
    </PageShell>
  )
}


