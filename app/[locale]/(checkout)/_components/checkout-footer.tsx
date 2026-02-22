"use client"

import { useTranslations } from "next-intl"

export function CheckoutFooter() {
  const t = useTranslations("CheckoutFooter")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden lg:block border-t border-border bg-card py-3">
      <div className="container">
        <p className="text-2xs text-center text-muted-foreground">
          © {currentYear} Treido. {t("allRightsReserved")}
        </p>
      </div>
    </footer>
  )
}

