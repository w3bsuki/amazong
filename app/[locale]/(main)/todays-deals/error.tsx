'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function DealsError({
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
      title={t('deals.title')}
      description={t('deals.description')}
      ctaIcon="tag"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Deals page"
    />
  )
}
