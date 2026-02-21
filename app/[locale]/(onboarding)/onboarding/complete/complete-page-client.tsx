"use client"

import { useEffect, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Check, Package, ShoppingBag, LoaderCircle as SpinnerGap, Store as Storefront } from "lucide-react";


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
        <SpinnerGap className="size-10 animate-spin motion-reduce:animate-none text-primary" />
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
      stepProgress={{ current: currentStep, total: totalSteps }}
      footer={
        <div className="space-y-2">
          <Button onClick={() => handleNavigation("/")} size="lg" disabled={isPending} className="w-full">
            <ShoppingBag className="size-5" />
            {t("complete.startBrowsing")}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleNavigation("/sell")}
            size="lg"
            disabled={isPending}
            className="w-full"
          >
            <Package className="size-5" />
            {t("complete.listFirstItem")}
          </Button>

          {isBusiness ? (
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/dashboard")}
              disabled={isPending}
              className="w-full"
            >
              <Storefront className="size-5" />
              {t("complete.completeStore")}
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="size-16 bg-primary rounded-full flex items-center justify-center shadow-sm">
          <Check className="size-8 text-primary-foreground" />
        </div>
      </div>
    </OnboardingShell>
  )
}


