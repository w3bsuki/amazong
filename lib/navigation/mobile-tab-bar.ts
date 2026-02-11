const LOCALE_SEGMENT_PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/i

const KNOWN_ROUTE_SEGMENTS = new Set([
  "account",
  "admin",
  "assistant",
  "auth",
  "cart",
  "categories",
  "chat",
  "checkout",
  "dashboard",
  "help",
  "notifications",
  "orders",
  "plans",
  "search",
  "sell",
  "settings",
  "wishlist",
])

export interface MobileTabBarRouteState {
  pathSegments: string[]
  normalizedPathname: string
  firstSegment: string | null
  isProductPage: boolean
  isCartPage: boolean
  isAssistantPage: boolean
  shouldHideTabBar: boolean
}

export function getMobileTabBarRouteState(pathname: string): MobileTabBarRouteState {
  const rawSegments = pathname.split("/").filter(Boolean)
  const pathSegments = [...rawSegments]
  const maybeLocale = pathSegments[0]

  if (maybeLocale && LOCALE_SEGMENT_PATTERN.test(maybeLocale)) {
    pathSegments.shift()
  }

  const firstSegment = pathSegments.at(0) ?? null
  const isProductPage =
    pathSegments.length === 2 &&
    firstSegment !== null &&
    !KNOWN_ROUTE_SEGMENTS.has(firstSegment)
  const isCartPage = firstSegment === "cart"
  const isAssistantPage = firstSegment === "assistant"
  const shouldHideTabBar = isProductPage || isCartPage || isAssistantPage
  const normalizedPathname =
    pathSegments.length > 0 ? `/${pathSegments.join("/")}` : "/"

  return {
    pathSegments,
    normalizedPathname,
    firstSegment,
    isProductPage,
    isCartPage,
    isAssistantPage,
    shouldHideTabBar,
  }
}

export function isMobileTabPathActive(
  normalizedPathname: string,
  targetPath: string
): boolean {
  if (targetPath === "/") return normalizedPathname === "/"
  return (
    normalizedPathname === targetPath ||
    normalizedPathname.startsWith(`${targetPath}/`)
  )
}

