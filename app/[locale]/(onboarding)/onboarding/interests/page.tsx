"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import {
  ArrowRight,
  TShirt,
  Desktop,
  House,
  Car,
  Basketball,
  Sparkle,
  Hamburger,
  Wrench,
  Baby,
  Palette,
  Books,
  GameController,
  MusicNotes,
  PawPrint,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { InterestChip } from "../_components/interest-chip"
import { OnboardingShell } from "../_components/onboarding-shell"
import { cn } from "@/lib/utils"

const CATEGORY_ITEMS = [
  { key: "fashion", icon: <TShirt weight="fill" /> },
  { key: "electronics", icon: <Desktop weight="fill" /> },
  { key: "home", icon: <House weight="fill" /> },
  { key: "automotive", icon: <Car weight="fill" /> },
  { key: "sports", icon: <Basketball weight="fill" /> },
  { key: "beauty", icon: <Sparkle weight="fill" /> },
  { key: "food", icon: <Hamburger weight="fill" /> },
  { key: "services", icon: <Wrench weight="fill" /> },
  { key: "kids", icon: <Baby weight="fill" /> },
  { key: "art", icon: <Palette weight="fill" /> },
  { key: "books", icon: <Books weight="fill" /> },
  { key: "gaming", icon: <GameController weight="fill" /> },
  { key: "music", icon: <MusicNotes weight="fill" /> },
  { key: "pets", icon: <PawPrint weight="fill" /> },
] as const

export default function InterestsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations("Onboarding")

  const accountType = searchParams.get("type") || "personal"
  const isBusiness = accountType === "business"
  const totalSteps = isBusiness ? 5 : 4
  const currentStep = 3
  const progress = (currentStep / totalSteps) * 100

  const [isPending, startTransition] = useTransition()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleInterest = (category: string) => {
    setSelectedInterests((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleContinue = () => {
    try {
      const existing = sessionStorage.getItem("onboarding_profile")
      const profile = existing ? JSON.parse(existing) : {}
      sessionStorage.setItem(
        "onboarding_profile",
        JSON.stringify({
          ...profile,
          interests: selectedInterests,
        }),
      )
    } catch {
      // Ignore storage access errors
    }

    startTransition(() => {
      router.push(`/${locale}/onboarding/complete?type=${accountType}`)
    })
  }

  const handleBack = () => {
    if (isBusiness) router.push(`/${locale}/onboarding/business-profile`)
    else router.push(`/${locale}/onboarding/profile?type=personal`)
  }

  const handleSkip = () => {
    startTransition(() => {
      router.push(`/${locale}/onboarding/complete?type=${accountType}`)
    })
  }

  const canContinue = selectedInterests.length >= 3

  return (
    <OnboardingShell
      title={t("interests.title")}
      subtitle={t("interests.subtitle")}
      stepLabel={t("common.stepLabel", { current: currentStep, total: totalSteps })}
      progress={progress}
      onBack={handleBack}
      backLabel={t("common.back")}
      footer={
        <div className="space-y-2">
          <Button
            onClick={handleContinue}
            disabled={!canContinue || isPending}
            size="lg"
            className="w-full"
          >
            {t("common.continue")}
            <ArrowRight className="size-5" weight="bold" />
          </Button>
          <Button variant="ghost" onClick={handleSkip} disabled={isPending} className="w-full">
            {t("common.skipForNow")}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label={t("interests.title")}>
          {CATEGORY_ITEMS.map(({ key, icon }) => (
            <InterestChip
              key={key}
              label={t(`interests.categories.${key}`)}
              icon={icon}
              selected={selectedInterests.includes(key)}
              onSelect={() => toggleInterest(key)}
            />
          ))}
        </div>

        <div className="text-center">
          <p
            className={cn(
              "text-sm",
              selectedInterests.length >= 3 ? "text-success" : "text-muted-foreground",
            )}
          >
            {t("interests.selectedCount", { count: selectedInterests.length })}
            {selectedInterests.length < 3 ? ` • ${t("interests.minRequired")}` : null}
          </p>
        </div>
      </div>
    </OnboardingShell>
  )
}

