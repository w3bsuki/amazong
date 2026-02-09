'use client'

import { ErrorBoundaryUI } from '../../_components/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function SearchError({
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
      title={t('search.title')}
      description={t('search.description')}
      ctaIcon="search"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Search page"
    />
  )
}

