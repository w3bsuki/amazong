"use client"

import { Link } from "@/i18n/routing"
import { Home, ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-1.5 text-sm text-[#565959] py-2 px-3 bg-[#f7f7f7] rounded-lg mb-4 ${className}`}>
      {/* Home link is always first */}
      <Link href="/" className="hover:text-[#c45500] hover:underline flex items-center">
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-[#888]" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-[#c45500] hover:underline flex items-center gap-1"
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <span className="text-[#0F1111] font-medium flex items-center gap-1">
              {item.icon}
              {item.label}
            </span>
          )}
        </span>
      ))}
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
