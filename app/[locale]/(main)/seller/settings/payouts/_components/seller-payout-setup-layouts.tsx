import { ArrowRight, CheckCircle2, CreditCard, ExternalLink, Loader2, ShieldCheck, Wallet, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

type PayoutStatus = {
  stripe_connect_account_id: string | null
  details_submitted: boolean
  charges_enabled: boolean
  payouts_enabled: boolean
} | null

interface LayoutProps {
  t: Translate
  isComplete: boolean
  hasStarted: boolean
  payoutStatus: PayoutStatus
  loading: boolean
  error: string | null
  title: string
  onStartOnboarding: () => void
  onOpenDashboard: () => void
}

interface FullLayoutProps extends LayoutProps {
  fullDescription: string
}

interface CompactLayoutProps extends LayoutProps {
  compactDescription: string
}

const STEP_CIRCLE_BASE_CLASS = "size-5 rounded-full flex items-center justify-center"
const STEP_CIRCLE_DONE_CLASS = "bg-success text-success-foreground"
const STEP_CIRCLE_PENDING_CLASS = "bg-muted text-muted-foreground"

function getStepCircleClass(isDone: boolean | undefined) {
  return isDone ? STEP_CIRCLE_DONE_CLASS : STEP_CIRCLE_PENDING_CLASS
}

export function SellerPayoutSetupFull({
  t,
  isComplete,
  hasStarted,
  payoutStatus,
  loading,
  error,
  title,
  fullDescription,
  onStartOnboarding,
  onOpenDashboard,
}: FullLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-8 px-4">
      <div className="size-20 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary">
        {isComplete ? (
          <CheckCircle2 className="size-10 text-primary-foreground" strokeWidth={2} />
        ) : (
          <Wallet className="size-10 text-primary-foreground" strokeWidth={2} />
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
        {title}
      </h1>

      <p className="text-muted-foreground text-base mb-8 max-w-sm">
        {fullDescription}
      </p>

      {error && (
        <div className="w-full p-3 mb-6 bg-destructive-subtle text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="w-full">
        {!isComplete ? (
          <Button
            onClick={onStartOnboarding}
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
            onClick={onOpenDashboard}
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
      </div>

      {hasStarted && !isComplete && (
        <div className="mt-8 w-full space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(STEP_CIRCLE_BASE_CLASS, getStepCircleClass(payoutStatus?.details_submitted))}>
              {payoutStatus?.details_submitted ? <CheckCircle2 className="size-3" /> : <span className="text-xs">1</span>}
            </div>
            <span className={payoutStatus?.details_submitted ? "text-foreground" : "text-muted-foreground"}>
              {t("detailsSubmitted")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(STEP_CIRCLE_BASE_CLASS, getStepCircleClass(payoutStatus?.charges_enabled))}>
              {payoutStatus?.charges_enabled ? <CheckCircle2 className="size-3" /> : <span className="text-xs">2</span>}
            </div>
            <span className={payoutStatus?.charges_enabled ? "text-foreground" : "text-muted-foreground"}>
              {t("chargesEnabled")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(STEP_CIRCLE_BASE_CLASS, getStepCircleClass(payoutStatus?.payouts_enabled))}>
              {payoutStatus?.payouts_enabled ? <CheckCircle2 className="size-3" /> : <span className="text-xs">3</span>}
            </div>
            <span className={payoutStatus?.payouts_enabled ? "text-foreground" : "text-muted-foreground"}>
              {t("payoutsEnabled")}
            </span>
          </div>
        </div>
      )}

      {!hasStarted && (
        <div className="mt-10 pt-8 border-t border-border w-full">
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
        </div>
      )}
    </div>
  )
}

export function SellerPayoutSetupCompact({
  t,
  isComplete,
  hasStarted,
  payoutStatus,
  loading,
  error,
  title,
  compactDescription,
  onStartOnboarding,
  onOpenDashboard,
}: CompactLayoutProps) {
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

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-4 pt-3 pb-safe">
        <div className="mx-auto w-full max-w-md pb-4">
          {error && (
            <div className="w-full p-3 mb-3 bg-destructive-subtle text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isComplete ? (
            <Button
              onClick={onStartOnboarding}
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
              onClick={onOpenDashboard}
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
