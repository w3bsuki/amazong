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
      {/* Header */}
      <div className="bg-primary/5 border-b border-border/30">
        <div className="px-(--page-inset) py-2.5">
          <h1 className="text-base font-bold text-foreground">
            {locale === 'bg' ? 'Категории' : 'Categories'}
          </h1>
          <p className="text-2xs text-muted-foreground">
            {locale === 'bg' 
              ? `${categoriesWithChildren.length} категории` 
              : `${categoriesWithChildren.length} categories`}
          </p>
        </div>
      </div>

      {/* Category List */}
      <div className="divide-y divide-border/30">
        {categoriesWithChildren.map((cat) => {
          const children = cat.children ?? []
          const hasChildren = children.length > 0
          
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex items-center gap-2 px-(--page-inset) min-h-touch-lg active:bg-muted/50"
            >
              <CategoryCircleVisual
                category={cat}
                active={false}
                className="size-(--category-circle-mobile) shrink-0"
                fallbackIconSize={24}
                fallbackIconWeight="regular"
                variant="muted"
              />
              
              <div className="flex-1 min-w-0 py-2">
                <div className="font-medium text-sm text-foreground">
                  {getCategoryShortName(cat, locale)}
                </div>
                {hasChildren && (
                  <div className="text-2xs text-muted-foreground truncate">
                    {children.slice(0, 3).map(c => getCategoryShortName(c, locale)).join(' • ')}
                    {children.length > 3 && ` +${children.length - 3}`}
                  </div>
                )}
              </div>
              
              <CaretRight size={14} weight="bold" className="text-muted-foreground/50 shrink-0" />
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="px-(--page-inset) py-3 bg-muted/20 border-t border-border/30">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/sell"
            className="flex items-center gap-2 p-2 bg-background rounded-md border border-border/40"
          >
            <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Storefront size={16} weight="fill" className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">{locale === 'bg' ? 'Продай' : 'Sell'}</div>
              <div className="text-2xs text-muted-foreground">{locale === 'bg' ? 'Безплатно' : 'Free'}</div>
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
              <div className="text-sm font-medium">{locale === 'bg' ? 'Оферти' : 'Deals'}</div>
              <div className="text-2xs text-muted-foreground">{locale === 'bg' ? 'До -70%' : 'Up to 70%'}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
