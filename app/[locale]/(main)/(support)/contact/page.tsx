import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import { validateLocale } from "@/i18n/routing"
import { breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import { StaticHeroPageShell } from "../../_components/static-hero-page-shell"
import { CreditCard, Package, CircleHelp as Question } from "lucide-react";
import {
  ContactFaqTeaser,
  ContactFormCard,
  ContactInfoSidebar,
  ContactQuickHelpSection,
} from "./_components/contact-page-sections"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Contact" })
  return {
    title: t("title"),
    description: t("metaDescription"),
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations("Contact")
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  const quickHelp = [
    { icon: Package, title: t("trackOrder"), desc: t("trackOrderDesc"), href: "/account/orders" },
    { icon: CreditCard, title: t("paymentIssues"), desc: t("paymentIssuesDesc"), href: "/customer-service" },
    { icon: Question, title: t("productQuestions"), desc: t("productQuestionsDesc"), href: "/customer-service" },
  ]

  return (
    <StaticHeroPageShell
      title={t("title")}
      breadcrumbItems={breadcrumbPresets(tBreadcrumbs).contact}
      breadcrumbAriaLabel={tBreadcrumbs("ariaLabel")}
      breadcrumbHomeLabel={tBreadcrumbs("homeLabel")}
      hero={
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">{t("heroTitle")}</h1>
          <p className="text-foreground text-lg">{t("heroSubtitle")}</p>
        </div>
      }
    >
        <ContactQuickHelpSection t={t} quickHelp={quickHelp} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ContactFormCard t={t} />
          </div>

          <ContactInfoSidebar t={t} />
        </div>

        <ContactFaqTeaser t={t} />
    </StaticHeroPageShell>
  )
}
