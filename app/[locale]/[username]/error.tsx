'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function ProfileError({
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
      title="Profile unavailable"
      description="We couldn't load this profile. This might be a temporary issue."
      ctaIcon="user"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Profile page"
    />
  )
}
