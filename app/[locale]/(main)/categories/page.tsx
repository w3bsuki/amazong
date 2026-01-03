import { routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { Link } from "@/i18n/routing"
import { getCategoryName, getCategoryShortName } from "@/lib/category-display"
import { CaretRight, Storefront, Sparkle } from "@phosphor-icons/react/dist/ssr"
import { CategoryCircleVisual } from "@/components/shared/category/category-circle-visual"

// =============================================================================
// CATEGORIES INDEX PAGE — Browse All Categories (Mobile-First Design)
// 
// Beautiful grid + accordion layout for exploring all marketplace categories.
// Mobile: Clean list with icons → Desktop: Grid with subcategory previews
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
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b border-border/30">
        <div className="px-(--page-inset) pt-4 pb-5">
          <h1 className="text-xl font-bold text-foreground">
            {locale === 'bg' ? 'Разгледай всички категории' : 'Browse all categories'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === 'bg' 
              ? `${categoriesWithChildren.length} категории • Хиляди продукти` 
              : `${categoriesWithChildren.length} categories • Thousands of products`}
          </p>
        </div>
      </div>

      {/* Category List - Mobile optimized with tap targets */}
      <div className="divide-y divide-border/30">
        {categoriesWithChildren.map((cat) => {
          const children = cat.children ?? []
          const hasChildren = children.length > 0
          
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex items-center gap-3 px-(--page-inset) py-3 hover:bg-muted/30 active:bg-muted/50 transition-colors"
            >
              {/* Category Icon */}
              <div className="shrink-0">
                <CategoryCircleVisual
                  category={cat}
                  active={false}
                  className="size-11"
                  fallbackIconSize={24}
                  fallbackIconWeight="regular"
                  variant="muted"
                />
              </div>
              
              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground">
                  {getCategoryShortName(cat, locale)}
                </div>
                {hasChildren && (
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {children.slice(0, 3).map(c => getCategoryShortName(c, locale)).join(' • ')}
                    {children.length > 3 && ` +${children.length - 3}`}
                  </div>
                )}
              </div>
              
              {/* Arrow */}
              <CaretRight 
                size={16} 
                weight="bold" 
                className="text-muted-foreground/60 shrink-0" 
              />
            </Link>
          )
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="px-(--page-inset) py-6 bg-muted/20 border-t border-border/30 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/sell"
            className="flex items-center gap-2 p-3 bg-background rounded-xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Storefront size={18} weight="fill" className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {locale === 'bg' ? 'Продай' : 'Sell'}
              </div>
              <div className="text-2xs text-muted-foreground">
                {locale === 'bg' ? 'Безплатно' : 'Free listing'}
              </div>
            </div>
          </Link>
          
          <Link
            href="/todays-deals"
            className="flex items-center gap-2 p-3 bg-background rounded-xl border border-border/40 hover:border-deal/30 hover:bg-deal/5 transition-colors"
          >
            <div className="size-9 rounded-lg bg-deal/10 flex items-center justify-center">
              <Sparkle size={18} weight="fill" className="text-deal" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {locale === 'bg' ? 'Оферти' : 'Deals'}
              </div>
              <div className="text-2xs text-muted-foreground">
                {locale === 'bg' ? 'До -70%' : 'Up to -70%'}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
