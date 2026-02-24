import { getTranslations, setRequestLocale } from "next-intl/server"
import { UpgradeContent } from "./upgrade-content"
import { getUpgradeData } from "./_lib/get-upgrade-data"
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/routing"
import { createSubscriptionCheckoutSession } from "../../../../../actions/subscriptions-reads"

/**
 * Full Upgrade Page
 * 
 * This page is shown when accessing /account/plans/upgrade directly
 * (e.g., from a shared link or page refresh).
 * 
 * When navigating from within the app, the intercepted modal version is shown instead.
 */
export const metadata = {
  title: "Upgrade Plan | Treido",
  description: "Upgrade your Treido plan.",
}

export default async function UpgradePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "AccountPlansUpgrade" })
  const { plans, currentTier, seller } = await getUpgradeData(locale)

  return (
    <div className="p-4 lg:p-4 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/account/plans"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t("backToPlans")}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <UpgradeContent
        locale={locale}
        plans={plans as Parameters<typeof UpgradeContent>[0]['plans']}
        currentTier={currentTier}
        seller={seller}
        actions={{ createSubscriptionCheckoutSession }}
      />
    </div>
  )
}
