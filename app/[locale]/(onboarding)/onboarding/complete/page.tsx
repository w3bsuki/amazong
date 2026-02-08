"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Check, ShoppingBag, Storefront, Package, SpinnerGap } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { OnboardingShell } from "../_components/onboarding-shell"

interface OnboardingProfile {
  username?: string
  displayName?: string
  businessName?: string
  accountType?: string
  category?: string
  website?: string
  location?: string
  interests?: string[]
  avatarType?: "custom" | "generated"
  avatarVariant?: string
  avatarPalette?: number
}

export default function CompletePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations("Onboarding")

  const accountType = searchParams.get("type") || "personal"
  const isBusiness = accountType === "business"
  const totalSteps = isBusiness ? 5 : 4
  const currentStep = totalSteps
  const progress = 100

  const [isSaving, setIsSaving] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const saveOnboardingData = async () => {
      try {
        const profileJson = sessionStorage.getItem("onboarding_profile")
        const profile: OnboardingProfile = profileJson ? JSON.parse(profileJson) : {}

        const response = await fetch(`/${locale}/api/onboarding/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...profile, accountType }),
        })

        if (!response.ok) {
          throw new Error("Failed to save onboarding data")
        }

        sessionStorage.removeItem("onboarding_profile")
        setIsSaving(false)
      } catch {
        setError(t("complete.errorGeneric"))
        setIsSaving(false)
      }
    }

    void saveOnboardingData()
  }, [locale, accountType, t])

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path)
      router.refresh()
    })
  }

  if (isSaving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh space-y-4">
        <SpinnerGap className="size-10 animate-spin text-primary" weight="bold" />
        <p className="text-muted-foreground">{t("complete.saving")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()} size="lg">
          {t("common.tryAgain")}
        </Button>
      </div>
    )
  }

  return (
    <OnboardingShell
      title={t("complete.title")}
      subtitle={t("complete.subtitle")}
      stepLabel={t("common.stepLabel", { current: currentStep, total: totalSteps })}
      progress={progress}
      footer={
        <div className="space-y-2">
          <Button onClick={() => handleNavigation(`/${locale}`)} size="lg" disabled={isPending} className="w-full">
            <ShoppingBag className="size-5" weight="fill" />
            {t("complete.startBrowsing")}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleNavigation(`/${locale}/sell`)}
            size="lg"
            disabled={isPending}
            className="w-full"
          >
            <Package className="size-5" weight="fill" />
            {t("complete.listFirstItem")}
          </Button>

          {isBusiness ? (
            <Button
              variant="ghost"
              onClick={() => handleNavigation(`/${locale}/dashboard`)}
              disabled={isPending}
              className="w-full"
            >
              <Storefront className="size-5" weight="fill" />
              {t("complete.completeStore")}
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="size-16 bg-primary rounded-full flex items-center justify-center shadow-sm">
          <Check className="size-8 text-primary-foreground" weight="bold" />
        </div>
      </div>
    </OnboardingShell>
  )
}

