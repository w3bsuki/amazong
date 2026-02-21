"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button"
import { AccountTypeCard, type AccountType } from "../_components/account-type-card"
import { OnboardingShell } from "../_components/onboarding-shell"

export default function AccountTypePage() {
  const router = useRouter()
  const t = useTranslations("Onboarding")

  const [selectedType, setSelectedType] = useState<AccountType | null>(null)
  const totalSteps = selectedType === "business" ? 5 : 4

  const handleContinue = () => {
    if (!selectedType) return
    router.push(`/onboarding/profile?type=${selectedType}`)
  }

  return (
    <OnboardingShell
      title={t("accountType.title")}
      subtitle={t("accountType.subtitle")}
      stepLabel={t("common.stepLabel", { current: 1, total: totalSteps })}
      stepProgress={{ current: 1, total: totalSteps }}
      footer={
        <Button onClick={handleContinue} disabled={!selectedType} size="lg" className="w-full">
          {t("common.continue")}
          <ArrowRight className="size-5" />
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

