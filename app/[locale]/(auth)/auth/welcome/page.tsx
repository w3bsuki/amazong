import { WelcomeClient } from "../../_components/welcome-client"

export const metadata = {
  title: "Welcome | Treido",
  description: "Welcome to Treido.",
}

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <WelcomeClient locale={locale} />
}
