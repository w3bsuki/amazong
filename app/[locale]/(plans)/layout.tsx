import { setRequestLocale } from "next-intl/server"

import { FullRouteIntlProvider } from "../_providers/route-intl-provider"

export default async function PlansLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <FullRouteIntlProvider locale={locale}>{children}</FullRouteIntlProvider>
}
