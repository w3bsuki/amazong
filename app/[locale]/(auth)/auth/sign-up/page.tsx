import { SignUpForm } from "../../_components/sign-up-form"

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <SignUpForm locale={locale} />
}
