'use client'

import { ErrorBoundaryUI } from '../_components/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function SellGroupError({
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
      title={t('sell.title')}
      description={t('sell.description')}
      ctaIcon="house"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Sell"
    />
  )
}
