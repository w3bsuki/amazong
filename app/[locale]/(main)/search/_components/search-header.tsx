"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { CaretRight, MagnifyingGlass } from "@phosphor-icons/react"
import { SaveSearchButton } from "@/components/shared/search/save-search-button"

interface SearchHeaderProps {
  query?: string
  category?: string | undefined
  totalResults: number
}

export function SearchHeader({ query, category, totalResults }: SearchHeaderProps) {
  const t = useTranslations('SearchFilters')

  return (
    <div className="mb-6">
      {/* Target-style Breadcrumb - Full width with underlines */}
      <nav className="w-full border-b border-border py-3 mb-6">
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <Link 
              href="/" 
              className="text-foreground hover:underline underline-offset-2"
            >
              Treido
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <CaretRight size={14} weight="regular" className="text-muted-foreground" />
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MagnifyingGlass size={14} weight="regular" />
              {query ? t('searchResults') : t('allProducts')}
            </span>
          </li>
        </ol>
      </nav>

      {/* Page Header with Save Search button */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {query ? (
              <>
                {t('resultsFor')}{" "}
                <span className="text-primary">&quot;{query}&quot;</span>
              </>
            ) : (
              t('exploreAllProducts')
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalResults.toLocaleString()} {t('productsFound')}
          </p>
        </div>
        <SaveSearchButton query={query} category={category} />
      </div>
    </div>
  )
}
