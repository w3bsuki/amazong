"use client";

import { useTranslations } from "next-intl"
import { AuthGateCard } from "@/components/shared/auth/auth-gate-card"

export function SignInPrompt() {
  const tSelling = useTranslations("SellingDropdown")
  const tSell = useTranslations("Sell")

  return (
    <div className="container-content py-6 sm:py-8 lg:py-16 flex justify-center">
      <AuthGateCard
        title={tSelling("signInToSell")}
        description={tSell("startSellingBanner.compact.subtitle")}
        nextPath="/sell"
      />
    </div>
  )
}
