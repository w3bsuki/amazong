const LEGACY_TIER_ALIASES: Record<string, string> = {
  basic: "free",
  starter: "plus",
  premium: "pro",
  professional: "pro",
}

export function normalizePlanTier(tier: string | null | undefined): string {
  const normalized = (tier ?? "free").trim().toLowerCase()
  if (!normalized) return "free"
  return LEGACY_TIER_ALIASES[normalized] ?? normalized
}
