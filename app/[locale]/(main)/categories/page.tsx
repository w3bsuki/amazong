import { routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { getRootCategoriesWithChildren } from "@/lib/data/categories"
import { CategoryCircle } from "@/components/shared/category/category-circle"

// =============================================================================
// CATEGORIES INDEX PAGE — Browse All Categories
// 
// Shows a grid of all root categories. Users can tap to browse deeper.
// =============================================================================

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const categories = await getRootCategoriesWithChildren()

  return (
    <div className="min-h-screen bg-background">
      <div className="px-(--page-inset) py-4">
        {/* Header */}
        <h1 className="text-xl font-bold mb-4">
          {locale === 'bg' ? 'Всички категории' : 'All Categories'}
        </h1>

        {/* Category Grid - 4 columns on mobile, 5 on tablet, 6 on desktop */}
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-x-2 gap-y-4">
          {categories.map((catNode) => {
            const cat = catNode.category
            const name = locale === 'bg' && cat.name_bg ? cat.name_bg : cat.name
            return (
              <CategoryCircle
                key={cat.id}
                category={cat}
                label={name}
                href={`/categories/${cat.slug}`}
                prefetch={true}
                circleClassName="size-14 sm:size-16"
                labelClassName="text-2xs sm:text-xs font-medium text-center text-muted-foreground line-clamp-2"
                variant="muted"
                fallbackIconSize={24}
                fallbackIconWeight="regular"
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
