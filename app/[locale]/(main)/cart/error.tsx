'use client'

import { ErrorBoundaryUI } from '../../_components/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function CartError({
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
      title={t('cart.title')}
      description={t('cart.description')}
      ctaIcon="cart"
      ctaLabel={t('common.continueShopping')}
      ctaHref="/"
      logPrefix="Cart page"
    />
  )
}

