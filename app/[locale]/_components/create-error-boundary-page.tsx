"use client"

import { useTranslations } from "next-intl"

import { ErrorBoundaryUI, type ErrorBoundaryUIProps } from "./error-boundary-ui"

type CreateErrorBoundaryPageConfig = {
  titleKey: string
  descriptionKey: string
  ctaIcon?: ErrorBoundaryUIProps["ctaIcon"]
  ctaLabelKey: string
  ctaHref: string
  logPrefix?: string
}

export function createErrorBoundaryPage(config: CreateErrorBoundaryPageConfig) {
  return function ErrorBoundaryPage({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) {
    const t = useTranslations("Errors")

    return (
        <ErrorBoundaryUI
          error={error}
          reset={reset}
          title={t(config.titleKey)}
          description={t(config.descriptionKey)}
          ctaIcon={config.ctaIcon ?? "house"}
          ctaLabel={t(config.ctaLabelKey)}
          ctaHref={config.ctaHref}
          logPrefix={config.logPrefix ?? "Page"}
        />
    )
  }
}
