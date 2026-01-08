"use client"

import { forwardRef } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

interface CategoryNavItemBaseProps {
  isActive: boolean
  variant: "tab" | "pill"
  children: React.ReactNode
  className?: string
  "data-tab"?: string
}

interface CategoryNavItemLinkProps extends CategoryNavItemBaseProps {
  href: string
  onClick?: never
}

interface CategoryNavItemButtonProps extends CategoryNavItemBaseProps {
  href?: never
  onClick: () => void
}

export type CategoryNavItemProps = CategoryNavItemLinkProps | CategoryNavItemButtonProps

// =============================================================================
// Component
// =============================================================================

export const CategoryNavItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  CategoryNavItemProps
>(function CategoryNavItem(
  { href, onClick, isActive, variant, children, className, ...props },
  ref
) {
  // Tab variant: underline-style, padding provides touch area
  const tabStyles = cn(
    "shrink-0 min-h-touch px-1.5 text-sm relative flex items-center",
    "border-b-2",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "transition-colors",
    isActive
      ? "text-foreground border-foreground"
      : "text-muted-foreground border-transparent hover:text-foreground"
  )

  // Pill variant: compact rounded pill, visually refined
  const pillStyles = cn(
    "shrink-0 h-touch-sm px-3 text-xs font-semibold rounded-full whitespace-nowrap",
    "flex items-center justify-center",
    "border",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "transition-colors",
    isActive
      ? "bg-foreground text-background border-foreground"
      : "bg-background text-muted-foreground border-border/60 hover:border-border hover:bg-muted/40 hover:text-foreground"
  )

  const styles = variant === "tab" ? tabStyles : pillStyles

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        role="tab"
        aria-selected={isActive}
        className={cn(styles, className)}
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      role="tab"
      onClick={onClick}
      aria-selected={isActive}
      className={cn(styles, className)}
      {...props}
    >
      {children}
    </button>
  )
})

// =============================================================================
// Tab Content (for underline-style tabs)
// =============================================================================

interface TabContentProps {
  label: string
  isActive: boolean
}

export function TabContent({ label, isActive }: TabContentProps) {
  return (
    <span className="relative inline-flex flex-col items-center">
      <span
        className={cn(
          "transition-[font-weight] duration-100",
          isActive ? "font-bold" : "font-medium"
        )}
      >
        {label}
      </span>
      {/* Invisible bold text to prevent layout shift */}
      <span
        className="font-bold invisible h-0 overflow-hidden"
        aria-hidden="true"
      >
        {label}
      </span>
    </span>
  )
}
