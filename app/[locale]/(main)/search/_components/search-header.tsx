"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ChevronRight as CaretRight, Search as MagnifyingGlass } from "lucide-react";

import { SaveSearchButton } from "../../_components/search-controls/save-search-button"

interface SearchHeaderProps {
  query?: string
  category?: string | undefined
  totalResults: number
}

export function SearchHeader({ query, category, totalResults }: SearchHeaderProps) {
  const t = useTranslations('SearchFilters')

  return (
    <div className="mb-5">
      {/* Target-style Breadcrumb - Full width with underlines */}
      <nav className="mb-5 w-full border-b border-border py-2.5">
        <ol className="flex items-center gap-1 text-sm">
          <li>
            <Link 
              href="/" 
              className="text-foreground hover:underline underline-offset-2"
            >
              Treido
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <CaretRight size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground flex items-center gap-1">
              <MagnifyingGlass size={14} />
              {query ? t('searchResults') : t('allProducts')}
            </span>
          </li>
        </ol>
      </nav>

      {/* Page Header with Save Search button */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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
