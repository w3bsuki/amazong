"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { WarningCircle, ArrowCounterClockwise, House, Storefront, ShoppingCart, Heart, MagnifyingGlass, Users, Tag, Folder, User, CreditCard } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"

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
    console.error(`${logPrefix} error:`, error)
  }, [error, logPrefix])

  const CtaIcon = iconMap[ctaIcon]

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <WarningCircle className="size-10 text-destructive" weight="fill" />
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

          <Link href={ctaHref}>
            <Button className="gap-2 bg-brand hover:bg-brand/90 w-full sm:w-auto">
              <CtaIcon className="size-4" />
              {ctaLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
