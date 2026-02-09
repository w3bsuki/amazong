'use client'

import { ErrorBoundaryUI } from '../../_components/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function CheckoutError({
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
      title={t('checkout.title')}
      description={t('checkout.description')}
      ctaIcon="house"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Checkout"
    />
  )
}

