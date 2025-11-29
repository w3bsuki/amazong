"use client"

import { Link } from "@/i18n/routing"
import { CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  /** Full-width style like Target.com - no background, just underlined links */
  variant?: "default" | "target"
}

export function Breadcrumb({ items, className = "", variant = "target" }: BreadcrumbProps) {
  // Target-style: Full-width, clean underlined links
  if (variant === "target") {
    return (
      <nav 
        aria-label="Breadcrumb"
        className={cn(
          "w-full border-b border-border py-3 mb-4",
          className
        )}
      >
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          {/* Home/Store link is always first */}
          <li className="flex items-center">
            <Link 
              href="/" 
              className="text-foreground hover:underline underline-offset-2 transition-colors"
            >
              Amazong
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <CaretRight size={14} weight="regular" className="text-muted-foreground/60 shrink-0" aria-hidden="true" />
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="text-foreground hover:underline underline-offset-2 transition-colors"
                >
                  {item.icon && <span className="shrink-0 mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-muted-foreground" aria-current="page">
                  {item.icon && <span className="shrink-0 mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // Default style: Background card with rounded corners
  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground",
        "py-2 sm:py-2.5 px-2.5 sm:px-3 bg-muted rounded-md mb-3 sm:mb-4",
        "overflow-x-auto no-scrollbar",
        className
      )}
    >
      {/* Home link */}
      <Link 
        href="/" 
        className="min-h-9 flex items-center hover:text-primary hover:underline shrink-0 transition-colors"
        aria-label="Home"
      >
        Amazong
      </Link>
      
      <ol className="flex items-center gap-1 sm:gap-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <CaretRight size={12} weight="regular" className="sm:size-3.5 text-muted-foreground/60" aria-hidden="true" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="min-h-9 flex items-center gap-1 px-1.5 hover:text-primary hover:underline rounded-md hover:bg-background/50 transition-colors"
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ) : (
              <span className="min-h-9 flex items-center gap-1 px-1.5 text-foreground font-medium" aria-current="page">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Pre-built breadcrumb configs for common pages
export const breadcrumbConfigs = {
  todaysDeals: [{ label: "Today's Deals" }],
  customerService: [{ label: "Customer Service" }],
  giftCards: [{ label: "Gift Cards" }],
  registry: [{ label: "Registry" }],
  sell: [{ label: "Sell" }],
  account: [{ label: "Your Account" }],
  cart: [{ label: "Cart" }],
  checkout: [{ label: "Checkout" }],
}
