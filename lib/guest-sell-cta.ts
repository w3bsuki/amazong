const LOCALE_PREFIX_RE = /^\/([a-z]{2})(?:-[A-Z]{2})?(?=\/|$)/i

export const GUEST_SELL_CTA_DISMISSED_AT_KEY = "guest-sell-cta-dismissed-at"
export const GUEST_SELL_CTA_COOLDOWN_DAYS = 30
export const GUEST_SELL_CTA_COOLDOWN_MS = GUEST_SELL_CTA_COOLDOWN_DAYS * 24 * 60 * 60 * 1000

export function stripLocalePrefix(pathname: string): string {
  if (!pathname) return "/"

  const withoutLocale = pathname.replace(LOCALE_PREFIX_RE, "")
  const normalized = withoutLocale.length > 0 ? withoutLocale : "/"
  return normalized.startsWith("/") ? normalized : `/${normalized}`
}

export function isGuestSellCtaRouteEligible(pathname: string): boolean {
  const pathOnly = pathname.split("?")[0] ?? pathname
  const normalized = stripLocalePrefix(pathOnly)
  return normalized === "/search" || normalized.startsWith("/search/")
}

export function parseDismissedAt(rawValue: string | null): number | null {
  if (!rawValue) return null
  const parsed = Number.parseInt(rawValue, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

export function isInGuestSellCtaCooldown(
  dismissedAtMs: number | null,
  nowMs: number = Date.now(),
): boolean {
  if (!dismissedAtMs) return false
  return nowMs - dismissedAtMs < GUEST_SELL_CTA_COOLDOWN_MS
}
