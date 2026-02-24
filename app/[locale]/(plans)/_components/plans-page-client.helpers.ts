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
  const buyerProtection = Number(plan.buyer_protection_percent ?? 0)
  const buyerFixed = Number(plan.buyer_protection_fixed ?? 0)
  const buyerCap = Number(plan.buyer_protection_cap ?? 0)
  const boosts = plan.boosts_included ?? 0
  const analytics = (plan.analytics_access || "").toLowerCase()
  const sellerFee = Number(plan.seller_fee_percent ?? 0)
  const featureItems = Array.isArray(plan.features)
    ? plan.features.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : []

  const features: string[] = []

  if (plan.max_listings == null) {
    features.push(t.planFeatures.unlimitedListings)
  } else {
    features.push(`${formatInt(locale, plan.max_listings)} ${t.planFeatures.listingsPerMonth}`)
  }

  const capSuffix =
    buyerCap > 0 ? ` (${t.planFeatures.capLabel} €${buyerCap.toFixed(2)})` : ""
  features.push(
    `${buyerProtection}% + €${buyerFixed.toFixed(2)} ${t.planFeatures.buyerProtection}${capSuffix}`
  )

  const boostsLabel = boosts >= 999 ? "∞" : formatInt(locale, boosts)
  features.push(`${boostsLabel} ${t.planFeatures.boostsShort}`)

  if (sellerFee > 0) {
    features.push(`${sellerFee}% ${t.planFeatures.whenSoldShort}`)
  }

  for (const feature of featureItems) {
    if (!features.includes(feature)) {
      features.push(feature)
    }
    if (features.length >= 6) {
      break
    }
  }

  if (
    features.length < 6 &&
    analytics &&
    analytics !== "none" &&
    analytics !== "-" &&
    analytics !== "—"
  ) {
    features.push(t.planFeatures.analytics)
  }

  return features
}
