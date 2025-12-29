"use client"

import { useTranslations } from "next-intl"

/**
 * Minimal checkout footer - client component to handle Date
 * Following e-commerce best practices for distraction-free checkout
 */
export function CheckoutFooter() {
  const t = useTranslations("CheckoutFooter")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card py-4">
      <div className="container">
        <p className="text-xs text-center text-muted-foreground">
          © {currentYear} Treido. {t("allRightsReserved")}
        </p>
      </div>
    </footer>
  )
}
