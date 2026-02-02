"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { AccountTypeCard, type AccountType } from "@/components/onboarding/account-type-card"

const translations = {
  en: {
    title: "Welcome to Treido!",
    subtitle: "How will you be using Treido?",
    personalTitle: "Personal Account",
    personalDescription: "Buy & sell as an individual",
    businessTitle: "Business Account",
    businessDescription: "Professional selling tools & features",
    upgradeNote: "You can upgrade anytime",
    continue: "Continue",
  },
  bg: {
    title: "Добре дошли в Treido!",
    subtitle: "Как ще използвате Treido?",
    personalTitle: "Личен акаунт",
    personalDescription: "Купувайте и продавайте като физическо лице",
    businessTitle: "Бизнес акаунт",
    businessDescription: "Професионални инструменти за продажба",
    upgradeNote: "Можете да надстроите по всяко време",
    continue: "Продължи",
  },
}

export default function AccountTypePage() {
  const router = useRouter()
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  const [selectedType, setSelectedType] = useState<AccountType | null>(null)

  const handleContinue = () => {
    if (!selectedType) return
    router.push(`/${locale}/onboarding/profile?type=${selectedType}`)
  }

  return (
    <div className="space-y-6" role="radiogroup" aria-label={t.subtitle}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Account Type Cards */}
      <div className="space-y-3">
        <AccountTypeCard
          type="personal"
          selected={selectedType === "personal"}
          onSelect={setSelectedType}
          title={t.personalTitle}
          description={t.personalDescription}
        />

        <AccountTypeCard
          type="business"
          selected={selectedType === "business"}
          onSelect={setSelectedType}
          title={t.businessTitle}
          description={t.businessDescription}
        />
      </div>

      {/* Info Note */}
      <p className="text-center text-sm text-muted-foreground">
        ℹ️ {t.upgradeNote}
      </p>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!selectedType}
        className="w-full h-12 text-base font-semibold"
      >
        {t.continue}
        <ArrowRight className="size-5 ml-2" weight="bold" />
      </Button>
    </div>
  )
}
