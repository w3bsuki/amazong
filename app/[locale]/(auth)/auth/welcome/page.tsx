import { WelcomeClient } from "../../_components/welcome-client"
import type { Metadata } from "next"
import { buildRouteMetadata, resolveRouteLocale } from "../_lib/route-locale-metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  return buildRouteMetadata({
    params,
    namespace: "Onboarding",
    titleKey: "accountType.title",
    descriptionKey: "accountType.subtitle",
  })
}

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await resolveRouteLocale(params)
  return <WelcomeClient locale={locale} />
}
