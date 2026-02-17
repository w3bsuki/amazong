"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"

const MobileTabBar = dynamic(
  () => import("./mobile-tab-bar").then((mod) => mod.MobileTabBar),
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

function useIdleReady(timeoutMs: number) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const markReady = () => {
      if (!cancelled) setReady(true)
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(markReady, { timeout: timeoutMs })
      return () => {
        cancelled = true
        idleWindow.cancelIdleCallback?.(id)
      }
    }

    const timer = window.setTimeout(markReady, timeoutMs)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [timeoutMs])

  return ready
}

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
