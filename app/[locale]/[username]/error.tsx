'use client'

import { useTranslations } from 'next-intl'

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('ProfileError')

  return (
    <div className="min-h-(--page-section-min-h) flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('title')}</h1>
        <p className="text-muted-foreground mb-3">
          {t('description')}
        </p>

        {error.digest ? (
          <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted px-3 py-2 rounded">
            {t('errorId')}: {error.digest}
          </p>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {t('tryAgain')}
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-brand/90"
          >
            {t('goToHomepage')}
          </a>
        </div>
      </div>
    </div>
  )
}
