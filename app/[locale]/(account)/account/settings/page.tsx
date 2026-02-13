import { Link } from "@/i18n/routing"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getTranslations, setRequestLocale } from "next-intl/server"

export default async function AccountSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ email_changed?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams

  const t = await getTranslations("Account")

  const links = [
    { label: t("header.profile"), href: "/account/profile" },
    { label: t("header.security"), href: "/account/security" },
    { label: t("header.addresses"), href: "/account/addresses" },
    { label: t("header.payments"), href: "/account/payments" },
    { label: t("header.notifications"), href: "/account/notifications" },
    { label: t("header.billing"), href: "/account/billing" },
  ]

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>

      {sp.email_changed === "true" && (
        <Alert>
          <AlertTitle>{t("settings.emailChangedTitle")}</AlertTitle>
          <AlertDescription>{t("settings.emailChangedDescription")}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("settings.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border bg-card px-3 py-2 text-sm hover:bg-hover active:bg-active transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
