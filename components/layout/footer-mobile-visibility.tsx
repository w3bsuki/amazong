"use client"

import { useMemo } from "react"
import { usePathname } from "@/i18n/routing"

const FOOTER_MOBILE_VISIBLE_ROUTES = [
  "/",
  "/about",
  "/terms",
  "/privacy",
  "/cookies",
  "/accessibility",
  "/customer-service",
  "/contact",
  "/returns",
  "/security",
  "/feedback",
  "/sellers",
] as const

export function FooterMobileVisibility() {
  const pathname = usePathname()

  const shouldShowOnMobile = useMemo(() => {
    const pathWithoutLocale = (pathname ?? "").replace(/^\/(en|bg)/, "") || "/"

    return FOOTER_MOBILE_VISIBLE_ROUTES.some((route) => {
      if (route === "/") return pathWithoutLocale === "/"
      return pathWithoutLocale.startsWith(route)
    })
  }, [pathname])

  if (!shouldShowOnMobile) return null

  return (
    <style>{`@media (max-width: 767px){#footerHeader{display:block !important;}}`}</style>
  )
}

