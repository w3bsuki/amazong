'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function WishlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorBoundaryUI
      error={error}
      reset={reset}
      title="Wishlist unavailable"
      description="We couldn't load your wishlist. Your saved items are safe - please try again."
      ctaIcon="house"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Wishlist"
    />
  )
}
