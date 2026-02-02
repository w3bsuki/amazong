import { redirect } from "next/navigation"

interface OnboardingPageProps {
  params: Promise<{ locale: string }>
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params
  // Redirect to account type selection as the first step
  redirect(`/${locale}/onboarding/account-type`)
}
