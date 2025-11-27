"use client"

import { Link } from "@/i18n/routing"
import { Home } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface BreadcrumbItemData {
  /** Display label for the breadcrumb item */
  label: string
  /** Optional href - if not provided, this is the current page (last item) */
  href?: string
  /** Optional icon to display before the label */
  icon?: React.ReactNode
}

interface AppBreadcrumbProps {
  /** Array of breadcrumb items. Last item is always treated as current page if no href */
  items: readonly BreadcrumbItemData[] | BreadcrumbItemData[]
  /** Additional CSS classes for the nav element */
  className?: string
  /** Whether to show home icon as first item. Defaults to true */
  showHome?: boolean
  /** Custom home label. Defaults to "Amazong" */
  homeLabel?: string
}

/**
 * Unified Breadcrumb component built on shadcn/ui primitives.
 * Uses Tailwind CSS v4 design tokens for consistent styling.
 * 
 * @example
 * ```tsx
 * <AppBreadcrumb 
 *   items={[
 *     { label: "Electronics", href: "/search?category=electronics" },
 *     { label: "Headphones", href: "/search?category=headphones" },
 *     { label: "Product Name" } // No href = current page
 *   ]}
 * />
 * ```
 */
export function AppBreadcrumb({ 
  items, 
  className,
  showHome = true,
  homeLabel = "Amazong"
}: AppBreadcrumbProps) {
  return (
    <Breadcrumb
      className={cn(
        "w-full border-b border-border py-3 mb-4",
        className
      )}
    >
      <BreadcrumbList className="text-sm text-muted-foreground flex-wrap">
        {/* Home link */}
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-1.5 text-foreground hover:text-brand hover:underline underline-offset-2 transition-colors min-h-9 px-1"
                >
                  <Home className="size-3.5" aria-hidden="true" />
                  <span>{homeLabel}</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {/* Dynamic items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isCurrentPage = isLast && !item.href

          return (
            <BreadcrumbItem key={index} className="min-w-0">
              {index > 0 && <BreadcrumbSeparator className="mr-1.5" />}
              
              {isCurrentPage ? (
                <BreadcrumbPage className="inline-flex items-center gap-1.5 text-muted-foreground font-normal truncate max-w-[200px] sm:max-w-[300px]">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    href={item.href || "#"} 
                    className="inline-flex items-center gap-1.5 text-foreground hover:text-brand hover:underline underline-offset-2 transition-colors min-h-9 px-1 truncate max-w-[150px] sm:max-w-[200px]"
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/**
 * Pre-configured breadcrumb items for common pages.
 * Use with AppBreadcrumb: `<AppBreadcrumb items={breadcrumbPresets.account} />`
 */
export const breadcrumbPresets = {
  todaysDeals: [{ label: "Today's Deals" }],
  customerService: [{ label: "Customer Service" }],
  giftCards: [{ label: "Gift Cards" }],
  registry: [{ label: "Registry & Gift Lists" }],
  sell: [{ label: "Sell on Amazong" }],
  account: [{ label: "Your Account" }],
  cart: [{ label: "Shopping Cart" }],
  checkout: [{ label: "Checkout" }],
  wishlist: [{ label: "Wishlist" }],
  about: [{ label: "About Us" }],
  contact: [{ label: "Contact Us" }],
  privacy: [{ label: "Privacy Policy" }],
  terms: [{ label: "Terms of Service" }],
  returns: [{ label: "Returns & Refunds" }],
} as const
