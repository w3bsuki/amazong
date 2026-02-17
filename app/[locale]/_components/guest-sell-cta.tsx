"use client"

import { useCallback, useEffect, useState } from "react"
import { X } from "lucide-react";

import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/routing"
import { useAuthOptional } from "@/components/providers/auth-state-manager"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GUEST_SELL_CTA_DISMISSED_AT_KEY,
  isGuestSellCtaRouteEligible,
  isInGuestSellCtaCooldown,
  parseDismissedAt,
} from "@/lib/guest-sell-cta"

const COOKIE_CONSENT_KEY = "cookie-consent"
const GEO_WELCOME_DISMISSED_KEY = "geo-welcome-dismissed"
const COOKIE_CONSENT_EVENT = "treido:cookie-consent"
const GEO_WELCOME_COMPLETE_EVENT = "treido:geo-welcome-complete"

export function GuestSellCta() {
  const isE2E = process.env.NEXT_PUBLIC_E2E === "true"
  const pathname = usePathname()
  const auth = useAuthOptional()
  const t = useTranslations("GuestSellCTA")

  const [isVisible, setIsVisible] = useState(false)

  const dismissForCooldown = useCallback(() => {
    try {
      localStorage.setItem(GUEST_SELL_CTA_DISMISSED_AT_KEY, Date.now().toString())
    } catch {
      // Ignore storage errors in private mode.
    }
    setIsVisible(false)
  }, [])

  const refreshVisibility = useCallback(() => {
    if (isE2E) {
      setIsVisible(false)
      return
    }

    if (!auth || auth.isLoading || auth.user) {
      setIsVisible(false)
      return
    }

    if (!isGuestSellCtaRouteEligible(pathname)) {
      setIsVisible(false)
      return
    }

    try {
      const cookieDecision = localStorage.getItem(COOKIE_CONSENT_KEY)
      const geoDismissed = localStorage.getItem(GEO_WELCOME_DISMISSED_KEY)
      const dismissedAt = parseDismissedAt(localStorage.getItem(GUEST_SELL_CTA_DISMISSED_AT_KEY))

      const shouldShow =
        Boolean(cookieDecision) &&
        geoDismissed === "true" &&
        !isInGuestSellCtaCooldown(dismissedAt)

      setIsVisible(shouldShow)
    } catch {
      setIsVisible(false)
    }
  }, [auth, isE2E, pathname])

  useEffect(() => {
    refreshVisibility()
  }, [refreshVisibility])

  useEffect(() => {
    if (isE2E) return

    const handleUpdate = () => refreshVisibility()

    window.addEventListener(COOKIE_CONSENT_EVENT, handleUpdate)
    window.addEventListener(GEO_WELCOME_COMPLETE_EVENT, handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleUpdate)
      window.removeEventListener(GEO_WELCOME_COMPLETE_EVENT, handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [isE2E, refreshVisibility])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 pointer-events-none md:bottom-4 md:left-auto md:right-4">
      <Card
        role="region"
        aria-label={t("title")}
        className="pointer-events-auto mx-3 border-border bg-card shadow-lg md:mx-0 md:w-80"
      >
        <CardHeader className="gap-1.5 p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold text-foreground">{t("title")}</CardTitle>
              <CardDescription className="mt-1 text-xs text-muted-foreground">
                {t("description")}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={dismissForCooldown}
              aria-label={t("dismissAriaLabel")}
            >
              <X size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2 pt-1 md:grid-cols-2">
            <Button asChild onClick={dismissForCooldown} className="w-full">
              <Link href={{ pathname: "/auth/sign-up", query: { next: "/sell" } }}>
                {t("signUp")}
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={dismissForCooldown} className="w-full">
              <Link href={{ pathname: "/auth/login", query: { next: "/sell" } }}>
                {t("signIn")}
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
