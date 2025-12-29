'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function SearchError({
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
      title="Search failed"
      description="We couldn't complete your search. Please try again or browse our categories."
      ctaIcon="search"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Search page"
    />
  )
}
