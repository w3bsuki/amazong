'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function CategoriesError({
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
      title={t('categories.title')}
      description={t('categories.description')}
      ctaIcon="folder"
      ctaLabel={t('common.goToHomepage')}
      ctaHref="/"
      logPrefix="Categories page"
    />
  )
}
