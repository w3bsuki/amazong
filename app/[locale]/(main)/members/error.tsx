'use client'

import { ErrorBoundaryUI } from '../../_components/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function MembersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('Errors')

  return (
    <ErrorBoundaryUI
      error={error}
      reset={reset}
      title={t('members.title')}
      description={t('members.description')}
      ctaIcon="users"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Members page"
    />
  )
}

