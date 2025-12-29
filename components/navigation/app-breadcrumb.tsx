"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { House } from "@phosphor-icons/react"
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
  /** Custom home label. Defaults to "Treido" */
  homeLabel?: string
}

/**
 * Unified Breadcrumb component built on shadcn/ui primitives.
 * Follows shadcn/ui + Tailwind CSS v4 best practices.
 * 
 * - Uses semantic HTML: <nav aria-label="breadcrumb"> + <ol>
 * - Proper ARIA: aria-current="page" on current page
 * - Separators are aria-hidden
 * - Accessible for screen readers
 * - Mobile: horizontal scroll with truncation for long titles
 */
export function AppBreadcrumb({ 
  items = [], 
  className,
  showHome = true,
  homeLabel = "Treido"
}: AppBreadcrumbProps) {
  const safeItems = items || []
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {/* Home link - icon only on mobile */}
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  <House size={16} weight="regular" aria-hidden="true" />
                  <span className="hidden sm:inline">{homeLabel}</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {safeItems.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {/* Dynamic items */}
        {safeItems.map((item, index) => {
          const isLast = index === safeItems.length - 1
          const isCurrentPage = isLast && !item.href

          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isCurrentPage ? (
                  <BreadcrumbPage title={item.label}>
                    {item.icon && <span className="mr-1" aria-hidden="true">{item.icon}</span>}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href || "#"} className="whitespace-nowrap">
                      {item.icon && <span className="mr-1" aria-hidden="true">{item.icon}</span>}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
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
  sell: [{ label: "Sell on Treido" }],
  account: [{ label: "Your Account" }],
  cart: [{ label: "Shopping Cart" }],
  checkout: [{ label: "Checkout" }],
  wishlist: [{ label: "Wishlist" }],
  about: [{ label: "About Us" }],
  contact: [{ label: "Contact Us" }],
  privacy: [{ label: "Privacy Policy" }],
  terms: [{ label: "Terms of Service" }],
  cookies: [{ label: "Cookie Policy" }],
  returns: [{ label: "Returns & Refunds" }],
} as const
