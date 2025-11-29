"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { CaretRight, MagnifyingGlass } from "@phosphor-icons/react"

interface SearchHeaderProps {
  query?: string
  totalResults: number
}

export function SearchHeader({ query, totalResults }: SearchHeaderProps) {
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
              Amazong
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <CaretRight size={14} weight="regular" className="text-muted-foreground/60" />
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MagnifyingGlass size={14} weight="regular" />
              {query ? t('searchResults') : t('allProducts')}
            </span>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {query ? (
            <>
              {t('resultsFor')} "<span className="text-primary">{query}</span>"
            </>
          ) : (
            t('exploreAllProducts')
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalResults.toLocaleString()} {t('productsFound')}
        </p>
      </div>
    </div>
  )
}
