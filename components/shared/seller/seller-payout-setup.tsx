"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react"

type PayoutStatus = {
  stripe_connect_account_id: string | null
  details_submitted: boolean
  charges_enabled: boolean
  payouts_enabled: boolean
} | null

type Props = {
  payoutStatus: PayoutStatus
}

export function SellerPayoutSetup({ payoutStatus }: Props) {
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

      const data = await response.json()
      if (!data?.url) {
        setError(t("errors.generic"))
        setLoading(false)
        return
      }

      // Open Stripe dashboard in new tab
      window.open(data.url, "_blank")
      setLoading(false)
    } catch {
      setError(t("errors.generic"))
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("status")}
          {isComplete ? (
            <Badge variant="verified">
              <CheckCircle className="size-3" />
              {t("active")}
            </Badge>
          ) : payoutStatus?.stripe_connect_account_id ? (
            <Badge variant="stock-low">
              <AlertCircle className="size-3" />
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
        {payoutStatus?.stripe_connect_account_id ? (
          <div className="space-y-3 mb-6">
            <StatusItem label={t("detailsSubmitted")} completed={payoutStatus.details_submitted} />
            <StatusItem label={t("chargesEnabled")} completed={payoutStatus.charges_enabled} />
            <StatusItem label={t("payoutsEnabled")} completed={payoutStatus.payouts_enabled} />
          </div>
        ) : null}

        {/* Error Message */}
        {error ? (
          <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {!isComplete ? (
            <Button onClick={handleStartOnboarding} disabled={loading}>
              {loading ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
              {payoutStatus?.stripe_connect_account_id ? t("continueSetup") : t("startSetup")}
            </Button>
          ) : (
            <Button onClick={handleOpenDashboard} disabled={loading}>
              {loading ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
              {t("openDashboard")}
              <ExternalLink className="size-4 ml-2" />
            </Button>
          )}
        </div>

        {/* How it works (kept, but de-emphasized to avoid a second "card") */}
        <div className="mt-6 border-t border-border pt-4 space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{t("howItWorks")}</p>
          <p>{t("howItWorksDesc1")}</p>
          <p>{t("howItWorksDesc2")}</p>
          <p>{t("howItWorksDesc3")}</p>
        </div>
      </CardContent>
    </Card>
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
      <span className={completed ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  )
}
