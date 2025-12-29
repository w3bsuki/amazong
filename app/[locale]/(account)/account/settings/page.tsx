import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function AccountSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ email_changed?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams

  const t = {
    title: locale === "bg" ? "Настройки" : "Settings",
    emailChangedTitle: locale === "bg" ? "Имейлът е обновен" : "Email updated",
    emailChangedDesc:
      locale === "bg"
        ? "Имейл адресът на акаунта ви беше променен успешно."
        : "Your account email address was updated successfully.",
    profile: locale === "bg" ? "Профил" : "Profile",
    security: locale === "bg" ? "Сигурност" : "Security",
    addresses: locale === "bg" ? "Адреси" : "Addresses",
    payments: locale === "bg" ? "Плащания" : "Payments",
    notifications: locale === "bg" ? "Известия" : "Notifications",
    billing: locale === "bg" ? "Фактуриране" : "Billing",
  }

  const links = [
    { label: t.profile, href: `/${locale}/account/profile` },
    { label: t.security, href: `/${locale}/account/security` },
    { label: t.addresses, href: `/${locale}/account/addresses` },
    { label: t.payments, href: `/${locale}/account/payments` },
    { label: t.notifications, href: `/${locale}/account/notifications` },
    { label: t.billing, href: `/${locale}/account/billing` },
  ]

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>

      {sp.email_changed === "true" && (
        <Alert>
          <AlertTitle>{t.emailChangedTitle}</AlertTitle>
          <AlertDescription>{t.emailChangedDesc}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border bg-card px-3 py-2 text-sm hover:bg-muted/40 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
