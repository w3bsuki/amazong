'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function SellerDashboardError({
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
      title="Dashboard unavailable"
      description="We couldn't load the seller dashboard right now. Please try again."
      ctaIcon="storefront"
      ctaLabel="Go to Sell"
      ctaHref="/sell"
      logPrefix="Seller dashboard"
    />
  )
}
