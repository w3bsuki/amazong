'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'

export default function MembersError({
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
      title="Members unavailable"
      description="We couldn't load the community members list. Please try again."
      ctaIcon="users"
      ctaLabel="Go to homepage"
      ctaHref="/"
      logPrefix="Members page"
    />
  )
}
