import { routing, validateLocale, Link } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { getCategoryShortName } from "@/lib/category-display"
import { CaretRight, Storefront, Sparkle } from "@phosphor-icons/react/dist/ssr"
import { CategoryCircleVisual } from "@/components/shared/category/category-circle-visual"

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

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const t = await getTranslations('Common')

  // L0 + L1 + L2 for directory display
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="border-b border-border/30 bg-background">
        <div className="px-(--page-inset) py-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="text-sm font-bold text-foreground">
              {locale === 'bg' ? 'Категории' : 'Categories'}
            </h1>
            <p className="text-2xs text-muted-foreground whitespace-nowrap">
              {locale === 'bg'
                ? `${categoriesWithChildren.length} категории`
                : `${categoriesWithChildren.length} categories`}
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
              className="flex items-center gap-2 px-(--page-inset) min-h-touch-lg active:bg-muted/50"
            >
              <CategoryCircleVisual
                category={cat}
                active={false}
                className="size-[56px] shrink-0 bg-secondary/30 border border-border/60" // Treido: 56px fixed, Flat
                fallbackIconSize={24}
                fallbackIconWeight="light"
                variant="muted"
              />

              <div className="flex-1 min-w-0 py-2">
                <div className="font-medium text-sm text-foreground">
                  {getCategoryShortName(cat, locale)}
                </div>
                {hasChildren && (
                  <div className="text-2xs text-muted-foreground truncate flex items-center gap-0.5">
                    <span className="truncate">
                      {children
                        .slice(0, 2)
                        .map((c) => getCategoryShortName(c, locale))
                        .join(' • ')}
                    </span>
                    {children.length > 2 && (
                      <span className="inline-flex items-center justify-center shrink-0 px-1.5 py-0.5 bg-muted rounded-sm text-2xs font-medium text-muted-foreground">
                        +{children.length - 2}
                      </span>
                    )}
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
