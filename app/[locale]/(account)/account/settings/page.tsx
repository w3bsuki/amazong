import { Link } from "@/i18n/routing"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight as IconChevronRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

export const metadata = {
  title: "Settings | Treido",
  description: "Manage your account settings.",
}

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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>

      {sp.email_changed === "true" && (
        <Alert>
          <AlertTitle>{t("settings.emailChangedTitle")}</AlertTitle>
          <AlertDescription>{t("settings.emailChangedDescription")}</AlertDescription>
        </Alert>
      )}

      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("settings.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border px-0 py-0">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 first:rounded-t-2xl last:rounded-b-2xl"
            >
              <span className="truncate">{item.label}</span>
              <IconChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
