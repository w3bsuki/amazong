'use client'

import { ErrorBoundaryUI } from '@/components/shared/error-boundary-ui'
import { useTranslations } from 'next-intl'

export default function Error({
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
      title={t('category.title')}
      description={t('category.description')}
      ctaIcon="folder"
      ctaLabel={t('common.browseCategories')}
      ctaHref="/categories"
      logPrefix="Category page"
    />
  )
}
