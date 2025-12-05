'use client'

import * as React from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { 
  CaretLeft, 
  CaretDown, 
  CaretRight,
  House,
  Funnel
} from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { 
  Category, 
  CategoryContext 
} from '@/lib/data/categories'
import { AttributeFilters } from '@/components/attribute-filters'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// =============================================================================
// Types
// =============================================================================

interface CategorySidebarProps {
  /** Full category context from getCategoryContext() */
  context: CategoryContext
  /** Current URL search params for filter state */
  searchParams?: Record<string, string | string[]>
  /** Optional class name */
  className?: string
}

// =============================================================================
// Helper Functions
// =============================================================================

function getCategoryName(category: Category, locale: string): string {
  return locale === 'bg' && category.name_bg ? category.name_bg : category.name
}

// =============================================================================
// Main Component
// =============================================================================

export function CategorySidebar({
  context,
  searchParams = {},
  className,
}: CategorySidebarProps) {
  const locale = useLocale()
  const { current, parent, children, attributes } = context

  // Filter only filterable attributes
  const filterableAttributes = React.useMemo(
    () => attributes.filter((attr) => attr.is_filterable),
    [attributes]
  )

  const currentName = getCategoryName(current, locale)
  const [childrenOpen, setChildrenOpen] = React.useState(true)
  const [filtersOpen, setFiltersOpen] = React.useState(false) // Start collapsed

  return (
    <aside
      className={cn(
        'flex flex-col w-60 h-full shrink-0',
        'bg-card border-r border-border overflow-hidden',
        className
      )}
    >
      {/* Fixed header */}
      <div className="shrink-0 p-4 border-b border-border">
        {/* Back link to parent or all categories */}
        <Link
          href={parent ? `/categories/${parent.slug}` : '/categories'}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm',
            'text-muted-foreground hover:text-primary',
            'transition-colors'
          )}
        >
          <CaretLeft size={14} weight="bold" />
          {parent ? (
            <span className="hover:underline">{getCategoryName(parent, locale)}</span>
          ) : (
            <>
              <House size={14} />
              <span className="hover:underline">
                {locale === 'bg' ? 'Всички категории' : 'All Categories'}
              </span>
            </>
          )}
        </Link>

        {/* Current category title */}
        <h2 className="mt-2 text-lg font-semibold text-foreground">
          {currentName}
        </h2>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-3">
          {/* Subcategories - Only show if there are children */}
          {children.length > 0 && (
            <Collapsible open={childrenOpen} onOpenChange={setChildrenOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 text-sm font-medium hover:text-primary transition-colors">
                <span>{locale === 'bg' ? 'Подкатегории' : 'Subcategories'}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {children.length}
                  </span>
                  {childrenOpen ? <CaretDown size={14} /> : <CaretRight size={14} />}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <nav className="space-y-0.5 pt-1 pb-2">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/categories/${child.slug}`}
                      className={cn(
                        'block py-1 px-2 text-sm rounded-md',
                        'text-muted-foreground hover:text-foreground',
                        'hover:bg-accent transition-colors'
                      )}
                    >
                      {getCategoryName(child, locale)}
                    </Link>
                  ))}
                </nav>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Attribute Filters */}
          {filterableAttributes.length > 0 && (
            <>
              <Separator />
              
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 text-sm font-medium hover:text-primary transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Funnel size={14} weight="bold" />
                    {locale === 'bg' ? 'Филтри' : 'Filters'}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {filterableAttributes.length}
                    </span>
                    {filtersOpen ? <CaretDown size={14} /> : <CaretRight size={14} />}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pt-2 pb-2">
                    <AttributeFilters
                      attributes={filterableAttributes}
                      searchParams={searchParams}
                      locale={locale}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Clear filters link - only show when filters are active */}
      {Object.keys(searchParams).some((key) => key.startsWith('attr_')) && (
        <div className="shrink-0 p-3 border-t border-border">
          <Link
            href={`/categories/${current.slug}`}
            className={cn(
              'flex w-full items-center justify-center',
              'rounded-md px-3 py-2 text-sm font-medium',
              'bg-muted hover:bg-accent',
              'transition-colors'
            )}
          >
            {locale === 'bg' ? 'Изчисти филтрите' : 'Clear all filters'}
          </Link>
        </div>
      )}
    </aside>
  )
}

// =============================================================================
// Skeleton for loading state
// =============================================================================

export function CategorySidebarSkeleton({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'flex flex-col w-60 h-full shrink-0',
        'bg-card border-r border-border animate-pulse overflow-hidden',
        className
      )}
    >
      <div className="shrink-0 p-4 border-b border-border">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="mt-2 h-6 w-32 rounded bg-muted" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 rounded bg-muted" />
        ))}
      </div>
    </aside>
  )
}
