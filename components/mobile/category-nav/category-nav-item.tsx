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
  // Tab variant: Treido underline-style - text-sm, h-10
  const tabStyles = cn(
    "shrink-0 relative flex items-center justify-center min-w-10 h-10 px-1",
    "text-sm font-medium whitespace-nowrap",
    "tap-highlight-transparent",
    "transition-colors",
    isActive
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground"
  )

  // Pill variant: Treido chip style - text-xs, h-8
  const pillStyles = cn(
    "shrink-0 h-8 px-3 text-xs font-medium rounded-md whitespace-nowrap",
    "flex items-center justify-center",
    "border transition-colors",
    isActive
      ? "border-foreground bg-foreground text-background"
      : "border-border/50 bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
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
    <span className="relative inline-flex items-center">
      <span className={cn("transition-colors", "font-medium")}>
        {label}
      </span>
      {/* Treido 2px underline indicator */}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 translate-y-1 bg-foreground rounded-full" />
      )}
    </span>
  )
}
