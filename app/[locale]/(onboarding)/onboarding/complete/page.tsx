"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"
import { Check, ShoppingBag, Storefront, Package, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const translations = {
  en: {
    title: "You're all set!",
    subtitle: "Your profile is ready to go",
    startBrowsing: "Start Browsing",
    listFirstItem: "List Your First Item",
    completeStore: "Complete Your Store",
    saving: "Setting up your profile...",
    error: "Something went wrong. Please try again.",
  },
  bg: {
    title: "Готови сте!",
    subtitle: "Профилът ви е готов",
    startBrowsing: "Започнете да разглеждате",
    listFirstItem: "Добавете първа обява",
    completeStore: "Завършете магазина си",
    saving: "Настройване на профила...",
    error: "Нещо се обърка. Моля, опитайте отново.",
  },
}

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
  const t = translations[locale as keyof typeof translations] || translations.en

  const accountType = searchParams.get("type") || "personal"
  const isBusiness = accountType === "business"
  const totalSteps = isBusiness ? 5 : 4

  const [isSaving, setIsSaving] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Save onboarding data when page loads
  useEffect(() => {
    const saveOnboardingData = async () => {
      try {
        // Get profile data from session storage (may be empty if skipped)
        const profileJson = sessionStorage.getItem("onboarding_profile")
        const profile: OnboardingProfile = profileJson ? JSON.parse(profileJson) : {}

        // Always call API to mark onboarding as complete
        const response = await fetch(`/${locale}/api/onboarding/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...profile,
            accountType,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to save onboarding data")
        }

        // Clear session storage
        sessionStorage.removeItem("onboarding_profile")
        setIsSaving(false)
      } catch (err) {
        console.error("Error saving onboarding data:", err)
        setError(t.error)
        setIsSaving(false)
      }
    }

    saveOnboardingData()
  }, [locale, accountType, t.error])

  const handleNavigation = (path: string) => {
    router.push(path)
    router.refresh()
  }

  if (isSaving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <SpinnerGap className="size-10 animate-spin text-primary" weight="bold" />
        <p className="text-muted-foreground">{t.saving}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              "bg-primary w-6"
            )}
          />
        ))}
      </div>

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="size-20 bg-primary rounded-full flex items-center justify-center shadow-sm">
          <Check className="size-10 text-primary-foreground" weight="bold" />
        </div>
      </motion.div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          🎉 {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* CTAs */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={() => handleNavigation(`/${locale}`)}
          className="w-full h-12 text-base font-semibold"
        >
          <ShoppingBag className="size-5 mr-2" weight="fill" />
          {t.startBrowsing}
        </Button>

        <Button
          variant="outline"
          onClick={() => handleNavigation(`/${locale}/sell`)}
          className="w-full h-12 text-base font-semibold border-2"
        >
          <Package className="size-5 mr-2" weight="fill" />
          {t.listFirstItem}
        </Button>

        {isBusiness && (
          <Button
            variant="ghost"
            onClick={() => handleNavigation(`/${locale}/dashboard`)}
            className="w-full h-11 text-sm font-medium text-muted-foreground"
          >
            <Storefront className="size-5 mr-2" weight="fill" />
            {t.completeStore}
          </Button>
        )}
      </div>
    </div>
  )
}
