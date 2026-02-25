import type { HeaderVariant } from "@/components/layout/header/types"

export type RouteConfig = {
  variant: HeaderVariant
  profileUsername?: string
}

const KNOWN_ROUTES = [
  "search",
  "sellers",
  "cart",
  "checkout",
  "account",
  "sell",
  "plans",
  "auth",
  "categories",
  "api",
  "assistant",
  "wishlist",
  "terms",
  "privacy",
  "cookies",
  "customer-service",
  "returns",
  "contact",
  "security",
  "feedback",
  "faq",
]

export function detectRouteConfig(pathname: string, explicitVariant?: HeaderVariant): RouteConfig {
  if (explicitVariant) {
    return { variant: explicitVariant }
  }

  const pathWithoutLocale = pathname.replace(/^\/(en|bg)/, "") || "/"

  if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
    return { variant: "homepage" }
  }

  if (pathWithoutLocale.startsWith("/categories")) {
    return { variant: "contextual" }
  }

  if (pathWithoutLocale.startsWith("/assistant")) {
    return { variant: "contextual" }
  }

  if (pathWithoutLocale.startsWith("/search")) {
    return { variant: "contextual" }
  }

  if (pathWithoutLocale.startsWith("/sellers")) {
    return { variant: "homepage" }
  }

  const segments = pathWithoutLocale.split("/").filter(Boolean)

  if (segments.length >= 2 && segments[0] && !KNOWN_ROUTES.includes(segments[0])) {
    return { variant: "product" }
  }

  if (segments.length === 1 && segments[0] && !KNOWN_ROUTES.includes(segments[0])) {
    return { variant: "contextual", profileUsername: segments[0] }
  }

  return { variant: "default" }
}
