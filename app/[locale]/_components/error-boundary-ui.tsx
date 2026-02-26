"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcw as ArrowCounterClockwise, CreditCard, Folder, Heart, House, Search as MagnifyingGlass, ShoppingCart, Store as Storefront, Tag, User, Users, CircleAlert as WarningCircle } from "lucide-react";
import { type LucideIcon as PhosphorIcon } from "lucide-react";

import { Link } from "@/i18n/routing"


import { logger } from "@/lib/logger"
type ErrorIcon = 
  | "house" 
  | "storefront" 
  | "cart" 
  | "heart" 
  | "search" 
  | "users" 
  | "tag" 
  | "folder" 
  | "user"
  | "credit-card"

const iconMap: Record<ErrorIcon, PhosphorIcon> = {
  house: House,
  storefront: Storefront,
  cart: ShoppingCart,
  heart: Heart,
  search: MagnifyingGlass,
  users: Users,
  tag: Tag,
  folder: Folder,
  user: User,
  "credit-card": CreditCard,
}

export interface ErrorBoundaryUIProps {
  error: Error & { digest?: string }
  reset: () => void
  title: string
  description: string
  /** Icon name for the primary action button */
  ctaIcon?: ErrorIcon
  /** Label for the primary action button */
  ctaLabel: string
  /** Href for the primary action link */
  ctaHref: string
  /** Console log prefix for debugging */
  logPrefix?: string
}

/**
 * Shared error boundary UI component.
 * Use this in error.tsx files to provide consistent error handling UX.
 * 
 * @example
 * ```tsx
 * export default function WishlistError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
 *   return (
 *     <ErrorBoundaryUI
 *       error={error}
 *       reset={reset}
 *       title="Wishlist unavailable"
 *       description="We couldn't load your wishlist. Your saved items are safe - please try again."
 *       ctaIcon="heart"
 *       ctaLabel="Go to homepage"
 *       ctaHref="/"
 *       logPrefix="Wishlist"
 *     />
 *   )
 * }
 * ```
 */
export function ErrorBoundaryUI({
  error,
  reset,
  title,
  description,
  ctaIcon = "house",
  ctaLabel,
  ctaHref,
  logPrefix = "Page",
}: ErrorBoundaryUIProps) {
  useEffect(() => {
    logger.error(`${logPrefix} error:`, error)
  }, [error, logPrefix])

  const CtaIcon = iconMap[ctaIcon]

  return (
    <div className="min-h-(--page-section-min-h) flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="size-20 bg-destructive-subtle rounded-full flex items-center justify-center mx-auto mb-3">
          <WarningCircle className="size-10 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>

        <p className="text-muted-foreground mb-3">{description}</p>

        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted px-3 py-2 rounded">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="gap-2">
            <ArrowCounterClockwise className="size-4" />
            Try again
          </Button>

          <Button asChild variant="cta" className="gap-2 w-full sm:w-auto">
            <Link href={ctaHref}>
              <CtaIcon className="size-4" />
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
