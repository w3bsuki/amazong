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
      title="Something went wrong"
      description="We encountered an unexpected error. Our team has been notified and is working to fix the issue."
      ctaIcon="house"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Application"
    />
  )
}
