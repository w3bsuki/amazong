import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import { validateLocale } from "@/i18n/routing"
import { AppBreadcrumb, breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import { PageShell } from "../../../_components/page-shell"
import { CreditCard, Package, CircleHelp as Question } from "lucide-react";
import { StaticPageHeaderSync } from "../../_components/static-page-header-sync"
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
    <PageShell className="pb-20 sm:pb-12 overflow-x-hidden">
      <StaticPageHeaderSync title={t("title")} backHref="/" />
      <div className="bg-primary text-primary-foreground">
        <div className="container px-4 sm:px-6 py-10 md:py-16">
          <div className="hidden md:block [&_nav]:border-border-subtle [&_nav]:mb-4 [&_a]:text-foreground [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-muted-foreground">
            <AppBreadcrumb
              items={breadcrumbPresets(tBreadcrumbs).contact}
              ariaLabel={tBreadcrumbs("ariaLabel")}
              homeLabel={tBreadcrumbs("homeLabel")}
            />
          </div>
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">{t("heroTitle")}</h1>
            <p className="text-foreground text-lg">{t("heroSubtitle")}</p>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-8">
        <ContactQuickHelpSection t={t} quickHelp={quickHelp} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ContactFormCard t={t} />
          </div>

          <ContactInfoSidebar t={t} />
        </div>

        <ContactFaqTeaser t={t} />
      </div>
    </PageShell>
  )
}
