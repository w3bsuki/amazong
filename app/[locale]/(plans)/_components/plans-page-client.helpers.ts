import type { PlansPageContent, SubscriptionPlanRow } from "./plans-page-client.types"

export function formatInt(locale: string, value: number) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)
}

export function formatPrice(locale: string, price: number) {
  return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function buildPlanFeatureList(
  locale: string,
  t: PlansPageContent,
  plan: SubscriptionPlanRow
): string[] {
  const sellerFee = Number(plan.seller_fee_percent ?? 0)
  const buyerProtection = Number(plan.buyer_protection_percent ?? 0)
  const buyerFixed = Number(plan.buyer_protection_fixed ?? 0)
  const boosts = plan.boosts_included ?? 0
  const analytics = (plan.analytics_access || "").toLowerCase()

  const features: string[] = []

  if (plan.max_listings == null) {
    features.push(t.planFeatures.unlimitedListings)
  } else {
    features.push(`${formatInt(locale, plan.max_listings)} ${t.planFeatures.listingsPerMonth}`)
  }

  features.push(`${sellerFee}% ${t.planFeatures.whenSoldShort}`)
  features.push(`${buyerProtection}% + €${buyerFixed.toFixed(2)} ${t.planFeatures.buyerProtection}`)

  if (boosts > 0) {
    const boostsLabel = boosts >= 999 ? "∞" : formatInt(locale, boosts)
    features.push(`${boostsLabel} ${t.planFeatures.boostsShort}`)
  }

  if (analytics && analytics !== "none" && analytics !== "-" && analytics !== "—") {
    features.push(t.planFeatures.analytics)
  }

  return features
}
