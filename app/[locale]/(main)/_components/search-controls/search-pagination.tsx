"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Link, usePathname } from "@/i18n/routing"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"

interface SearchPaginationProps {
  totalItems: number
  itemsPerPage?: number
  currentPage: number
}

export function SearchPagination({ 
  totalItems, 
  itemsPerPage = 20, 
  currentPage 
}: SearchPaginationProps) {
  const tCommon = useTranslations("Common")
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Don't render if only one page
  if (totalPages <= 1) return null
  
  // Build URL with page param
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete("page")
    } else {
      params.set("page", page.toString())
    }
    const queryString = params.toString()

    const localePrefix = `/${locale}`
    const basePath = pathname.startsWith(localePrefix)
      ? (pathname.slice(localePrefix.length) || "/")
      : pathname

    return `${basePath}${queryString ? `?${queryString}` : ""}`
  }
  
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const showPages = 5 // Max pages to show
    
    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('ellipsis')
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <Pagination className="mt-8" aria-label={tCommon("pagination")}>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          {hasPrev ? (
            <PaginationLink asChild size="default" className="gap-1 px-2.5 sm:pl-2.5" aria-label={tCommon("goToPreviousPage")}>
              <Link href={buildPageUrl(currentPage - 1)} prefetch={false}>
                <ChevronLeftIcon />
                <span className="hidden sm:block">{tCommon("previous")}</span>
              </Link>
            </PaginationLink>
          ) : (
            <PaginationLink
              href="#"
              size="default"
              className="pointer-events-none gap-1 px-2.5 text-muted-foreground sm:pl-2.5"
              aria-disabled="true"
              aria-label={tCommon("goToPreviousPage")}
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">{tCommon("previous")}</span>
            </PaginationLink>
          )}
        </PaginationItem>
        
        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis label={tCommon("morePages")} />
            ) : (
              <PaginationLink asChild isActive={page === currentPage}>
                <Link href={buildPageUrl(page)} prefetch={false}>
                  {page}
                </Link>
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        {/* Next */}
        <PaginationItem>
          {hasNext ? (
            <PaginationLink asChild size="default" className="gap-1 px-2.5 sm:pr-2.5" aria-label={tCommon("goToNextPage")}>
              <Link href={buildPageUrl(currentPage + 1)} prefetch={false}>
                <span className="hidden sm:block">{tCommon("next")}</span>
                <ChevronRightIcon />
              </Link>
            </PaginationLink>
          ) : (
            <PaginationLink
              href="#"
              size="default"
              className="pointer-events-none gap-1 px-2.5 text-muted-foreground sm:pr-2.5"
              aria-disabled="true"
              aria-label={tCommon("goToNextPage")}
            >
              <span className="hidden sm:block">{tCommon("next")}</span>
              <ChevronRightIcon />
            </PaginationLink>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
