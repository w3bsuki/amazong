import { WelcomeClient } from "../../_components/welcome-client"

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <WelcomeClient locale={locale} />
}
