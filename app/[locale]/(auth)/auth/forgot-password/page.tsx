import { ForgotPasswordForm } from "../../_components/forgot-password-form"

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <ForgotPasswordForm locale={locale} />
}
