'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function AccountError({
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
      title="Account unavailable"
      description="We couldn't load your account. Please try again or sign in again."
      ctaIcon="user"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Account page"
    />
  )
}
