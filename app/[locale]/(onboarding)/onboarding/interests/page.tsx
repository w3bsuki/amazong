"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"
import {
  ArrowRight,
  ArrowLeft,
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
import { InterestChip } from "@/components/onboarding/interest-chip"
import { cn } from "@/lib/utils"

const translations = {
  en: {
    title: "What are you interested in?",
    subtitle: "Select at least 3 categories to personalize your experience",
    step: "Step 3 of 4",
    stepBusiness: "Step 3 of 5",
    continue: "Continue",
    back: "Back",
    skip: "Skip for now",
    selected: "selected",
    minRequired: "Select at least 3 to continue",
    categories: {
      fashion: "Fashion",
      electronics: "Electronics",
      home: "Home & Garden",
      automotive: "Automotive",
      sports: "Sports",
      beauty: "Beauty",
      food: "Food",
      services: "Services",
      kids: "Kids & Baby",
      art: "Art & Crafts",
      books: "Books",
      gaming: "Gaming",
      music: "Music",
      pets: "Pets",
    },
  },
  bg: {
    title: "Какво ви интересува?",
    subtitle: "Изберете поне 3 категории за персонализиране",
    step: "Стъпка 3 от 4",
    stepBusiness: "Стъпка 3 от 5",
    continue: "Продължи",
    back: "Назад",
    skip: "Пропусни за сега",
    selected: "избрани",
    minRequired: "Изберете поне 3 за да продължите",
    categories: {
      fashion: "Мода",
      electronics: "Електроника",
      home: "Дом и градина",
      automotive: "Автомобили",
      sports: "Спорт",
      beauty: "Красота",
      food: "Храна",
      services: "Услуги",
      kids: "Деца и бебета",
      art: "Изкуство",
      books: "Книги",
      gaming: "Игри",
      music: "Музика",
      pets: "Домашни любимци",
    },
  },
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  fashion: <TShirt weight="fill" />,
  electronics: <Desktop weight="fill" />,
  home: <House weight="fill" />,
  automotive: <Car weight="fill" />,
  sports: <Basketball weight="fill" />,
  beauty: <Sparkle weight="fill" />,
  food: <Hamburger weight="fill" />,
  services: <Wrench weight="fill" />,
  kids: <Baby weight="fill" />,
  art: <Palette weight="fill" />,
  books: <Books weight="fill" />,
  gaming: <GameController weight="fill" />,
  music: <MusicNotes weight="fill" />,
  pets: <PawPrint weight="fill" />,
}

export default function InterestsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  const accountType = searchParams.get("type") || "personal"
  const isBusiness = accountType === "business"
  const totalSteps = isBusiness ? 5 : 4
  const currentStep = 3

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleInterest = (category: string) => {
    setSelectedInterests((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleContinue = () => {
    // Store interests in session storage
    try {
      const existing = sessionStorage.getItem("onboarding_profile")
      const profile = existing ? JSON.parse(existing) : {}
      sessionStorage.setItem("onboarding_profile", JSON.stringify({
        ...profile,
        interests: selectedInterests,
      }))
    } catch {
      // Ignore storage access errors
    }
    
    // Navigate to complete page
    router.push(`/${locale}/onboarding/complete?type=${accountType}`)
  }

  const handleBack = () => {
    if (isBusiness) {
      router.push(`/${locale}/onboarding/business-profile`)
    } else {
      router.push(`/${locale}/onboarding/profile?type=personal`)
    }
  }

  const handleSkip = () => {
    // Navigate to complete page without interests
    router.push(`/${locale}/onboarding/complete?type=${accountType}`)
  }

  const canContinue = selectedInterests.length >= 3

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm text-link hover:text-link-hover font-medium transition-colors"
      >
        <ArrowLeft className="size-4" weight="bold" />
        {t.back}
      </button>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i < currentStep ? "bg-primary w-6" : "bg-muted w-2"
            )}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground font-medium">
          {isBusiness ? t.stepBusiness : t.step}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Interest Chips Grid */}
      <div 
        className="flex flex-wrap gap-2 justify-center"
        role="group"
        aria-label={t.title}
      >
        {Object.entries(t.categories).map(([key, label]) => (
          <InterestChip
            key={key}
            label={label}
            icon={CATEGORY_ICONS[key]}
            selected={selectedInterests.includes(key)}
            onSelect={() => toggleInterest(key)}
          />
        ))}
      </div>

      {/* Selection Counter */}
      <div className="text-center">
        <p className={cn(
          "text-sm",
          selectedInterests.length >= 3 ? "text-success" : "text-muted-foreground"
        )}>
          {selectedInterests.length} {t.selected}
          {selectedInterests.length < 3 && ` • ${t.minRequired}`}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full h-12 text-base font-semibold"
        >
          {t.continue}
          <ArrowRight className="size-5 ml-2" weight="bold" />
        </Button>

        <Button
          variant="ghost"
          onClick={handleSkip}
          className="w-full h-11 text-sm font-medium text-muted-foreground"
        >
          {t.skip}
        </Button>
      </div>
    </div>
  )
}
