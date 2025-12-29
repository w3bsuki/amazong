"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Lock, ShoppingCart, CheckCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface CheckoutHeaderProps {
  currentStep?: 1 | 2 | 3 | "complete"
}

/**
 * Minimal checkout header following e-commerce best practices
 * - Logo with "Checkout" text
 * - Progress indicator showing checkout steps
 * - No navigation, search, or other distractions
 * - Secure checkout badge for trust
 */
export function CheckoutHeader({ currentStep: propStep }: CheckoutHeaderProps) {
  const t = useTranslations("CheckoutHeader")
  const pathname = usePathname()
  
  // Auto-detect current step from pathname if not provided
  const currentStep = propStep ?? (pathname?.includes('/success') ? "complete" : 1)
  const isComplete = currentStep === "complete"

  const steps = [
    { id: 1, label: t("shipping") },
    { id: 2, label: t("payment") },
    { id: 3, label: t("review") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo with Checkout text */}
          <Link 
            href="/" 
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-1"
            aria-label={t("backToHome")}
          >
            <ShoppingCart className="size-6 text-brand" weight="duotone" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-foreground">Treido</span>
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {t("checkout")}
              </span>
            </div>
          </Link>

          {/* Progress Steps - Desktop */}
          <nav 
            className="hidden md:flex items-center gap-1" 
            aria-label={t("checkoutProgress")}
          >
            {steps.map((step, index) => {
              const stepNum = typeof currentStep === "number" ? currentStep : 4
              const isStepComplete = isComplete || stepNum > step.id
              const isStepActive = !isComplete && stepNum === step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  {/* Step */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors">
                    <div
                      className={cn(
                        "flex items-center justify-center size-6 rounded-full text-xs font-semibold transition-colors",
                        isStepComplete && "bg-brand-success text-white",
                        isStepActive && "bg-brand text-white",
                        !isStepComplete && !isStepActive && "bg-muted text-muted-foreground"
                      )}
                      aria-current={isStepActive ? "step" : undefined}
                    >
                      {isStepComplete ? "✓" : step.id}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isStepComplete || isStepActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-6 lg:w-10 h-0.5 transition-colors",
                        isStepComplete ? "bg-brand-success" : "bg-border"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </nav>

          {/* Mobile Progress - Pill style */}
          <div className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
            <span className="text-xs font-medium text-muted-foreground">
              {isComplete ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-3 text-brand-success" weight="fill" />
                  {t("complete") || "Complete"}
                </span>
              ) : (
                `${t("step")} ${currentStep}/${steps.length}`
              )}
            </span>
            <div className="flex gap-1">
              {steps.map((step) => {
                const stepNum = typeof currentStep === "number" ? currentStep : 4
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      isComplete || stepNum >= step.id ? "bg-brand-success" : "bg-border"
                    )}
                  />
                )
              })}
            </div>
          </div>

          {/* Secure Checkout Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-success/10 text-brand-success">
            <Lock className="size-3.5" weight="fill" />
            <span className="text-xs font-medium hidden sm:inline">{t("secureCheckout")}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
