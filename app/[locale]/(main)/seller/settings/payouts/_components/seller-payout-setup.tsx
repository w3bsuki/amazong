"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  SellerPayoutSetupCompact,
  SellerPayoutSetupFull,
} from "./seller-payout-setup-layouts"

type PayoutStatus = {
  stripe_connect_account_id: string | null
  details_submitted: boolean
  charges_enabled: boolean
  payouts_enabled: boolean
} | null

type Props = {
  payoutStatus: PayoutStatus
  variant?: "full" | "compact"
}

function isConnectUrlResponse(value: unknown): value is { url: string } {
  if (!value || typeof value !== "object") return false
  const candidate = value as { url?: unknown }
  return typeof candidate.url === "string" && candidate.url.length > 0
}

export function SellerPayoutSetup({ payoutStatus, variant = "full" }: Props) {
  const t = useTranslations("seller.payouts")
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isComplete = payoutStatus?.details_submitted && payoutStatus?.charges_enabled && payoutStatus?.payouts_enabled
  const hasStarted = !!payoutStatus?.stripe_connect_account_id

  const getErrorMessage = (action: "onboarding" | "dashboard", status: number) => {
    if (status === 401) return t("errors.unauthorized")
    if (status === 403) return t("errors.forbidden")

    if (action === "dashboard") {
      if (status === 404) return t("errors.noAccount")
      if (status === 400) return t("errors.onboardingIncomplete")
      return t("errors.dashboardFailed")
    }

    return t("errors.onboardingFailed")
  }

  const handleStartOnboarding = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/connect/onboarding", {
        method: "POST",
        headers: {
          "x-next-intl-locale": locale,
        },
      })

      if (!response.ok) {
        setError(getErrorMessage("onboarding", response.status))
        setLoading(false)
        return
      }

      const data: unknown = await response.json()
      if (!isConnectUrlResponse(data)) {
        setError(t("errors.generic"))
        setLoading(false)
        return
      }

      window.location.href = data.url
    } catch {
      setError(t("errors.generic"))
      setLoading(false)
    }
  }

  const handleOpenDashboard = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/connect/dashboard", {
        method: "POST",
        headers: {
          "x-next-intl-locale": locale,
        },
      })

      if (!response.ok) {
        setError(getErrorMessage("dashboard", response.status))
        setLoading(false)
        return
      }

      const data: unknown = await response.json()
      if (!isConnectUrlResponse(data)) {
        setError(t("errors.generic"))
        setLoading(false)
        return
      }

      window.open(data.url, "_blank")
      setLoading(false)
    } catch {
      setError(t("errors.generic"))
      setLoading(false)
    }
  }

  const title = isComplete ? t("titleComplete") : hasStarted ? t("titleContinue") : t("titleSetup")
  const fullDescription = isComplete
    ? t("descriptionComplete")
    : hasStarted
      ? t("descriptionContinue")
      : t("descriptionSetup")
  const compactDescription = isComplete
    ? t("statusComplete")
    : hasStarted
      ? t("statusIncomplete")
      : t("statusNotStarted")

  if (variant !== "compact") {
    return (
      <SellerPayoutSetupFull
        t={t}
        isComplete={Boolean(isComplete)}
        hasStarted={hasStarted}
        payoutStatus={payoutStatus}
        loading={loading}
        error={error}
        title={title}
        fullDescription={fullDescription}
        onStartOnboarding={handleStartOnboarding}
        onOpenDashboard={handleOpenDashboard}
      />
    )
  }

  return (
    <SellerPayoutSetupCompact
      t={t}
      isComplete={Boolean(isComplete)}
      hasStarted={hasStarted}
      payoutStatus={payoutStatus}
      loading={loading}
      error={error}
      title={title}
      compactDescription={compactDescription}
      onStartOnboarding={handleStartOnboarding}
      onOpenDashboard={handleOpenDashboard}
    />
  )
}
