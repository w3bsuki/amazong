'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function CheckoutError({
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
      title="Checkout unavailable"
      description="We couldn't load checkout. Please try again."
      ctaIcon="house"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Checkout"
    />
  )
}
