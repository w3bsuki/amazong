"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { AccountTypeCard, type AccountType } from "../_components/account-type-card"
import { OnboardingShell } from "../_components/onboarding-shell"

export default function AccountTypePage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("Onboarding")

  const [selectedType, setSelectedType] = useState<AccountType | null>(null)
  const totalSteps = selectedType === "business" ? 5 : 4
  const progress = (1 / totalSteps) * 100

  const handleContinue = () => {
    if (!selectedType) return
    router.push(`/${locale}/onboarding/profile?type=${selectedType}`)
  }

  return (
    <OnboardingShell
      title={t("accountType.title")}
      subtitle={t("accountType.subtitle")}
      stepLabel={t("common.stepLabel", { current: 1, total: totalSteps })}
      progress={progress}
      footer={
        <Button onClick={handleContinue} disabled={!selectedType} size="lg" className="w-full">
          {t("common.continue")}
          <ArrowRight className="size-5" weight="bold" />
        </Button>
      }
    >
      <div className="space-y-4" role="radiogroup" aria-label={t("accountType.subtitle")}>
        <div className="space-y-3">
          <AccountTypeCard
            type="personal"
            selected={selectedType === "personal"}
            onSelect={setSelectedType}
            title={t("accountType.personalTitle")}
            description={t("accountType.personalDescription")}
          />

          <AccountTypeCard
            type="business"
            selected={selectedType === "business"}
            onSelect={setSelectedType}
            title={t("accountType.businessTitle")}
            description={t("accountType.businessDescription")}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("accountType.upgradeNote")}
        </p>
      </div>
    </OnboardingShell>
  )
}
