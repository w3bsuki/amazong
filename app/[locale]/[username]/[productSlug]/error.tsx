'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function ProductPageError({
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
      title="Product unavailable"
      description="We couldn't load this product page. Please try again."
      ctaIcon="house"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Product page"
    />
  )
}
