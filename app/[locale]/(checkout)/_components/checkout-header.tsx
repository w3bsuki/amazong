"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { usePathname } from "@/i18n/routing"
import { ArrowLeft, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { MobileStepProgress } from "@/components/mobile/chrome/mobile-step-progress"
import { useCheckoutStep } from "./checkout-step-context"

export function CheckoutHeader() {
  const t = useTranslations("CheckoutPage")
  const tCommon = useTranslations("Common")
  const pathname = usePathname()

  const { currentStep, setCurrentStep } = useCheckoutStep()
  const isSuccess = pathname?.includes("/success") ?? false
  const effectiveStep = isSuccess ? 3 : currentStep

  const steps = [
    { id: 1, label: t("steps.address") },
    { id: 2, label: t("steps.shipping") },
    { id: 3, label: t("steps.payment") },
  ] as const

  const canStepBack = !isSuccess && effectiveStep > 1

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background pt-safe">
      <div className="px-inset">
        <div className="flex h-(--control-primary) items-center justify-between">
          {canStepBack ? (
            <button
              type="button"
              onClick={() => setCurrentStep((effectiveStep - 1) as 1 | 2 | 3)}
              aria-label={tCommon("back")}
              className="size-(--control-default) -ml-2 flex items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <Link
              href={isSuccess ? "/" : "/cart"}
              aria-label={isSuccess ? t("continueShopping") : t("backToCart")}
              className="size-(--control-default) -ml-2 flex items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="size-5" />
            </Link>
          )}

          <div className="flex-1 text-center">
            <div className="text-sm font-semibold leading-tight text-foreground">
              {t("title")}
            </div>
          </div>

          <div className="flex items-center gap-1 text-success">
            <Lock className="size-3.5" />
            <span className="hidden text-2xs font-medium sm:inline">{t("secureCheckout")}</span>
          </div>
        </div>
      </div>

      <div className="px-inset pb-3 lg:hidden">
        <div className="grid grid-cols-3 text-center text-2xs font-semibold text-muted-foreground">
          {steps.map((step) => (
            <span
              key={step.id}
              className={cn(step.id === effectiveStep && "text-foreground")}
            >
              {step.label}
            </span>
          ))}
        </div>

        <div className="mt-2">
          <MobileStepProgress
            current={effectiveStep}
            total={steps.length}
            aria-label={t("stepProgress.ariaLabel")}
            aria-valuetext={t("stepProgress.valueText", {
              current: effectiveStep,
              total: steps.length,
            })}
          />
        </div>
      </div>
    </header>
  )
}
