'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function DealsError({
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
      title="Deals unavailable"
      description="We couldn't load today's deals. Please try again in a moment."
      ctaIcon="tag"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Deals page"
    />
  )
}
