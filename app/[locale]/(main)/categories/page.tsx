import { routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { getCategoryName, getCategoryShortName } from "@/lib/category-display"

// =============================================================================
// CATEGORIES INDEX PAGE — Browse All Categories
// 
// Simple overview grid of L0 categories that LINK to /categories/[slug].
// NO query params (?tab=X), NO client-side navigation - just clean SEO links.
// 
// When user clicks a category, they go to /categories/automotive (proper URL)
// which has server-rendered filters and SEO-friendly structure.
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

  const t = await getTranslations('Common')

  // Fetch L0 categories with their L1 children for preview
  const categoriesWithChildren = await getCategoryHierarchy(null, 1)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-(--page-inset) py-3">
        <h1 className="text-lg font-bold">
          {locale === 'bg' ? 'Категории' : 'Categories'}
        </h1>
      </div>

      {/* Category Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="px-(--page-inset) py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categoriesWithChildren.map((cat) => (
            <CategoryCircle
              key={cat.slug}
              category={cat}
              href={`/categories/${cat.slug}`}
              circleClassName="size-16 sm:size-20"
              fallbackIconSize={32}
              fallbackIconWeight="regular"
              variant="menu"
              label={getCategoryShortName(cat, locale)}
              labelClassName="text-sm font-medium text-center text-foreground leading-tight line-clamp-2 mt-2"
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            />
          ))}
        </div>

        {/* L1 Subcategories Preview for each L0 */}
        <div className="mt-8 space-y-6">
          {categoriesWithChildren.map((l0) => {
            const children = l0.children ?? []
            if (children.length === 0) return null
            
            return (
              <section key={l0.slug} className="border-t border-border/40 pt-4">
                <h2 className="text-base font-semibold mb-3">
                  {getCategoryName(l0, locale)}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {children.slice(0, 8).map((l1) => (
                    <a
                      key={l1.slug}
                      href={`/${locale}/categories/${l1.slug}`}
                      className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                    >
                      {getCategoryShortName(l1, locale)}
                    </a>
                  ))}
                  {children.length > 8 && (
                    <a
                      href={`/${locale}/categories/${l0.slug}`}
                      className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +{children.length - 8} {locale === 'bg' ? 'още' : 'more'}
                    </a>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
