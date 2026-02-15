"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { usePathname } from "@/i18n/routing"
import { Lock, ShoppingCart, Check } from "@/lib/icons/phosphor"
import { cn } from "@/lib/utils"

interface CheckoutHeaderProps {
  currentStep?: 1 | 2 | 3 | "complete"
}

export function CheckoutHeader({ currentStep: propStep }: CheckoutHeaderProps) {
  const t = useTranslations("CheckoutHeader")
  const pathname = usePathname()
  
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
        <div className="flex items-center justify-between h-11 md:h-12">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 shrink-0"
            aria-label={t("backToHome")}
          >
            <ShoppingCart className="size-4 text-primary" weight="fill" />
            <span className="text-sm font-semibold text-foreground">Treido</span>
          </Link>

          {/* Progress - Desktop: inline steps */}
          <nav className="hidden md:flex items-center" aria-label={t("checkoutProgress")}>
            {steps.map((step, index) => {
              const stepNum = typeof currentStep === "number" ? currentStep : 4
              const isStepComplete = isComplete || stepNum > step.id
              const isStepActive = !isComplete && stepNum === step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-1.5 px-2">
                    <div
                      className={cn(
                        "size-5 rounded-full flex items-center justify-center text-2xs font-semibold",
                        isStepComplete && "bg-success text-success-foreground",
                        isStepActive && "bg-primary text-primary-foreground",
                        !isStepComplete && !isStepActive && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isStepComplete ? <Check className="size-3" weight="bold" /> : step.id}
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      isStepComplete || isStepActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn("w-6 h-px", isStepComplete ? "bg-success" : "bg-border")} />
                  )}
                </div>
              )
            })}
          </nav>

          {/* Progress - Mobile: simple bar */}
          <div className="md:hidden flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((step) => {
                const stepNum = typeof currentStep === "number" ? currentStep : 4
                const filled = isComplete || stepNum >= step.id
                return (
                  <div
                    key={step.id}
                    className={cn("h-1 w-6 rounded-full", filled ? "bg-primary" : "bg-muted")}
                  />
                )
              })}
            </div>
          </div>

          {/* Secure badge */}
          <div className="flex items-center gap-1 text-success">
            <Lock className="size-3.5" weight="fill" />
            <span className="text-2xs font-medium hidden sm:inline">{t("secureCheckout")}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
