'use client'

import { ErrorBoundaryUI } from '../_components/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function AccountGroupError({
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
      title={t('account.title')}
      description={t('account.description')}
      ctaIcon="user"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Account"
    />
  )
}
