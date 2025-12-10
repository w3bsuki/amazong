"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Lock, ShoppingCart } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface CheckoutHeaderProps {
  currentStep?: 1 | 2 | 3
}

/**
 * Minimal checkout header following e-commerce best practices
 * - Logo with "Checkout" text
 * - Progress indicator showing checkout steps
 * - No navigation, search, or other distractions
 * - Secure checkout badge for trust
 */
export function CheckoutHeader({ currentStep = 1 }: CheckoutHeaderProps) {
  const t = useTranslations("CheckoutHeader")

  const steps = [
    { id: 1, label: t("shipping") },
    { id: 2, label: t("payment") },
    { id: 3, label: t("review") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
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
              <span className="text-xl font-bold tracking-tight text-foreground">AMZN</span>
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
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors">
                  <div
                    className={cn(
                      "flex items-center justify-center size-6 rounded-full text-xs font-semibold transition-all",
                      currentStep > step.id && "bg-brand-success text-white",
                      currentStep === step.id && "bg-brand text-white ring-2 ring-brand/20",
                      currentStep < step.id && "bg-muted text-muted-foreground"
                    )}
                    aria-current={currentStep === step.id ? "step" : undefined}
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
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
                      currentStep > step.id ? "bg-brand-success" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Progress - Pill style */}
          <div className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
            <span className="text-xs font-medium text-muted-foreground">
              {t("step")} {currentStep}/{steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    currentStep >= step.id ? "bg-brand" : "bg-border"
                  )}
                />
              ))}
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
