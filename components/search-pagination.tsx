"use client"

import { usePathname, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
    return `${pathname}${queryString ? `?${queryString}` : ''}`
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
    <Pagination className="mt-8">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          {hasPrev ? (
            <PaginationPrevious href={buildPageUrl(currentPage - 1)} />
          ) : (
            <PaginationPrevious 
              href="#" 
              className="pointer-events-none opacity-50" 
              aria-disabled="true"
            />
          )}
        </PaginationItem>
        
        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink 
                href={buildPageUrl(page)} 
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        {/* Next */}
        <PaginationItem>
          {hasNext ? (
            <PaginationNext href={buildPageUrl(currentPage + 1)} />
          ) : (
            <PaginationNext 
              href="#" 
              className="pointer-events-none opacity-50" 
              aria-disabled="true"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
