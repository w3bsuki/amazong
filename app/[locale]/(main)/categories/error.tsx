'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function CategoriesError({
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
      title="Categories unavailable"
      description="We couldn't load the categories. Please try again or use search."
      ctaIcon="folder"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Categories page"
    />
  )
}
