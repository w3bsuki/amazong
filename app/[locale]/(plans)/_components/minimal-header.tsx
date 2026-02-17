"use client"

import { Link } from "@/i18n/routing"
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface MinimalHeaderProps {
  /** Show back button */
  showBack?: boolean
  /** Custom back link destination */
  backHref?: string
  /** Custom back button label */
  backLabel?: string
  /** Children to render on the right side */
  children?: React.ReactNode
  /** Additional className */
  className?: string
}

/**
 * Minimal Header Component
 * 
 * A clean, distraction-free header for standalone pages like:
 * - /plans (pricing page)
 * - /auth (login, signup, password reset)
 * - /sell (listing creation flow)
 * 
 * Features:
 * - Logo with link to homepage
 * - Optional back button
 * - Sticky positioning with blur backdrop
 * - Consistent with CheckoutHeader design
 */
export function MinimalHeader({ 
  showBack = true,
  backHref,
  backLabel,
  children,
  className 
}: MinimalHeaderProps) {
  const tCommon = useTranslations("Common")

  const homeHref = "/"
  const resolvedBackHref = backHref || homeHref
  const resolvedBackLabel = backLabel || tCommon("back")

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background",
      className
    )}>
      <div className="container">
        <div className="flex h-(--control-primary) items-center justify-between gap-3 md:h-14">
          {/* Left: Back button or Logo */}
          <div className="flex items-center gap-2.5">
            {showBack && (
              <Button variant="ghost" size="sm" asChild className="-ml-2 h-(--control-default) px-3">
                <Link href={resolvedBackHref}>
                  <ArrowLeft className="mr-1.5 size-4" />
                  <span className="hidden sm:inline">{resolvedBackLabel}</span>
                </Link>
              </Button>
            )}
            
            {/* Logo */}
            <Link 
              href={homeHref}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label={tCommon("goToHomepage")}
            >
              <ShoppingCart className="size-6 text-primary" />
              <span className="text-xl font-semibold tracking-tight">treido.</span>
            </Link>
          </div>

          {/* Right: Custom content */}
          {children && (
            <div className="flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
