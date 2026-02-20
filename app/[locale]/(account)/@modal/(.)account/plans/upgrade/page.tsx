import { Modal } from "../../../_components/modal"
import { getLocale, getTranslations } from "next-intl/server"
import { UpgradeContent } from "../../../../account/plans/upgrade/upgrade-content"
import { getUpgradeData } from "../../../../account/plans/upgrade/_lib/get-upgrade-data"
import { connection } from "next/server"
import { createSubscriptionCheckoutSession } from "../../../../../../actions/subscriptions-reads"

// Generate static params for all locales - required for Next.js 16 Cache Components
async function UpgradeModalContent() {
  // Ensure this runs dynamically, not during static generation
  await connection()

  const locale = await getLocale()
  const safeLocale = locale === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale: safeLocale, namespace: "AccountPlansUpgrade" })
  const { plans, currentTier, seller } = await getUpgradeData(safeLocale)

  return (
    <Modal
      title={t("title")}
      description={t("description")}
    >
      <UpgradeContent
        locale={safeLocale}
        plans={plans}
        currentTier={currentTier}
        seller={seller}
        actions={{ createSubscriptionCheckoutSession }}
      />
    </Modal>
  )
}

/**
 * Intercepted Upgrade Route
 * 
 * This page is shown as a modal overlay when navigating from within the app.
 * When accessed directly (or on refresh), the user sees the full page version.
 */
export const metadata = {
  title: "Upgrade Plan | Treido",
  description: "Upgrade your Treido plan.",
}

export default function InterceptedUpgradePage() {
  return <UpgradeModalContent />
}

