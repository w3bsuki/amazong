'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function SellError({
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
      title="Sell page unavailable"
      description="We couldn't load the sell flow. Please try again."
      ctaIcon="house"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Sell"
    />
  )
}
