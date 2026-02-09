'use client'

import { ErrorBoundaryUI } from '../../_components/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function WishlistError({
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
      title={t('wishlist.title')}
      description={t('wishlist.description')}
      ctaIcon="house"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Wishlist"
    />
  )
}

