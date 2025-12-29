'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function CartError({
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
      title="Cart unavailable"
      description="We couldn't load your cart. Your items are safe - please try again."
      ctaIcon="cart"
      ctaLabel="Continue shopping"
      ctaHref="/"
      logPrefix="Cart page"
    />
  )
}
