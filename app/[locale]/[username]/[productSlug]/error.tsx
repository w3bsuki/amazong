'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function ProductPageError({
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
      title={t('product.title')}
      description={t('product.description')}
      ctaIcon="house"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Product page"
    />
  )
}
