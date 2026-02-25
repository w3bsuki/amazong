"use client"

import dynamic from "next/dynamic"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useIdleReady } from "@/hooks/use-idle-ready"

const MobileTabBar = dynamic(
  () => import("@/components/layout/bottom-nav/mobile-tab-bar").then((mod) => mod.MobileTabBar),
  { ssr: false }
)
const CategoryBrowseDrawer = dynamic(
  () => import("./category-browse-drawer").then((mod) => mod.CategoryBrowseDrawer),
  { ssr: false }
)
const Toaster = dynamic(
  () => import("./providers/sonner").then((mod) => mod.Toaster),
  { ssr: false }
)
const CookieConsent = dynamic(
  () => import("./cookie-consent").then((mod) => mod.CookieConsent),
  { ssr: false }
)
const GeoWelcomeModal = dynamic(
  () => import("./geo-welcome-modal").then((mod) => mod.GeoWelcomeModal),
  { ssr: false }
)
const GuestSellCta = dynamic(
  () => import("./guest-sell-cta").then((mod) => mod.GuestSellCta),
  { ssr: false }
)

export function DeferredStorefrontUi({ locale }: { locale: string }) {
  const isMobile = useIsMobile()
  const isIdleReady = useIdleReady(1200)

  if (!isIdleReady) return null

  return (
    <>
      {isMobile ? <MobileTabBar /> : null}
      {isMobile ? <CategoryBrowseDrawer locale={locale} /> : null}
      <Toaster />
      <CookieConsent />
      <GeoWelcomeModal locale={locale} />
      <GuestSellCta />
    </>
  )
}
