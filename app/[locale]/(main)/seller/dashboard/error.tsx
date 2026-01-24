'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function SellerDashboardError({
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
      title={t('sellerDashboard.title')}
      description={t('sellerDashboard.description')}
      ctaIcon="storefront"
      ctaLabel={t('common.goToSell')}
      ctaHref="/sell"
      logPrefix="Seller dashboard"
    />
  )
}
