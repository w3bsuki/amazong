"use client"

import { useMemo, useState } from "react"
import { Search as MagnifyingGlass } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { getCategoryName, getCategorySlugKey } from "@/lib/data/categories/display"
import { getCategoryIcon } from "@/components/shared/category-icons"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"

const CATEGORY_CARD_CLASS =
  "group flex flex-col items-center justify-start gap-1.5 rounded-xl px-1 py-2 text-center tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"

function CategoryIconTile({ slug }: { slug: string }) {
  return (
    <span
      className="inline-flex size-(--size-category-tile) items-center justify-center rounded-full ring-1 ring-border-subtle bg-surface-subtle text-muted-foreground transition-colors group-hover:text-foreground group-active:text-foreground"
      aria-hidden="true"
    >
      {getCategoryIcon(slug, { size: 20 })}
    </span>
  )
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase()
}

interface CategoryIconGridProps {
  locale: string
  categories: CategoryTreeNode[]
  className?: string
  testId?: string
}

export function CategoryIconGrid({ locale, categories, className, testId }: CategoryIconGridProps) {
  const tCategories = useTranslations("Categories")
  const tDrawer = useTranslations("CategoryDrawer")

  const [query, setQuery] = useState("")
  const normalizedQuery = useMemo(() => normalizeQuery(query), [query])

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return categories

    return categories.filter((category) => {
      const label = tCategories("shortName", {
        slug: getCategorySlugKey(category.slug),
        name: getCategoryName(category, locale),
      })
      const haystack = `${label} ${category.slug}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [categories, locale, normalizedQuery, tCategories])

  return (
    <section className={cn("w-full", className)} {...(testId ? { "data-testid": testId } : {})}>
      <div className="border-b border-border-subtle bg-background px-inset py-3">
        <div className="relative">
          <MagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tDrawer("searchPlaceholder")}
            aria-label={tDrawer("searchAriaLabel")}
            className="pl-9"
          />
        </div>
      </div>

      <div className="px-inset py-3">
        {filteredCategories.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {normalizedQuery ? tDrawer("noMatches") : tDrawer("noCategories")}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4">
            {filteredCategories.map((category) => {
              const label = tCategories("shortName", {
                slug: getCategorySlugKey(category.slug),
                name: getCategoryName(category, locale),
              })

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={CATEGORY_CARD_CLASS}
                  aria-label={label}
                >
                  <CategoryIconTile slug={category.slug} />
                  <span className="line-clamp-2 text-tiny font-medium leading-tight text-foreground">
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export type { CategoryIconGridProps }
