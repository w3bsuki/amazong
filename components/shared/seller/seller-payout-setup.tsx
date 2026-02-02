"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  CreditCard,
  Wallet,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ExternalLink,
  Loader2,
} from "lucide-react"

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

      const data = await response.json()
      if (!data?.url) {
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

      const data = await response.json()
      if (!data?.url) {
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

  // Full layout (seller settings page)
  if (variant !== "compact") {
    return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-8 px-4">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="size-20 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary"
      >
        {isComplete ? (
          <CheckCircle2 className="size-10 text-primary-foreground" strokeWidth={2} />
        ) : (
          <Wallet className="size-10 text-primary-foreground" strokeWidth={2} />
        )}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
      >
        {title}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="text-muted-foreground text-base mb-8 max-w-sm"
      >
        {fullDescription}
      </motion.p>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-3 mb-6 bg-destructive-subtle text-destructive rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* CTA Button */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="w-full"
      >
        {!isComplete ? (
          <Button
            onClick={handleStartOnboarding}
            disabled={loading}
            size="lg"
            className="w-full h-12 text-base font-semibold shadow-md"
          >
            {loading ? (
              <Loader2 className="size-5 mr-2 animate-spin" />
            ) : (
              <CreditCard className="size-5 mr-2" />
            )}
            {hasStarted ? t("continueSetup") : t("startSetup")}
            <ArrowRight className="size-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleOpenDashboard}
            disabled={loading}
            size="lg"
            variant="outline"
            className="w-full h-12 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="size-5 mr-2 animate-spin" />
            ) : null}
            {t("openDashboard")}
            <ExternalLink className="size-5 ml-2" />
          </Button>
        )}
      </motion.div>

      {/* Progress indicators for incomplete setup */}
      {hasStarted && !isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 w-full space-y-2"
        >
          <div className="flex items-center gap-2 text-sm">
            <div className={`size-5 rounded-full flex items-center justify-center ${payoutStatus?.details_submitted ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
              {payoutStatus?.details_submitted ? <CheckCircle2 className="size-3" /> : <span className="text-xs">1</span>}
            </div>
            <span className={payoutStatus?.details_submitted ? "text-foreground" : "text-muted-foreground"}>
              {t("detailsSubmitted")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`size-5 rounded-full flex items-center justify-center ${payoutStatus?.charges_enabled ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
              {payoutStatus?.charges_enabled ? <CheckCircle2 className="size-3" /> : <span className="text-xs">2</span>}
            </div>
            <span className={payoutStatus?.charges_enabled ? "text-foreground" : "text-muted-foreground"}>
              {t("chargesEnabled")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`size-5 rounded-full flex items-center justify-center ${payoutStatus?.payouts_enabled ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
              {payoutStatus?.payouts_enabled ? <CheckCircle2 className="size-3" /> : <span className="text-xs">3</span>}
            </div>
            <span className={payoutStatus?.payouts_enabled ? "text-foreground" : "text-muted-foreground"}>
              {t("payoutsEnabled")}
            </span>
          </div>
        </motion.div>
      )}

      {/* Benefits - only for new setup */}
      {!hasStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 pt-8 border-t border-border w-full"
        >
          <div className="grid gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-selected flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("benefit1Title")}</p>
                <p className="text-xs text-muted-foreground">{t("benefit1Desc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-selected flex items-center justify-center shrink-0">
                <Zap className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("benefit2Title")}</p>
                <p className="text-xs text-muted-foreground">{t("benefit2Desc")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
    )
  }

  // Compact layout (sell gate on mobile): sticky CTA, minimal copy
  return (
    <div className="mx-auto w-full max-w-md px-4 pt-4 pb-safe text-center">
      <div className="flex flex-col items-center">
        <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-sm">
          {isComplete ? (
            <CheckCircle2 className="size-7 text-primary-foreground" strokeWidth={2} />
          ) : (
            <Wallet className="size-7 text-primary-foreground" strokeWidth={2} />
          )}
        </div>

        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground leading-snug line-clamp-2">{compactDescription}</p>

        {/* Minimal status chips (only if setup already started) */}
        {hasStarted && !isComplete && (
          <div className="mt-3 w-full flex flex-wrap justify-center gap-2">
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
              payoutStatus?.details_submitted
                ? "border-success bg-success-subtle text-foreground"
                : "border-border bg-surface-subtle text-muted-foreground"
            )}>
              <span className={cn(
                "inline-flex size-4 items-center justify-center rounded-full text-2xs",
                payoutStatus?.details_submitted
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {payoutStatus?.details_submitted ? <CheckCircle2 className="size-3" /> : "1"}
              </span>
              <span className="truncate max-w-48">{t("detailsSubmitted")}</span>
            </div>

            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
              payoutStatus?.charges_enabled
                ? "border-success bg-success-subtle text-foreground"
                : "border-border bg-surface-subtle text-muted-foreground"
            )}>
              <span className={cn(
                "inline-flex size-4 items-center justify-center rounded-full text-2xs",
                payoutStatus?.charges_enabled
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {payoutStatus?.charges_enabled ? <CheckCircle2 className="size-3" /> : "2"}
              </span>
              <span className="truncate max-w-48">{t("chargesEnabled")}</span>
            </div>

            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
              payoutStatus?.payouts_enabled
                ? "border-success bg-success-subtle text-foreground"
                : "border-border bg-surface-subtle text-muted-foreground"
            )}>
              <span className={cn(
                "inline-flex size-4 items-center justify-center rounded-full text-2xs",
                payoutStatus?.payouts_enabled
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {payoutStatus?.payouts_enabled ? <CheckCircle2 className="size-3" /> : "3"}
              </span>
              <span className="truncate max-w-48">{t("payoutsEnabled")}</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-22" aria-hidden="true" />

      {/* Fixed bottom CTA (always visible, no scroll required) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-4 pt-3 pb-safe backdrop-blur">
        <div className="mx-auto w-full max-w-md pb-4">
        {error && (
          <div className="w-full p-3 mb-3 bg-destructive-subtle text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isComplete ? (
          <Button
            onClick={handleStartOnboarding}
            disabled={loading}
            size="lg"
            className="w-full h-12 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="size-5 mr-2 animate-spin" />
            ) : (
              <CreditCard className="size-5 mr-2" />
            )}
            {hasStarted ? t("continueSetup") : t("startSetup")}
            <ArrowRight className="size-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleOpenDashboard}
            disabled={loading}
            size="lg"
            variant="outline"
            className="w-full h-12 text-base font-semibold"
          >
            {loading ? <Loader2 className="size-5 mr-2 animate-spin" /> : null}
            {t("openDashboard")}
            <ExternalLink className="size-5 ml-2" />
          </Button>
        )}
        </div>
      </div>
    </div>
  )
}
