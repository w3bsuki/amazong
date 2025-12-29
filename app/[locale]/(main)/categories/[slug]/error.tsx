'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function Error({
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
      title="Category unavailable"
      description="We couldn't load this category. This might be a temporary issue."
      ctaIcon="folder"
      ctaLabel="Browse categories"
      ctaHref="/categories"
      logPrefix="Category page"
    />
  )
}
