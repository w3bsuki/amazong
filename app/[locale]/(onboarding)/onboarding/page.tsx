import { redirect, validateLocale } from "@/i18n/routing"

interface OnboardingPageProps {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: "Onboarding | Treido",
  description: "Set up your Treido account.",
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params
  // Redirect to account type selection as the first step
  redirect({ href: "/onboarding/account-type", locale: validateLocale(locale) })
}
