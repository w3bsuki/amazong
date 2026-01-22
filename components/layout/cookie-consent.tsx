"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "@phosphor-icons/react"

const COOKIE_CONSENT_KEY = "cookie-consent"
const COOKIE_CONSENT_EVENT = "treido:cookie-consent"

type ConsentValue = "accepted" | "declined" | null

export function CookieConsent() {
    const isE2E = process.env.NEXT_PUBLIC_E2E === "true"
    const t = useTranslations('Cookies')
    const [consent, setConsent] = useState<ConsentValue>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Never block E2E runs with consent UI.
        if (isE2E) {
            return
        }

        // Check if consent was already given
        const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (!storedConsent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        } else {
            setConsent(storedConsent as ConsentValue)
        }

        return
    }, [isE2E])

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
        setConsent("accepted")
        setIsVisible(false)
        window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT))
        // Here you would initialize analytics/tracking cookies
    }

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
        setConsent("declined")
        setIsVisible(false)
        window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT))
        // Here you would disable non-essential cookies
    }

    const handleManagePreferences = () => {
        // This could open a modal with granular cookie preferences
        // For now, we'll just navigate to the cookie policy page
    }

    if (isE2E || !isVisible || consent) {
        return null
    }

    return (
        <div 
            className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300 pointer-events-none"
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
        >
            {/* Mobile-optimized bottom sheet */}
            <div className="md:hidden pointer-events-auto bg-card border border-border pb-safe mx-3 mb-3 rounded-lg shadow-lg">
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <h2 id="cookie-consent-title" className="text-base font-semibold text-foreground flex items-center gap-2">
                            <Cookie size={16} weight="regular" className="text-interactive" />
                            {t('title')}
                        </h2>
                        <button
                            onClick={handleDecline}
                            className="p-1.5 text-muted-foreground hover:text-foreground tap-transparent rounded-md hover:bg-muted transition-colors"
                            aria-label={t('close')}
                        >
                            <X size={20} weight="regular" />
                        </button>
                    </div>
                    <p id="cookie-consent-description" className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {t('description')}
                        <Link href="/cookies" className="text-interactive hover:text-interactive-hover hover:underline underline-offset-2 ml-1">
                            {t('learnMore')}
                        </Link>
                    </p>
                    <div className="flex flex-col gap-2.5">
                        <Button 
                            onClick={handleAccept}
                            className="w-full h-10 bg-interactive hover:bg-interactive-hover text-cta-primary-text font-medium rounded-md"
                        >
                            {t('acceptAll')}
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={handleDecline}
                            className="w-full h-10 border-border text-foreground hover:bg-muted rounded-md"
                        >
                            {t('declineOptional')}
                        </Button>
                    </div>
                    <button 
                        onClick={handleManagePreferences}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-3 py-2 transition-colors"
                    >
                        {t('managePreferences')}
                    </button>
                </div>
            </div>

            {/* Desktop banner */}
            <div className="hidden md:block pointer-events-auto bg-primary text-primary-foreground border-t border-border/30">
                <div className="container py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex items-center gap-3">
                            <Cookie size={20} weight="regular" className="text-accent shrink-0" />
                            <p className="text-sm text-primary-foreground/80">
                                <span className="font-semibold text-primary-foreground">{t('title')}</span>
                                {" "}{t('descriptionShort')}
                                <Link href="/cookies" className="text-accent hover:underline underline-offset-2 ml-1 transition-colors">
                                    {t('learnMore')}
                                </Link>
                            </p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <button 
                                onClick={handleManagePreferences}
                                className="text-sm text-primary-foreground/90 hover:text-primary-foreground hover:underline underline-offset-2 whitespace-nowrap transition-colors"
                            >
                                {t('managePreferences')}
                            </button>
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={handleDecline}
                                className="border-primary-foreground/30 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
                            >
                                {t('declineOptional')}
                            </Button>
                            <Button 
                                size="sm"
                                onClick={handleAccept}
                                className="bg-interactive hover:bg-interactive-hover text-cta-primary-text"
                            >
                                {t('acceptAll')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
