import * as React from "react"
import { Link } from "@/i18n/routing"
import { House } from "@/lib/icons/phosphor"
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
  /** Accessible label for the breadcrumb navigation */
  ariaLabel?: string
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
  ariaLabel,
  showHome = true,
  homeLabel = "Treido"
}: AppBreadcrumbProps) {
  const safeItems = items || []
  
  return (
    <Breadcrumb className={className} aria-label={ariaLabel}>
      <BreadcrumbList>
        {/* Home link - icon only on mobile */}
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1 min-h-6 min-w-6 p-1 -m-1">
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
 * Use with AppBreadcrumb: `<AppBreadcrumb items={breadcrumbPresets(t).account} />`
 */
export const breadcrumbPresets = (t: (key: string) => string) => {
  return {
    todaysDeals: [{ label: t("todaysDeals") }],
    customerService: [{ label: t("customerService") }],
    giftCards: [{ label: t("giftCards") }],
    registry: [{ label: t("registry") }],
    sell: [{ label: t("sell") }],
    account: [{ label: t("account") }],
    cart: [{ label: t("cart") }],
    checkout: [{ label: t("checkout") }],
    wishlist: [{ label: t("wishlist") }],
    about: [{ label: t("about") }],
    contact: [{ label: t("contact") }],
    privacy: [{ label: t("privacy") }],
    terms: [{ label: t("terms") }],
    cookies: [{ label: t("cookies") }],
    returns: [{ label: t("returns") }],
  } as const
}
