"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react"

type PayoutStatus = {
  seller_id: string
  stripe_connect_account_id: string | null
  details_submitted: boolean
  charges_enabled: boolean
  payouts_enabled: boolean
  created_at: string
  updated_at: string
} | null

type Props = {
  payoutStatus: PayoutStatus
  sellerEmail: string
}

export function SellerPayoutSetup({ payoutStatus, sellerEmail }: Props) {
  const t = useTranslations("seller.payouts")
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isComplete = payoutStatus?.details_submitted && payoutStatus?.charges_enabled && payoutStatus?.payouts_enabled

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

      const data = await response.json()
      if (!data?.url) {
        setError(t("errors.generic"))
        setLoading(false)
        return
      }

      // Redirect to Stripe onboarding
      window.location.href = data.url
    } catch (err) {
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

      const data = await response.json()
      if (!data?.url) {
        setError(t("errors.generic"))
        setLoading(false)
        return
      }

      // Open Stripe dashboard in new tab
      window.open(data.url, "_blank")
      setLoading(false)
    } catch (err) {
      setError(t("errors.generic"))
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("status")}
            {isComplete ? (
              <Badge variant="default" className="bg-success text-success-foreground">
                <CheckCircle className="size-3 mr-1" />
                {t("active")}
              </Badge>
            ) : payoutStatus?.stripe_connect_account_id ? (
              <Badge variant="secondary">
                <AlertCircle className="size-3 mr-1" />
                {t("incomplete")}
              </Badge>
            ) : (
              <Badge variant="outline">{t("notStarted")}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isComplete
              ? t("statusComplete")
              : payoutStatus?.stripe_connect_account_id
                ? t("statusIncomplete")
                : t("statusNotStarted")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Details */}
          {payoutStatus?.stripe_connect_account_id && (
            <div className="space-y-3 mb-6">
              <StatusItem
                label={t("detailsSubmitted")}
                completed={payoutStatus.details_submitted}
              />
              <StatusItem
                label={t("chargesEnabled")}
                completed={payoutStatus.charges_enabled}
              />
              <StatusItem
                label={t("payoutsEnabled")}
                completed={payoutStatus.payouts_enabled}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {!isComplete && (
              <Button onClick={handleStartOnboarding} disabled={loading}>
                {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                {payoutStatus?.stripe_connect_account_id
                  ? t("continueSetup")
                  : t("startSetup")}
              </Button>
            )}
            {isComplete && (
              <Button onClick={handleOpenDashboard} disabled={loading}>
                {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                {t("openDashboard")}
                <ExternalLink className="size-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("howItWorks")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{t("howItWorksDesc1")}</p>
          <p>{t("howItWorksDesc2")}</p>
          <p>{t("howItWorksDesc3")}</p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusItem({ label, completed }: { label: string; completed: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {completed ? (
        <CheckCircle className="size-4 text-success" />
      ) : (
        <AlertCircle className="size-4 text-muted-foreground" />
      )}
      <span className={completed ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  )
}
