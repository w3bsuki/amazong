"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowRight, Baby, Dribbble as Basketball, BookOpen as Books, Car, Monitor as Desktop, Gamepad2 as GameController, Menu as Hamburger, House, Music as MusicNotes, Palette, PawPrint, Sparkles as Sparkle, Shirt as TShirt, Wrench } from "lucide-react";


import { Button } from "@/components/ui/button"
import { InterestChip } from "../_components/interest-chip"
import { OnboardingShell } from "../_components/onboarding-shell"
import { cn } from "@/lib/utils"

const CATEGORY_ITEMS = [
  { key: "fashion", icon: <TShirt /> },
  { key: "electronics", icon: <Desktop /> },
  { key: "home", icon: <House /> },
  { key: "automotive", icon: <Car /> },
  { key: "sports", icon: <Basketball /> },
  { key: "beauty", icon: <Sparkle /> },
  { key: "food", icon: <Hamburger /> },
  { key: "services", icon: <Wrench /> },
  { key: "kids", icon: <Baby /> },
  { key: "art", icon: <Palette /> },
  { key: "books", icon: <Books /> },
  { key: "gaming", icon: <GameController /> },
  { key: "music", icon: <MusicNotes /> },
  { key: "pets", icon: <PawPrint /> },
] as const

export default function InterestsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("Onboarding")

  const accountType = searchParams.get("type") || "personal"
  const isBusiness = accountType === "business"
  const totalSteps = isBusiness ? 5 : 4
  const currentStep = 3

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
      router.push(`/onboarding/complete?type=${accountType}`)
    })
  }

  const handleBack = () => {
    if (isBusiness) router.push(`/onboarding/business-profile`)
    else router.push(`/onboarding/profile?type=personal`)
  }

  const handleSkip = () => {
    startTransition(() => {
      router.push(`/onboarding/complete?type=${accountType}`)
    })
  }

  const canContinue = selectedInterests.length >= 3

  return (
    <OnboardingShell
      title={t("interests.title")}
      subtitle={t("interests.subtitle")}
      stepLabel={t("common.stepLabel", { current: currentStep, total: totalSteps })}
      stepProgress={{ current: currentStep, total: totalSteps }}
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
            <ArrowRight className="size-5" />
          </Button>
          <Button variant="ghost" onClick={handleSkip} disabled={isPending} className="w-full">
            {t("common.skipForNow")}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div
          className="grid grid-cols-3 gap-3"
          role="group"
          aria-label={t("interests.title")}
        >
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


