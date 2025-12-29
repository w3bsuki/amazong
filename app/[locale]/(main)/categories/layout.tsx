import { getRootCategories } from "./_lib/categories-data"
import { MobileCategoryTabs } from "@/components/category/mobile-category-tabs"
import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"

export default async function CategoriesLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const categories = await getRootCategories()

  return (
    <div className="min-h-[calc(100vh-52px-50px)] bg-background">
      {/* Mobile Tabs - Sticky Top (Horizontal) */}
      <div className="block md:hidden sticky top-[52px] z-30">
        <MobileCategoryTabs categories={categories} locale={locale} />
      </div>

      {/* Main Content Area */}
      <div className="min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
