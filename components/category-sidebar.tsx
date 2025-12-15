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
import { Badge } from '@/components/ui/badge'
import type { 
  Category, 
  CategoryContext 
} from '@/lib/data/categories'
import { AttributeFilters } from '@/components/attribute-filters'

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

interface CategoryNavItemProps {
  category: Category
  isActive: boolean
  isExpanded?: boolean
  children?: Category[]
  onToggle?: () => void
  locale: string
}

// =============================================================================
// Helper Functions
// =============================================================================

function getCategoryName(category: Category, locale: string): string {
  return locale === 'bg' && category.name_bg ? category.name_bg : category.name
}

// =============================================================================
// Sub-Components
// =============================================================================

function CategoryNavItem({
  category,
  isActive,
  isExpanded = false,
  children = [],
  onToggle,
  locale,
}: CategoryNavItemProps) {
  const hasChildren = children.length > 0
  const name = getCategoryName(category, locale)

  return (
    <div className="w-full">
      <div
        className={cn(
          'group flex w-full items-center gap-1',
          'rounded-sm transition-colors duration-150',
          isActive 
            ? 'text-sidebar-primary font-medium' 
            : 'text-sidebar-foreground hover:text-sidebar-primary'
        )}
      >
        {/* Expand/collapse button for items with children */}
        {hasChildren ? (
          <button
            onClick={onToggle}
            className={cn(
              'flex size-6 shrink-0 items-center justify-center',
              'rounded-sm text-muted-foreground',
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              'transition-colors duration-150'
            )}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <CaretDown size={14} weight="bold" />
            ) : (
              <CaretRight size={14} weight="bold" />
            )}
          </button>
        ) : (
          <span className="size-6 shrink-0" />
        )}

        {/* Category link */}
        <Link
          href={`/categories/${category.slug}`}
          className={cn(
            'flex-1 truncate py-1.5 text-sm leading-snug',
            'hover:underline underline-offset-2',
            isActive && 'font-medium'
          )}
        >
          {name}
        </Link>

        {/* Active indicator */}
        {isActive && (
          <span 
            className="size-1.5 shrink-0 rounded-full bg-sidebar-primary" 
            aria-hidden="true" 
          />
        )}
      </div>

      {/* Children (subcategories) */}
      {hasChildren && isExpanded && (
        <ul 
          className={cn(
            'ml-3 mt-0.5 space-y-0.5',
            'border-l-2 border-sidebar-border pl-3'
          )}
        >
          {children.map((child) => (
            <li key={child.id}>
              <Link
                href={`/categories/${child.slug}`}
                className={cn(
                  'block truncate py-1 text-sm leading-snug',
                  'text-muted-foreground',
                  'hover:text-sidebar-primary hover:underline underline-offset-2',
                  'transition-colors duration-150'
                )}
              >
                {getCategoryName(child, locale)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ParentBreadcrumb({ 
  parent, 
  locale 
}: { 
  parent: Category | null
  locale: string 
}) {
  if (!parent) {
    return (
      <Link
        href="/categories"
        className={cn(
          'group flex items-center gap-1.5',
          'text-sm text-muted-foreground',
          'hover:text-sidebar-primary',
          'transition-colors duration-150'
        )}
      >
        <CaretLeft size={14} weight="bold" className="shrink-0" />
        <House size={14} weight="regular" className="shrink-0" />
        <span className="group-hover:underline underline-offset-2">
          All Categories
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={`/categories/${parent.slug}`}
      className={cn(
        'group flex items-center gap-1.5',
        'text-sm text-muted-foreground',
        'hover:text-sidebar-primary',
        'transition-colors duration-150'
      )}
    >
      <CaretLeft size={14} weight="bold" className="shrink-0" />
      <span className="truncate group-hover:underline underline-offset-2">
        {getCategoryName(parent, locale)}
      </span>
    </Link>
  )
}

function SidebarSection({ 
  title, 
  children,
  icon,
  count
}: { 
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  count?: number
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className={cn(
          'flex items-center gap-1.5',
          'text-xs font-semibold uppercase tracking-wide',
          'text-muted-foreground'
        )}>
          {icon}
          {title}
        </h3>
        {typeof count === 'number' && count > 0 && (
          <Badge 
            variant="secondary" 
            className="h-5 px-1.5 text-2xs font-medium"
          >
            {count}
          </Badge>
        )}
      </div>
      {children}
    </div>
  )
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
  const { current, parent, siblings, children, attributes } = context

  // Track which sibling categories are expanded
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => {
    // Auto-expand current category
    return new Set([current.id])
  })

  const toggleExpanded = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Filter only filterable attributes
  const filterableAttributes = React.useMemo(
    () => attributes.filter((attr) => attr.is_filterable),
    [attributes]
  )

  const currentName = getCategoryName(current, locale)

  return (
    <aside
      className={cn(
        'flex h-full w-64 shrink-0 flex-col',
        'border-r border-sidebar-border',
        'bg-sidebar text-sidebar-foreground',
        className
      )}
    >
      {/* Header with parent link */}
      <div className="shrink-0 border-b border-sidebar-border p-4">
        <ParentBreadcrumb parent={parent} locale={locale} />
        
        {/* Current category title */}
        <h2 className={cn(
          'mt-3 text-lg font-semibold leading-tight',
          'text-sidebar-foreground'
        )}>
          {currentName}
        </h2>
        
        {/* Product count badge - can be passed via context in future */}
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Category Navigation */}
          <SidebarSection 
            title={locale === 'bg' ? 'Категории' : 'Categories'}
            count={siblings.length}
          >
            <nav className="space-y-0.5">
              {siblings.map((sibling) => {
                const isCurrentSibling = sibling.id === current.id
                const isExpanded = expandedIds.has(sibling.id)
                
                return (
                  <CategoryNavItem
                    key={sibling.id}
                    category={sibling}
                    isActive={isCurrentSibling}
                    isExpanded={isExpanded}
                    children={isCurrentSibling ? children : []}
                    onToggle={() => toggleExpanded(sibling.id)}
                    locale={locale}
                  />
                )
              })}
            </nav>
          </SidebarSection>

          {/* Attribute Filters */}
          {filterableAttributes.length > 0 && (
            <>
              <Separator className="bg-sidebar-border" />
              
              <SidebarSection 
                title={locale === 'bg' ? 'Филтри' : 'Filters'}
                icon={<Funnel size={12} weight="bold" />}
                count={filterableAttributes.length}
              >
                <AttributeFilters
                  attributes={filterableAttributes}
                  searchParams={searchParams}
                  locale={locale}
                />
              </SidebarSection>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer with clear filters - show only when filters active */}
      {Object.keys(searchParams).some((key) => key.startsWith('attr_')) && (
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <Link
            href={`/categories/${current.slug}`}
            className={cn(
              'flex w-full items-center justify-center gap-1.5',
              'rounded-sm px-3 py-2',
              'text-sm font-medium',
              'bg-sidebar-accent text-sidebar-accent-foreground',
              'hover:bg-sidebar-primary hover:text-sidebar-primary-foreground',
              'transition-colors duration-150'
            )}
          >
            {locale === 'bg' ? 'Изчисти филтрите' : 'Clear filters'}
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
        'flex h-full w-64 shrink-0 flex-col',
        'border-r border-sidebar-border',
        'bg-sidebar animate-pulse',
        className
      )}
    >
      {/* Header skeleton */}
      <div className="shrink-0 border-b border-sidebar-border p-4">
        <div className="h-4 w-24 rounded bg-sidebar-accent" />
        <div className="mt-3 h-6 w-36 rounded bg-sidebar-accent" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 space-y-4 p-4">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-sidebar-accent" />
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="h-8 rounded bg-sidebar-accent" 
                style={{ width: `${60 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
